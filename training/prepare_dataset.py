"""
Datensatz-Vorbereitung fuer Road Scout.
Lädt COCO val2017 (Hindernisse: Auto, LKW, Bus, Person)
und konvertiert in das YOLO-Format.

Verkehrsschilder: GTSDB-Quellen sind aktuell offline (404).
Schilder können später ergänzt werden (Roboflow, eigene Aufnahmen).
Das Training startet mit Hindernissen – Schilder-Klassen bleiben
im Modell vorbereitet (Null-Bilder).

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
import random

BASE = Path(__file__).parent
DATA_DIR = BASE / "data"
ROAD_SCOUT_DIR = DATA_DIR / "road_scout"
COCO_DIR = DATA_DIR / "coco"

VAL_SPLIT = 0.15
RANDOM_SEED = 42
COCO_MAX_IMAGES = 2000

COCO_ANN_URL = "http://images.cocodataset.org/annotations/annotations_trainval2017.zip"
COCO_VAL_URL = "http://images.cocodataset.org/zips/val2017.zip"

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

COCO_CLASS_NAMES = {
    1: "person",
    2: "bicycle",
    3: "car",
    4: "motorcycle",
    5: "airplane",
    6: "bus",
    7: "truck",
    8: "boat",
}


def log(msg: str):
    print(msg, flush=True)


def download(url: str, dest: Path) -> bool:
    if dest.exists():
        log(f"  [skip] {dest.name} bereits vorhanden ({dest.stat().st_size // (1024*1024)} MB)")
        return True
    log(f"  [download] {url}")
    log(f"  [download] -> {dest}")
    try:
        urllib.request.urlretrieve(url, dest)
        log(f"  [download] Fertig: {dest.stat().st_size // (1024*1024)} MB")
        return True
    except Exception as e:
        log(f"  [fehler] {e}")
        return False


def extract(zip_path: Path, dest_dir: Path):
    if not zip_path.exists():
        return
    log(f"  [extract] {zip_path.name} -> {dest_dir.name}")
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(dest_dir)


def ensure_dir(p: Path) -> Path:
    p.mkdir(parents=True, exist_ok=True)
    return p


def prepare_coco() -> list:
    """COCO val2017-Subset (Auto, LKW, Bus, Person) in YOLO-Format."""
    log("\n=== COCO val2017 (Hindernisse) ===")

    ann_zip = DATA_DIR / "annotations_trainval2017.zip"
    if not (COCO_DIR / "annotations").exists():
        if download(COCO_ANN_URL, ann_zip):
            extract(ann_zip, COCO_DIR)

    instances_path = COCO_DIR / "annotations" / "instances_val2017.json"
    if not instances_path.exists():
        log("  [fehler] COCO-Annotationen nicht gefunden.")
        return []

    log("  [parse] Lese instances_val2017.json …")
    with open(instances_path) as f:
        coco = json.load(f)

    cat_ids = set(COCO_CLASS_MAP.keys())
    img_by_id = {img["id"]: img for img in coco["images"]}

    img_anns = {}
    for ann in coco["annotations"]:
        if ann["category_id"] not in cat_ids:
            continue
        img_anns.setdefault(ann["image_id"], []).append(ann)

    sorted_img_ids = sorted(img_anns.keys())
    log(f"  [info] {len(sorted_img_ids)} Bilder mit relevanten Objekten in val2017")

    random.seed(RANDOM_SEED)
    random.shuffle(sorted_img_ids)
    selected = sorted_img_ids[:COCO_MAX_IMAGES]
    log(f"  [info] Nehme {len(selected)} Bilder fuer Training")

    val_zip = DATA_DIR / "val2017.zip"
    val_img_dir = COCO_DIR / "val2017"
    if not val_img_dir.exists():
        if download(COCO_VAL_URL, val_zip):
            extract(val_zip, COCO_DIR)

    if not val_img_dir.exists():
        log("  [fehler] val2017-Bilder nicht gefunden.")
        return []

    out_img = ensure_dir(ROAD_SCOUT_DIR / "images" / "train")
    out_img_val = ensure_dir(ROAD_SCOUT_DIR / "images" / "val")
    out_lbl = ensure_dir(ROAD_SCOUT_DIR / "labels" / "train")
    out_lbl_val = ensure_dir(ROAD_SCOUT_DIR / "labels" / "val")

    samples = []
    skipped = 0
    for img_id in selected:
        img_info = img_by_id[img_id]
        file_name = img_info["file_name"]
        src = val_img_dir / file_name
        if not src.exists():
            skipped += 1
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

    log(f"  [ok] {len(samples)} Hindernis-Bilder konvertiert ({skipped} übersprungen)")
    return samples


def check_sign_data() -> list:
    """Prüft, ob Schilder-Daten manuell hinzugefügt wurden."""
    sign_dir = ROAD_SCOUT_DIR / "images" / "train"
    sign_samples = [
        str(p)
        for p in sign_dir.glob("gtsdb_*.jpg")
        if (ROAD_SCOUT_DIR / "labels" / "train" / f"{p.stem}.txt").exists()
    ]
    if sign_samples:
        log(f"\n=== Schilder ===")
        log(f"  [ok] {len(sign_samples)} Schilder-Bilder gefunden")
    return sign_samples


def main():
    log("Road Scout – Datensatz-Vorbereitung")
    log("=" * 50)
    log(f"Python: {sys.version.split()[0]}")
    log(f"Data-Dir: {DATA_DIR}")

    ensure_dir(ROAD_SCOUT_DIR / "images" / "train")
    ensure_dir(ROAD_SCOUT_DIR / "images" / "val")
    ensure_dir(ROAD_SCOUT_DIR / "labels" / "train")
    ensure_dir(ROAD_SCOUT_DIR / "labels" / "val")

    coco_samples = prepare_coco()
    sign_samples = check_sign_data()

    total = len(sign_samples) + len(coco_samples)
    log(f"\n{'=' * 50}")
    log(f"=== Fertig ===")
    log(f"Gesamt: {total} Bilder")
    log(f"  - Schilder: {len(sign_samples)}")
    log(f"  - Hindernisse (COCO): {len(coco_samples)}")
    log(f"\nDatensatz: {ROAD_SCOUT_DIR}")

    if not sign_samples:
        log(f"\n[Hinweis] Keine Schilder-Daten gefunden.")
        log(f"  GTSDB-Quellen sind aktuell offline (404).")
        log(f"  Optionen:")
        log(f"    1. Roboflow Universe (traffic-sign YOLO-Datensatz)")
        log(f"    2. Eigene Aufnahmen mit LabelImg/Labelme labeln")
        log(f"    3. Mapillary Traffic Sign Dataset")
        log(f"  Bilder nach: {ROAD_SCOUT_DIR / 'images' / 'train' / 'gtsdb_*.jpg'}")
        log(f"  Labels nach:  {ROAD_SCOUT_DIR / 'labels' / 'train' / 'gtsdb_*.txt'}")
        log(f"\n  Training kann auch ohne Schilder starten (nur Hindernisse).")

    log(f"\nNaechster Schritt:")
    log(f"  training/venv/bin/python training/train.py")


if __name__ == "__main__":
    main()
