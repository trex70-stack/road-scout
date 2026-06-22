"""
Export des trainierten YOLOv8n-Modells.
Kopiert das ONNX-Modell in das public-Verzeichnis der App.

Das ONNX-Modell wird direkt via ONNX Runtime Web im Browser geladen.
Keine Konvertierung in TF.js/TFLite/CoreML noetig – ONNX ist universell.

Nutzung:
    training/venv/bin/python training/export_models.py

Optionen:
    --weights runs/detect/road_scout_runs/train/weights/best.onnx
"""

import argparse
import shutil
from pathlib import Path

BASE = Path(__file__).parent
PROJECT_ROOT = BASE.parent
DEFAULT_WEIGHTS = "runs/detect/road_scout_runs/train/weights/best.onnx"
EXPORT_TARGET = PROJECT_ROOT / "public" / "models" / "yolov8n_road"


def main():
    parser = argparse.ArgumentParser(description="Road Scout Modell-Export")
    parser.add_argument("--weights", type=str, default=DEFAULT_WEIGHTS)
    args = parser.parse_args()

    weights_path = Path(args.weights)
    if not weights_path.exists():
        pt_path = Path(args.weights.replace(".onnx", ".pt"))
        if pt_path.exists():
            print(f"[export] ONNX nicht gefunden, aber PT vorhanden: {pt_path}")
            print(f"[export] Bitte zuerst ONNX exportieren:")
            print(f"  training/venv/bin/python -c \"from ultralytics import YOLO; YOLO('{pt_path}').export(format='onnx')\"")
            return
        print(f"[export] Fehler: Gewichte nicht gefunden: {weights_path}")
        return

    EXPORT_TARGET.mkdir(parents=True, exist_ok=True)
    dest = EXPORT_TARGET / "best.onnx"
    shutil.copy(weights_path, dest)
    size_mb = dest.stat().st_size / (1024 * 1024)
    print(f"\n[export] ONNX-Modell kopiert: {dest} ({size_mb:.1f} MB)")
    print(f"\n[export] Die App laedt das Modell automatisch von /models/yolov8n_road/best.onnx")
    print(f"[export] Keine weitere Code-Aenderung noetig.")


if __name__ == "__main__":
    main()
