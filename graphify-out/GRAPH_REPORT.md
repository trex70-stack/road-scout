# Graph Report - /Users/thomas/Projects/road-scout  (2026-06-22)

## Corpus Check
- 36 files · ~14,792 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 96 nodes · 92 edges · 28 communities detected
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `prepare_gtsdb()` - 6 edges
2. `prepare_coco()` - 6 edges
3. `useDashboardEngine()` - 6 edges
4. `detectFrame()` - 5 edges
5. `toObstacle()` - 5 edges
6. `ensure_dir()` - 4 edges
7. `main()` - 4 edges
8. `loadSignModel()` - 4 edges
9. `download()` - 3 edges
10. `extract()` - 3 edges

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
Cohesion: 0.16
Nodes (11): detectFrame(), initModels(), detectObstacles(), loadObstacleModel(), classToSign(), CustomSignModel, loadCustomModel(), loadSignModel() (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (6): useDashboard(), useCamera(), useDashboardEngine(), useGeolocation(), useSpeech(), useTrafficDetection()

### Community 2 - "Community 2"
Cohesion: 0.4
Nodes (9): download(), ensure_dir(), extract(), main(), prepare_coco(), prepare_gtsdb(), Datensatz-Vorbereitung fuer Road Scout. Laedt GTSDB (Verkehrsschilder) + COCO-Su, GTSDB laden und in YOLO-Format konvertieren. (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.39
Nodes (6): nextId(), toObstacle(), toSign(), estimateBearingDeg(), estimateDistanceMeters(), offsetLatLng()

### Community 4 - "Community 4"
Cohesion: 0.4
Nodes (0): 

### Community 5 - "Community 5"
Cohesion: 0.67
Nodes (1): Export des trainierten YOLOv8n-Modells in alle Formate:   - TF.js (Web/Capacitor

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (1): YOLOv8n-Training fuer Road Scout (Schilder + Hindernisse). Laeuft auf Apple Sili

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (2): classify(), HudDangerBar()

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (2): parseMaxSpeed(), reverseGeocode()

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

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

## Knowledge Gaps
- **5 isolated node(s):** `Datensatz-Vorbereitung fuer Road Scout. Laedt GTSDB (Verkehrsschilder) + COCO-Su`, `GTSDB laden und in YOLO-Format konvertieren.`, `COCO-Subset (Auto, LKW, Bus, Person) in YOLO-Format.`, `Export des trainierten YOLOv8n-Modells in alle Formate:   - TF.js (Web/Capacitor`, `YOLOv8n-Training fuer Road Scout (Schilder + Hindernisse). Laeuft auf Apple Sili`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 10`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `QueryProvider()`, `QueryProvider.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `ObstacleList()`, `ObstacleList.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `SafetyNotice()`, `SafetyNotice.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `RoadInfoPanel()`, `RoadInfoPanel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `MapView()`, `MapViewClient.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `MapView()`, `MapView.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `tailwind.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `server.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `capacitor.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `CameraPreview.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `SignDisplay.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `SpeedDisplay.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `detectFrame()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `useDashboardEngine()` (e.g. with `useDashboard()` and `useSpeech()`) actually correct?**
  _`useDashboardEngine()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `detectFrame()` (e.g. with `loadObstacleModel()` and `loadSignModel()`) actually correct?**
  _`detectFrame()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `toObstacle()` (e.g. with `estimateDistanceMeters()` and `estimateBearingDeg()`) actually correct?**
  _`toObstacle()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Datensatz-Vorbereitung fuer Road Scout. Laedt GTSDB (Verkehrsschilder) + COCO-Su`, `GTSDB laden und in YOLO-Format konvertieren.`, `COCO-Subset (Auto, LKW, Bus, Person) in YOLO-Format.` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._