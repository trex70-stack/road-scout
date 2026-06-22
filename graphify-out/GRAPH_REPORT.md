# Graph Report - /Users/thomas/Projects/road-scout  (2026-06-22)

## Corpus Check
- 25 files · ~4,465 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 46 nodes · 27 edges · 22 communities detected
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `useDashboardEngine()` - 6 edges
2. `useDashboard()` - 2 edges
3. `useTrafficDetection()` - 2 edges
4. `useGeolocation()` - 2 edges
5. `useCamera()` - 2 edges
6. `useSpeech()` - 2 edges
7. `reverseGeocode()` - 2 edges
8. `parseMaxSpeed()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `useDashboardEngine()` --calls--> `useDashboard()`  [INFERRED]
  /Users/thomas/Projects/road-scout/src/hooks/useDashboardEngine.ts → /Users/thomas/Projects/road-scout/src/context/DashboardContext.tsx
- `useDashboardEngine()` --calls--> `useTrafficDetection()`  [INFERRED]
  /Users/thomas/Projects/road-scout/src/hooks/useDashboardEngine.ts → /Users/thomas/Projects/road-scout/src/hooks/useTrafficDetection.ts
- `useDashboardEngine()` --calls--> `useGeolocation()`  [INFERRED]
  /Users/thomas/Projects/road-scout/src/hooks/useDashboardEngine.ts → /Users/thomas/Projects/road-scout/src/hooks/useGeolocation.ts
- `useDashboardEngine()` --calls--> `useSpeech()`  [INFERRED]
  /Users/thomas/Projects/road-scout/src/hooks/useDashboardEngine.ts → /Users/thomas/Projects/road-scout/src/hooks/useSpeech.ts
- `useDashboardEngine()` --calls--> `useCamera()`  [INFERRED]
  /Users/thomas/Projects/road-scout/src/hooks/useDashboardEngine.ts → /Users/thomas/Projects/road-scout/src/hooks/useCamera.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (4): useCamera(), useDashboardEngine(), useGeolocation(), useSpeech()

### Community 1 - "Community 1"
Cohesion: 0.5
Nodes (1): useDashboard()

### Community 2 - "Community 2"
Cohesion: 0.67
Nodes (0): 

### Community 3 - "Community 3"
Cohesion: 0.67
Nodes (1): useTrafficDetection()

### Community 4 - "Community 4"
Cohesion: 1.0
Nodes (2): parseMaxSpeed(), reverseGeocode()

### Community 5 - "Community 5"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (0): 

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

## Knowledge Gaps
- **Thin community `Community 5`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (2 nodes): `QueryProvider()`, `QueryProvider.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (2 nodes): `ObstacleList()`, `ObstacleList.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (2 nodes): `SafetyNotice()`, `SafetyNotice.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `RoadInfoPanel()`, `RoadInfoPanel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `MapView()`, `MapViewClient.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `MapView()`, `MapView.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `tailwind.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `capacitor.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `CameraPreview.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `SignDisplay.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `SpeedDisplay.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useDashboardEngine()` connect `Community 0` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `useDashboard()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `useTrafficDetection()` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `useDashboardEngine()` (e.g. with `useDashboard()` and `useSpeech()`) actually correct?**
  _`useDashboardEngine()` has 5 INFERRED edges - model-reasoned connections that need verification._