"""
Datensatz-Vorbereitung fuer Road Scout.
Laedt GTSDB (Verkehrsschilder) + COCO-Subset (Hindernisse)
und konvertiert beides in das YOLO-Format.

Nutzung:
    training/venv/bin/python training/prepare_dataset.py

Ergebnis:
    training/data/road_scout/
        images/train/*.jpg
        images/val/*.jpg
        labels/train/*.txt
        labels/val/*.txt
"""

import os
import sys
import json
import shutil
import urllib.request
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
import random
import cv2

BASE = Path(__file__).parent
DATA_DIR = BASE / "data"
ROAD_SCOUT_DIR = DATA_DIR / "road_scout"
GTSDB_DIR = DATA_DIR / "gtsdb"
COCO_DIR = DATA_DIR / "coco"

VAL_SPLIT = 0.15
RANDOM_SEED = 42

GTSDB_CLASS_MAP = {
    "00020": 0,
    "00030": 0,
    "00050": 1,
    "00070": 2,
    "00080": 2,
    "00100": 3,
    "00120": 3,
    "00060": 2,
    "00040": 1,
    "STOP": 4,
    "VORFAHRT": 5,
    "VORFAHRTSTRASSE": 5,
    "EINBAHNSTRASSE": 6,
}

COCO_CLASS_MAP = {
    2: 7,
    5: 10,
    6: 9,
    7: 8,
    1: 10,
    3: 7,
    4: 7,
    8: 8,
}

GTSDB_URLS = [
    "https://sid.erda.dk/public/archives/daaeac0d7ce1152aacd1f896c811743e/GTSDB.zip",
]

COCO_ANN_URL = "http://images.cocodataset.org/annotations/annotations_trainval2017.zip"
COCO_TRAIN_URL = "http://images.cocodataset.org/zips/train2017.zip"
COCO_VAL_URL = "http://images.cocodataset.org/zips/val2017.zip"
COCO_MAX_IMAGES = 2000


def download(url: str, dest: Path) -> bool:
    if dest.exists():
        print(f"  [skip] {dest.name} bereits vorhanden")
        return True
    print(f"  [download] {url}")
    try:
        urllib.request.urlretrieve(url, dest)
        return True
    except Exception as e:
        print(f"  [fehler] {e}")
        return False


def extract(zip_path: Path, dest_dir: Path):
    if not zip_path.exists():
        return
    print(f"  [extract] {zip_path.name} -> {dest_dir.name}")
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(dest_dir)


def ensure_dir(p: Path) -> Path:
    p.mkdir(parents=True, exist_ok=True)
    return p


def prepare_gtsdb() -> list:
    """GTSDB laden und in YOLO-Format konvertieren."""
    print("\n=== GTSDB (Verkehrsschilder) ===")
    raw_zip = DATA_DIR / "GTSDB.zip"
    if not GTSDB_DIR.exists() or not any(GTSDB_DIR.rglob("*.ppm")):
        for url in GTSDB_URLS:
            if download(url, raw_zip):
                extract(raw_zip, DATA_DIR)
                break

    ppm_files = sorted(GTSDB_DIR.rglob("*.ppm")) + sorted(GTSDB_DIR.rglob("*.png"))
    if not ppm_files:
        print("  [warn] Keine GTSDB-Bilder gefunden – ueberspringe Schilder.")
        return []

    gt_file = GTSDB_DIR / "gt.txt"
    if not gt_file.exists():
        gt_files = list(GTSDB_DIR.rglob("gt.txt"))
        if gt_files:
            gt_file = gt_files[0]
        else:
            print("  [warn] gt.txt nicht gefunden – ueberspringe Schilder.")
            return []

    annotations = {}
    with open(gt_file, "r") as f:
        for line in f:
            parts = line.strip().split(";")
            if len(parts) < 6:
                continue
            fname = parts[0]
            x1, y1, x2, y2 = int(parts[1]), int(parts[2]), int(parts[3]), int(parts[4])
            class_id_raw = parts[5].strip()
            mapped = GTSDB_CLASS_MAP.get(class_id_raw)
            if mapped is None:
                continue
            annotations.setdefault(fname, []).append((x1, y1, x2, y2, mapped))

    samples = []
    out_img = ensure_dir(ROAD_SCOUT_DIR / "images" / "train")
    out_img_val = ensure_dir(ROAD_SCOUT_DIR / "images" / "val")
    out_lbl = ensure_dir(ROAD_SCOUT_DIR / "labels" / "train")
    out_lbl_val = ensure_dir(ROAD_SCOUT_DIR / "labels" / "val")

    random.seed(RANDOM_SEED)
    for ppm_path in ppm_files:
        fname_stem = ppm_path.stem
        anns = annotations.get(ppm_path.name, [])
        if not anns:
            continue

        img = cv2.imread(str(ppm_path))
        if img is None:
            continue
        h, w = img.shape[:2]
        jpg_name = f"gtsdb_{fname_stem}.jpg"
        is_val = random.random() < VAL_SPLIT
        img_dest = out_img_val if is_val else out_img
        lbl_dest = out_lbl_val if is_val else out_lbl
        cv2.imwrite(str(img_dest / jpg_name), img)

        yolo_lines = []
        for x1, y1, x2, y2, cls in anns:
            cx = ((x1 + x2) / 2) / w
            cy = ((y1 + y2) / 2) / h
            bw = max(1, x2 - x1) / w
            bh = max(1, y2 - y1) / h
            yolo_lines.append(f"{cls} {cx:.6f} {cy:.6f} {bw:.6f} {bh:.6f}")

        with open(lbl_dest / f"gtsdb_{fname_stem}.txt", "w") as f:
            f.write("\n".join(yolo_lines))
        samples.append(str(img_dest / jpg_name))

    print(f"  [ok] {len(samples)} Schilder-Bilder konvertiert")
    return samples


