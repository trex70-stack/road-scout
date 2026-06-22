# Graph Report - /Users/thomas/Projects/road-scout  (2026-06-22)

## Corpus Check
- 33 files · ~12,680 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 80 nodes · 70 edges · 26 communities detected
- Extraction: 77% EXTRACTED · 23% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `useDashboardEngine()` - 6 edges
2. `detectFrame()` - 5 edges
3. `toObstacle()` - 5 edges
4. `loadSignModel()` - 4 edges
5. `loadObstacleModel()` - 3 edges
6. `detectObstacles()` - 3 edges
7. `nextId()` - 3 edges
8. `initModels()` - 3 edges
9. `loadCustomModel()` - 3 edges
10. `CustomSignModel` - 3 edges

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
Cohesion: 0.2
Nodes (6): classToSign(), CustomSignModel, loadCustomModel(), parseYoloOutput(), StubSignModel, ensureBackend()

### Community 2 - "Community 2"
Cohesion: 0.39
Nodes (6): nextId(), toObstacle(), toSign(), estimateBearingDeg(), estimateDistanceMeters(), offsetLatLng()

### Community 3 - "Community 3"
Cohesion: 0.43
Nodes (5): detectFrame(), initModels(), detectObstacles(), loadObstacleModel(), loadSignModel()

### Community 4 - "Community 4"
Cohesion: 0.4
Nodes (0): 

### Community 5 - "Community 5"
Cohesion: 0.67
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (2): classify(), HudDangerBar()

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (2): parseMaxSpeed(), reverseGeocode()

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

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

## Knowledge Gaps
- **Thin community `Community 8`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `QueryProvider()`, `QueryProvider.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `ObstacleList()`, `ObstacleList.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `SafetyNotice()`, `SafetyNotice.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `RoadInfoPanel()`, `RoadInfoPanel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `MapView()`, `MapViewClient.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `MapView()`, `MapView.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `tailwind.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `server.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `capacitor.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `CameraPreview.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `SignDisplay.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `SpeedDisplay.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `detectFrame()` connect `Community 3` to `Community 2`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `loadSignModel()` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `useDashboardEngine()` (e.g. with `useDashboard()` and `useSpeech()`) actually correct?**
  _`useDashboardEngine()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `detectFrame()` (e.g. with `loadObstacleModel()` and `loadSignModel()`) actually correct?**
  _`detectFrame()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `toObstacle()` (e.g. with `estimateDistanceMeters()` and `estimateBearingDeg()`) actually correct?**
  _`toObstacle()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `loadSignModel()` (e.g. with `initModels()` and `detectFrame()`) actually correct?**
  _`loadSignModel()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `loadObstacleModel()` (e.g. with `initModels()` and `detectFrame()`) actually correct?**
  _`loadObstacleModel()` has 2 INFERRED edges - model-reasoned connections that need verification._