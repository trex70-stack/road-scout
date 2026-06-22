"""
YOLOv8n-Training fuer Road Scout (Schilder + Hindernisse).
Laeuft auf Apple Silicon mit MPS-Backend.

Nutzung:
    training/venv/bin/python training/train.py

Optionen:
    --epochs 100      Anzahl Trainingsepochen
    --batch 16        Batch-Size
    --imgsz 640       Bildgroesse
    --device mps      Geraet (mps fuer Apple Silicon, cpu als Fallback)
"""

import argparse
from pathlib import Path
from ultralytics import YOLO

BASE = Path(__file__).parent
DATA_YAML = BASE / "road_scout.yaml"
WEIGHTS = "yolov8n.pt"
DEFAULT_EPOCHS = 100
DEFAULT_BATCH = 16
DEFAULT_IMGSZ = 640


def main():
    parser = argparse.ArgumentParser(description="Road Scout YOLOv8n Training")
    parser.add_argument("--epochs", type=int, default=DEFAULT_EPOCHS)
    parser.add_argument("--batch", type=int, default=DEFAULT_BATCH)
    parser.add_argument("--imgsz", type=int, default=DEFAULT_IMGSZ)
    parser.add_argument("--device", type=str, default="mps")
    parser.add_argument("--resume", type=str, default=None, help="Pfad zu last.pt fuer Resume")
    args = parser.parse_args()

    if args.resume:
        print(f"[training] Resume von {args.resume}")
        model = YOLO(args.resume)
    else:
        print(f"[training] Lade Basis-Gewichte: {WEIGHTS}")
        model = YOLO(WEIGHTS)

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
        patience=20,
        save=True,
        save_period=10,
        val=True,
        plots=True,
        verbose=True,
    )

    print("\n[training] Abgeschlossen.")
    print(f"[training] Beste Gewichte: road_scout_runs/train/weights/best.pt")
    print(f"\nNaechster Schritt:")
    print(f"  training/venv/bin/python training/export_models.py")
    return results


if __name__ == "__main__":
    main()
