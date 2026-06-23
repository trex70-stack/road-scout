"""
YOLOv8-Training fuer Road Scout (Schilder + Hindernisse).
Laeuft auf Apple Silicon mit MPS-Backend.

Nutzung:
    training/venv/bin/python training/train.py

Optionen:
    --epochs 100      Anzahl Trainingsepochen
    --batch 8         Batch-Size (reduziert fuer 1280px)
    --imgsz 1280      Bildgroesse (hoeher = besser fuer kleine Schilder)
    --device mps      Geraet (mps fuer Apple Silicon, cpu als Fallback)
    --model yolov8s.pt  Modellgroesse (n=nano, s=small, m=medium)
"""

import argparse
from pathlib import Path
from ultralytics import YOLO

BASE = Path(__file__).parent
DATA_YAML = BASE / "road_scout.yaml"
DEFAULT_MODEL = "yolov8s.pt"
DEFAULT_EPOCHS = 100
DEFAULT_BATCH = 8
DEFAULT_IMGSZ = 1280


def main():
    parser = argparse.ArgumentParser(description="Road Scout YOLOv8 Training")
    parser.add_argument("--epochs", type=int, default=DEFAULT_EPOCHS)
    parser.add_argument("--batch", type=int, default=DEFAULT_BATCH)
    parser.add_argument("--imgsz", type=int, default=DEFAULT_IMGSZ)
    parser.add_argument("--device", type=str, default="mps")
    parser.add_argument("--model", type=str, default=DEFAULT_MODEL,
                        help="yolov8n.pt (nano) oder yolov8s.pt (small) oder yolov8m.pt (medium)")
    parser.add_argument("--resume", type=str, default=None, help="Pfad zu last.pt fuer Resume")
    args = parser.parse_args()

    if args.resume:
        print(f"[training] Resume von {args.resume}")
        model = YOLO(args.resume)
    else:
        print(f"[training] Lade Basis-Gewichte: {args.model}")
        model = YOLO(args.model)

    print(f"[training] Device: {args.device}")
    print(f"[training] Epochs: {args.epochs}, Batch: {args.batch}, ImgSize: {args.imgsz}")
    print(f"[training] Daten: {DATA_YAML}")
    print("=" * 50)

    results = model.train(
        data=str(DATA_YAML),
        epochs=args.epochs,
        batch=args.batch,
        imgsz=args.imgsz,
        device=args.device,
        project="road_scout_runs",
        name="train",
        exist_ok=True,
        patience=30,
        save=True,
        save_period=10,
        val=True,
        plots=True,
        verbose=True,
        # Augmentierung fuer mehr Vielfalt
        mosaic=1.0,
        mixup=0.15,
        copy_paste=0.1,
        # Kleine-Objekt-Boost
        close_mosaic=15,
        # Skalierung fuer verschiedene Distanzen
        scale=0.5,
        # Hue/Sat/Val fuer verschiedene Lichtverhaeltnisse
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        # Rotation leicht (Schilder sind meist aufrecht)
        degrees=5.0,
        translate=0.1,
        shear=2.0,
        perspective=0.0,
        flipud=0.0,
        fliplr=0.5,
    )

    print("\n[training] Abgeschlossen.")
    print(f"[training] Beste Gewichte: road_scout_runs/train/weights/best.pt")
    print(f"\nNaechster Schritt:")
    print(f"  training/venv/bin/python training/export_models.py")
    return results


if __name__ == "__main__":
    main()
