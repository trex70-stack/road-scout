"""
Oversampling: Dupliziert Schilder-Bilder im Trainings-Datensatz,
um das Klassenungleichgewicht (227 Schilder vs 1706 Hindernisse)
auszugleichen.

Nutzung:
    training/venv/bin/python training/oversample_signs.py
"""

import shutil
from pathlib import Path

BASE = Path(__file__).parent
ROAD_SCOUT_DIR = BASE / "data" / "road_scout"
OVERSAMPLE_FACTOR = 4

SIGN_PREFIX = "sign_"


def log(msg: str):
    print(msg, flush=True)


def main():
    train_img = ROAD_SCOUT_DIR / "images" / "train"
    train_lbl = ROAD_SCOUT_DIR / "labels" / "train"

    sign_images = sorted([p for p in train_img.glob(f"{SIGN_PREFIX}*.jpg")])
    log(f"Road Scout – Schilder Oversampling")
    log(f"=" * 50)
    log(f"Gefunden: {len(sign_images)} Schilder-Bilder im Train-Set")
    log(f"Oversampling-Faktor: {OVERSAMPLE_FACTOR}x")

    created = 0
    for img_path in sign_images:
        stem = img_path.stem
        lbl_path = train_lbl / f"{stem}.txt"
        if not lbl_path.exists():
            continue

        for copy_idx in range(1, OVERSAMPLE_FACTOR):
            new_img_name = f"{stem}_os{copy_idx}.jpg"
            new_lbl_name = f"{stem}_os{copy_idx}.txt"
            dst_img = train_img / new_img_name
            dst_lbl = train_lbl / new_lbl_name

            if dst_img.exists() and dst_lbl.exists():
                continue

            shutil.copy(img_path, dst_img)
            shutil.copy(lbl_path, dst_lbl)
            created += 1

    total_signs = len(sign_images) * OVERSAMPLE_FACTOR
    total_images = len(list(train_img.glob("*.jpg")))
    log(f"\nErstellt: {created} Duplikate")
    log(f"Schilder-Bilder nach Oversampling: {total_signs}")
    log(f"Gesamt-Bilder im Train-Set: {total_images}")
    log(f"\nNaechster Schritt:")
    log(f"  training/venv/bin/python training/train.py --epochs 80 --imgsz 1280")


if __name__ == "__main__":
    main()
