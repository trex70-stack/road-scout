"""
Export des trainierten YOLOv8n-Modells in alle Formate:
  - TF.js (Web/Capacitor)
  - TFLite (Android)
  - Core ML (iOS)

Nutzung:
    training/venv/bin/python training/export_models.py

Optionen:
    --weights road_scout_runs/train/weights/best.pt
"""

import argparse
import shutil
from pathlib import Path
from ultralytics import YOLO

BASE = Path(__file__).parent
PROJECT_ROOT = BASE.parent
DEFAULT_WEIGHTS = "road_scout_runs/train/weights/best.pt"
EXPORT_TARGET = PROJECT_ROOT / "public" / "models" / "yolov8n_road"


def main():
    parser = argparse.ArgumentParser(description="Road Scout Modell-Export")
    parser.add_argument("--weights", type=str, default=DEFAULT_WEIGHTS)
    args = parser.parse_args()

    weights_path = Path(args.weights)
    if not weights_path.exists():
        print(f"[export] Fehler: Gewichte nicht gefunden: {weights_path}")
        return

    model = YOLO(str(weights_path))
    EXPORT_TARGET.mkdir(parents=True, exist_ok=True)

    print("\n[export] Export TF.js (Web/Capacitor) …")
    try:
        model.export(format="tfjs")
        tfjs_src = weights_path.parent.parent / "tfjs"
        if tfjs_src.exists():
            if (EXPORT_TARGET / "web").exists():
                shutil.rmtree(EXPORT_TARGET / "web")
            shutil.copytree(tfjs_src, EXPORT_TARGET / "web")
            print(f"  -> {EXPORT_TARGET / 'web'}")
    except Exception as e:
        print(f"  [fehler] TF.js-Export: {e}")

    print("\n[export] Export TFLite (Android) …")
    try:
        model.export(format="tflite")
        tflite_src_dir = weights_path.parent.parent / "tflite"
        if tflite_src_dir.exists():
            tflite_files = list(tflite_src_dir.glob("*.tflite"))
            android_dir = EXPORT_TARGET / "android"
            android_dir.mkdir(parents=True, exist_ok=True)
            for f in tflite_files:
                shutil.copy(f, android_dir / f.name)
            metadata = list(tflite_src_dir.glob("*.txt"))
            for m in metadata:
                shutil.copy(m, android_dir / m.name)
            print(f"  -> {android_dir}")
    except Exception as e:
        print(f"  [fehler] TFLite-Export: {e}")

    print("\n[export] Export Core ML (iOS) …")
    try:
        model.export(format="coreml")
        coreml_src_dir = weights_path.parent.parent / "coreml"
        if coreml_src_dir.exists():
            mlpackage_files = list(coreml_src_dir.glob("*.mlpackage"))
            ios_dir = EXPORT_TARGET / "ios"
            ios_dir.mkdir(parents=True, exist_ok=True)
            for f in mlpackage_files:
                dst = ios_dir / f.name
                if dst.exists():
                    shutil.rmtree(dst)
                shutil.copytree(f, dst)
            print(f"  -> {ios_dir}")
    except Exception as e:
        print(f"  [fehler] CoreML-Export: {e}")

    print(f"\n[export] Fertig. Modelle liegen in: {EXPORT_TARGET}")
    print(f"\nNaechster Schritt im Code:")
    print(f"  In signDetector.ts / yoloDetector.ts die Modell-URL setzen auf:")
    print(f"  /models/yolov8n_road/web/model.json")


if __name__ == "__main__":
    main()
