# Graph Report - /Users/thomas/Projects/road-scout  (2026-06-22)

## Corpus Check
- 35 files · ~44,390,248 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 93 nodes · 88 edges · 31 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]

## God Nodes (most connected - your core abstractions)
1. `prepare_coco()` - 7 edges
2. `detectFrame()` - 7 edges
3. `log()` - 6 edges
4. `useDashboardEngine()` - 6 edges
5. `main()` - 5 edges
6. `check_sign_data()` - 4 edges
7. `runYoloDetection()` - 4 edges
8. `download()` - 3 edges
9. `extract()` - 3 edges
10. `ensure_dir()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `useDashboard()` --calls--> `useDashboardEngine()`  [INFERRED]
  /Users/thomas/Projects/road-scout/src/context/DashboardContext.tsx → /Users/thomas/Projects/road-scout/src/hooks/useDashboardEngine.ts
- `useTrafficDetection()` --calls--> `useDashboardEngine()`  [INFERRED]
  /Users/thomas/Projects/road-scout/src/hooks/useTrafficDetection.ts → /Users/thomas/Projects/road-scout/src/hooks/useDashboardEngine.ts
- `useGeolocation()` --calls--> `useDashboardEngine()`  [INFERRED]
  /Users/thomas/Projects/road-scout/src/hooks/useGeolocation.ts → /Users/thomas/Projects/road-scout/src/hooks/useDashboardEngine.ts
- `useDashboardEngine()` --calls--> `useSpeech()`  [INFERRED]
  /Users/thomas/Projects/road-scout/src/hooks/useDashboardEngine.ts → /Users/thomas/Projects/road-scout/src/hooks/useSpeech.ts
- `useDashboardEngine()` --calls--> `useCamera()`  [INFERRED]
  /Users/thomas/Projects/road-scout/src/hooks/useDashboardEngine.ts → /Users/thomas/Projects/road-scout/src/hooks/useCamera.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (6): useDashboard(), useCamera(), useDashboardEngine(), useGeolocation(), useSpeech(), useTrafficDetection()

### Community 1 - "Community 1"
Cohesion: 0.38
Nodes (10): check_sign_data(), download(), ensure_dir(), extract(), log(), main(), prepare_coco(), Datensatz-Vorbereitung fuer Road Scout. Laedt GTSDB (Verkehrsschilder) + COCO-Su (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.33
Nodes (7): detectFrame(), initModels(), nextId(), estimateBearingDeg(), estimateDistanceMeters(), offsetLatLng(), loadYoloModel()

### Community 3 - "Community 3"
Cohesion: 0.6
Nodes (5): computeIoU(), nms(), postprocess(), preprocess(), runYoloDetection()

### Community 4 - "Community 4"
Cohesion: 0.7
Nodes (4): convert_split(), log(), main(), Konvertiert den Hugging Face Datensatz 'german-traffic-sign-detection' (COCO-For

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (1): Export des trainierten YOLOv8n-Modells in alle Formate:   - TF.js (Web/Capacitor

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (1): YOLOv8n-Training fuer Road Scout (Schilder + Hindernisse). Laeuft auf Apple Sili

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (2): classify(), HudDangerBar()

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (2): parseMaxSpeed(), reverseGeocode()

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (1): GTSDB laden und in YOLO-Format konvertieren.

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (1): COCO-Subset (Auto, LKW, Bus, Person) in YOLO-Format.

## Knowledge Gaps
- **8 isolated node(s):** `Datensatz-Vorbereitung fuer Road Scout. Laedt GTSDB (Verkehrsschilder) + COCO-Su`, `COCO val2017-Subset (Auto, LKW, Bus, Person) in YOLO-Format.`, `Prüft, ob Schilder-Daten manuell hinzugefügt wurden.`, `Export des trainierten YOLOv8n-Modells in alle Formate:   - TF.js (Web/Capacitor`, `Konvertiert den Hugging Face Datensatz 'german-traffic-sign-detection' (COCO-For` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 11`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `QueryProvider()`, `QueryProvider.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `ObstacleList()`, `ObstacleList.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `SafetyNotice()`, `SafetyNotice.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `RoadInfoPanel()`, `RoadInfoPanel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `MapView()`, `MapViewClient.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `MapView()`, `MapView.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `tailwind.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `server.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `capacitor.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `CameraPreview.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `SignDisplay.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `SpeedDisplay.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `GTSDB laden und in YOLO-Format konvertieren.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `COCO-Subset (Auto, LKW, Bus, Person) in YOLO-Format.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `detectFrame()` connect `Community 2` to `Community 3`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `detectFrame()` (e.g. with `loadYoloModel()` and `runYoloDetection()`) actually correct?**
  _`detectFrame()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `useDashboardEngine()` (e.g. with `useDashboard()` and `useSpeech()`) actually correct?**
  _`useDashboardEngine()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Datensatz-Vorbereitung fuer Road Scout. Laedt GTSDB (Verkehrsschilder) + COCO-Su`, `COCO val2017-Subset (Auto, LKW, Bus, Person) in YOLO-Format.`, `Prüft, ob Schilder-Daten manuell hinzugefügt wurden.` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._