def prepare_coco() -> list:
    """COCO-Subset (Auto, LKW, Bus, Person) in YOLO-Format."""
    print("\n=== COCO-Subset (Hindernisse) ===")
    ann_zip = DATA_DIR / "annotations_trainval2017.zip"
    if not (COCO_DIR / "annotations").exists():
        if download(COCO_ANN_URL, ann_zip):
            extract(ann_zip, COCO_DIR)

    instances_path = COCO_DIR / "annotations" / "instances_train2017.json"
    if not instances_path.exists():
        print("  [warn] COCO-Annotationen nicht gefunden – ueberspringe Hindernisse.")
        return []

    print("  [parse] COCO-Annotationen werden gelesen …")
    with open(instances_path) as f:
        coco = json.load(f)

    cat_ids = set(COCO_CLASS_MAP.keys())
    relevant_cats = {c["id"]: c for c in coco["categories"] if c["id"] in cat_ids}
    img_by_id = {img["id"]: img for img in coco["images"]}

    img_anns = {}
    for ann in coco["annotations"]:
        if ann["category_id"] not in cat_ids:
            continue
        img_anns.setdefault(ann["image_id"], []).append(ann)

    sorted_img_ids = sorted(img_anns.keys())
    random.seed(RANDOM_SEED)
    random.shuffle(sorted_img_ids)
    selected = sorted_img_ids[:COCO_MAX_IMAGES]

    train_zip = DATA_DIR / "train2017.zip"
    train_img_dir = COCO_DIR / "train2017"
    if not train_img_dir.exists():
        if download(COCO_TRAIN_URL, train_zip):
            extract(train_zip, COCO_DIR)

    out_img = ensure_dir(ROAD_SCOUT_DIR / "images" / "train")
    out_img_val = ensure_dir(ROAD_SCOUT_DIR / "images" / "val")
    out_lbl = ensure_dir(ROAD_SCOUT_DIR / "labels" / "train")
    out_lbl_val = ensure_dir(ROAD_SCOUT_DIR / "labels" / "val")

    samples = []
    for img_id in selected:
        img_info = img_by_id[img_id]
        file_name = img_info["file_name"]
        src = train_img_dir / file_name
        if not src.exists():
            continue

        h, w = img_info["height"], img_info["width"]
        is_val = random.random() < VAL_SPLIT
        img_dest = out_img_val if is_val else out_img
        lbl_dest = out_lbl_val if is_val else out_lbl
        dst = img_dest / f"coco_{file_name}"
        shutil.copy(src, dst)

        yolo_lines = []
        for ann in img_anns[img_id]:
            mapped = COCO_CLASS_MAP.get(ann["category_id"])
            if mapped is None:
                continue
            x, y, bw, bh = ann["bbox"]
            cx = (x + bw / 2) / w
            cy = (y + bh / 2) / h
            yolo_lines.append(f"{mapped} {cx:.6f} {cy:.6f} {bw / w:.6f} {bh / h:.6f}")

        with open(lbl_dest / f"coco_{Path(file_name).stem}.txt", "w") as f:
            f.write("\n".join(yolo_lines))
        samples.append(str(dst))

    print(f"  [ok] {len(samples)} Hindernis-Bilder konvertiert")
    return samples


def main():
    print("Road Scout – Datensatz-Vorbereitung")
    print("=" * 50)

    ensure_dir(ROAD_SCOUT_DIR / "images" / "train")
    ensure_dir(ROAD_SCOUT_DIR / "images" / "val")
    ensure_dir(ROAD_SCOUT_DIR / "labels" / "train")
    ensure_dir(ROAD_SCOUT_DIR / "labels" / "val")

    sign_samples = prepare_gtsdb()
    coco_samples = prepare_coco()

    total = len(sign_samples) + len(coco_samples)
    print(f"\n=== Fertig ===")
    print(f"Gesamt: {total} Bilder")
    print(f"  - Schilder (GTSDB): {len(sign_samples)}")
    print(f"  - Hindernisse (COCO): {len(coco_samples)}")
    print(f"\nDatensatz liegt in: {ROAD_SCOUT_DIR}")
    print(f"\nNaechster Schritt:")
    print(f"  training/venv/bin/python training/train.py")


if __name__ == "__main__":
    main()
