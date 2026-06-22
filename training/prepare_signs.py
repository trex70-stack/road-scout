"""
Konvertiert den Hugging Face Datensatz 'german-traffic-sign-detection'
(COCO-Format, 43 Klassen) ins YOLO-Format und mappt auf unsere 7 Schilder-Klassen.

Nutzung:
    training/venv/bin/python training/prepare_signs.py

Ergebnis: Schilder-Bilder + Labels in training/data/road_scout/
 werden mit dem bestehenden COCO-Datensatz zusammengefuehrt.
"""

import json
import shutil
from pathlib import Path
import random

BASE = Path(__file__).parent
DATA_DIR = BASE / "data"
SIGNS_RAW = DATA_DIR / "signs_raw"
ROAD_SCOUT_DIR = DATA_DIR / "road_scout"

RANDOM_SEED = 42
VAL_SPLIT = 0.15

COCO_TO_YOLO = {
    35: 0,  # speed limit 20 -> 30
    36: 0,  # speed limit 30
    37: 1,  # speed limit 50
    38: 1,  # speed limit 60 -> 50
    39: 2,  # speed limit 70
    40: 2,  # speed limit 80 -> 70
    33: 3,  # speed limit 100
    34: 3,  # speed limit 120 -> 100
    8: 4,   # stop
    12: 5,  # give way
    4: 6,   # no entry
}

CLASS_NAMES = {
    0: "speed_limit_30",
    1: "speed_limit_50",
    2: "speed_limit_70",
    3: "speed_limit_100",
    4: "stop",
    5: "yield",
    6: "no_entry",
}


def log(msg: str):
    print(msg, flush=True)


def convert_split(
    split_name: str,
    img_dir: Path,
    out_img_train: Path,
    out_lbl_train: Path,
    out_img_val: Path,
    out_lbl_val: Path,
) -> int:
    coco_path = img_dir / "_annotations.coco.json"
    if not coco_path.exists():
        log(f"  [fehler] {coco_path} nicht gefunden")
        return 0

    with open(coco_path) as f:
        coco = json.load(f)

    img_by_id = {img["id"]: img for img in coco["images"]}
    anns_by_img = {}
    for ann in coco["annotations"]:
        cat_id = ann["category_id"]
        if cat_id not in COCO_TO_YOLO:
            continue
        anns_by_img.setdefault(ann["image_id"], []).append(ann)

    random.seed(RANDOM_SEED)
    count = 0
    for img_id, img_info in img_by_id.items():
        anns = anns_by_img.get(img_id, [])
        if not anns:
            continue

        file_name = img_info["file_name"]
        src = img_dir / file_name
        if not src.exists():
            continue

        h, w = img_info["height"], img_info["width"]
        is_val = split_name == "train" and random.random() < VAL_SPLIT
        dest_img = out_img_val if is_val else out_img_train
        dest_lbl = out_lbl_val if is_val else out_lbl_train

        dst_name = f"sign_{file_name}"
        shutil.copy(src, dest_img / dst_name)

        yolo_lines = []
        for ann in anns:
            yolo_cls = COCO_TO_YOLO[ann["category_id"]]
            x, y, bw, bh = ann["bbox"]
            cx = (x + bw / 2) / w
            cy = (y + bh / 2) / h
            yolo_lines.append(f"{yolo_cls} {cx:.6f} {cy:.6f} {bw / w:.6f} {bh / h:.6f}")

        lbl_name = f"sign_{Path(file_name).stem}.txt"
        with open(dest_lbl / lbl_name, "w") as f:
            f.write("\n".join(yolo_lines))
        count += 1

    return count


def main():
    log("Road Scout – Schilder-Datensatz vorbereiten")
    log("=" * 50)

    out_img_train = ROAD_SCOUT_DIR / "images" / "train"
    out_img_val = ROAD_SCOUT_DIR / "images" / "val"
    out_lbl_train = ROAD_SCOUT_DIR / "labels" / "train"
    out_lbl_val = ROAD_SCOUT_DIR / "labels" / "val"

    for d in [out_img_train, out_img_val, out_lbl_train, out_lbl_val]:
        d.mkdir(parents=True, exist_ok=True)

    log("\n=== Konvertiere Train-Split ===")
    train_count = convert_split(
        "train", SIGNS_RAW / "train",
        out_img_train, out_lbl_train, out_img_val, out_lbl_val,
    )
    log(f"  [ok] {train_count} Schilder-Bilder (train)")

    log("\n=== Konvertiere Valid-Split ===")
    val_count = convert_split(
        "val", SIGNS_RAW / "valid",
        out_img_train, out_lbl_train, out_img_val, out_lbl_val,
    )
    log(f"  [ok] {val_count} Schilder-Bilder (val)")

    log(f"\n=== Fertig ===")
    log(f"Schilder hinzugefuegt: {train_count + val_count}")
    log(f"  - Train: {train_count}")
    log(f"  - Val: {val_count}")

    log(f"\nKlassen-Mapping:")
    for yolo_id, name in CLASS_NAMES.items():
        coco_ids = [k for k, v in COCO_TO_YOLO.items() if v == yolo_id]
        log(f"  {yolo_id}: {name} <- COCO {coco_ids}")

    log(f"\nGesamtdatensatz in: {ROAD_SCOUT_DIR}")
    log(f"\nNaechster Schritt:")
    log(f"  training/venv/bin/python training/train.py --epochs 80")


if __name__ == "__main__":
    main()
