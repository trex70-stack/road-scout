# Road Scout – YOLO-Training

Training eines vereinheitlichten YOLOv8n-Modells für Verkehrsschilder + Hindernisse.
Läuft lokal auf Apple Silicon (M1/M2/M3) mit MPS-Backend.

## Voraussetzungen

- Python 3.11 (bereits unter `/Users/thomas/.local/bin/python3.11`)
- Virtualenv bereits erstellt unter `training/venv/`
- Ultralytics bereits installiert

Falls die venv fehlt:
```bash
/Users/thomas/.local/bin/python3.11 -m venv training/venv
training/venv/bin/pip install ultralytics
```

## Schritt 1 – Datensatz vorbereiten

Lädt GTSDB (deutsche Verkehrsschilder) + COCO-Subset (Autos, LKW, Busse, Personen)
und konvertiert beide in das YOLO-Format.

```bash
training/venv/bin/python training/prepare_dataset.py
```

**Quellen:**
- GTSDB: ~900 Bilder mit deutschen Verkehrsschildern (mit Bounding-Boxes)
- COCO 2017: 2000 Bilder gefiltert auf Auto/LKW/Bus/Person

**Klassen (11):**
0. speed_limit_30, 1. speed_limit_50, 2. speed_limit_70, 3. speed_limit_100,
4. stop, 5. yield, 6. no_entry, 7. car, 8. truck, 9. bus, 10. person

**Ergebnis:** `training/data/road_scout/` (Bilder + YOLO-Labels)

## Schritt 2 – Training

```bash
training/venv/bin/python training/train.py
```

**Optionen:**
```bash
training/venv/bin/python training/train.py --epochs 100 --batch 16 --imgsz 640 --device mps
```

- `--device mps`: Apple Silicon GPU (Standard)
- `--device cpu`: Fallback falls MPS Probleme macht
- `--resume road_scout_runs/train/weights/last.pt`: Abgebrochenes Training fortsetzen

**Dauer auf M1 Pro:** ca. 30–60 Minuten für 100 Epochen (je nach Datensatzgröße)

**Ergebnis:** `road_scout_runs/train/weights/best.pt` (bestes Modell)

## Schritt 3 – Modell exportieren

Exportiert `best.pt` in alle drei Ziel-Formate:

```bash
training/venv/bin/python training/export_models.py
```

**Ergebnis:** `public/models/yolov8n_road/`
- `web/` → TF.js-Modell (`model.json` + Gewichte) für Browser + Capacitor
- `android/` → TFLite-Modell für native Android
- `ios/` → Core ML-Modell (`.mlpackage`) für native iOS

## Schritt 4 – Im Code einbinden

Nach dem Export das TF.js-Modell im Code aktivieren:
```typescript
// In src/lib/detection/signDetector.ts oder neuem yoloDetector.ts
setCustomSignModelUrl("/models/yolov8n_road/web/model.json");
```

## Datensätze erweitern

Um die Erkennungsqualität zu verbessern, können weitere Datensätze hinzugefügt werden:
- **Mapillary Traffic Sign Dataset:** größerer, internationaler Schilder-Datensatz
- **GTSRB:** 50.000+ Schilder-Bilder (Klassifikation, braucht Bounding-Box-Anpassung)
- **Eigene Aufnahmen:** Kamera im Auto, Bilder nachlabeln mit LabelImg oder Roboflow

## Troubleshooting

**MPS-Fehler:** `--device cpu` verwenden, falls MPS bei bestimmten Operationen fehlschlägt.

**Out of Memory:** `--batch 8` oder `--batch 4` reduzieren.

**Training zu langsam:** `--imgsz 416` statt 640 verwenden (schneller, etwas weniger genau).
