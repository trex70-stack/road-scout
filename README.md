# Road Scout

Live-Verkehrssituation auf dem Dashboard – erkennt Verkehrsschilder und Hindernisse, zeigt Geschwindigkeit, Straße und Tempolimit an. Läuft im Browser, auf Android und iOS.

> **Sicherheit:** Road Scout ist eine Assistenzfunktion und ersetzt weder den Fahrer noch die eigene Aufmerksamkeit. Die App darf während der Fahrt nicht bedient werden. Verkehrsschilder und Verkehrsregeln sind immer maßgeblich.

## Stack

- Next.js 14 (App Router, Static Export)
- Tailwind CSS (Mobile-First)
- TanStack Query (Server-State) + React Context (UI-State)
- MapLibre GL JS (Karten, OSM-Daten)
- Capacitor 6 (Mobile-Wrap für Android/iOS)
- YOLO-Basierte Bilderkennung (On-Device via TensorFlow.js + COCO-SSD)

## Entwicklung

```bash
npm install
npm run dev          # Dev-Server (Browser)
```

## Build (Static Export)

```bash
npm run build        # erzeugt statischen Export in ./out
```

## Mobile (Capacitor)

Native Plattformen werden bei Bedarf hinzugefügt (erfordert Android SDK / Xcode):

```bash
npx cap add android
npx cap add ios
npm run build && npx cap sync
npx cap open android   # oder ios
```

Capacitor-Plugins installiert: Geolocation, Camera, Network, Haptics, StatusBar, Text-to-Speech.

## Architektur-Übersicht

- `src/app/` – Next.js App Router (Layout, Dashboard-Seite)
- `src/components/dashboard/` – Dashboard-Widgets (SpeedDisplay, SignDisplay, RoadInfoPanel, ObstacleList, CameraPreview, SafetyNotice)
- `src/components/map/` – MapLibre-Kartenkomponente (client-seitig, SSR-off)
- `src/context/` – DashboardContext (Redux-ähnlicher State via useReducer)
- `src/providers/` – QueryProvider (TanStack), AuthProvider (Client-Side, Login offen)
- `src/hooks/` – useGeolocation, useCamera, useSpeech, useTrafficDetection, useDashboardEngine
- `src/lib/detection/` – TensorFlow.js Backend, COCO-SSD Hinderniserkennung, YOLO-Schilder-Schnittstelle, GPS-Schätzung
- `src/lib/geocoding.ts` – Reverse Geocoding (OSM Nominatim)
- `src/lib/types.ts` – Gemeinsame Typen

## Bilderkennung (On-Device)

**Hindernisse (aktiv):** COCO-SSD `lite_mobilenet_v2` erkennt PKW, LKW, Busse (→ LKW) und Personen. Läuft via TensorFlow.js mit WebGL-Backend direkt im Browser / in der Capacitor-WebView. Geschätzt ~5 FPS.

**Schilder (Schnittstelle bereit):** `src/lib/detection/signDetector.ts` lädt ein custom YOLO-GraphModel von einer URL (via `setCustomSignModelUrl`). Bis ein trainiertes Modell bereitsteht, läuft ein Stub der `[]` zurückgibt.

**GPS-Schätzung:** Bounding-Box-Größe → Abstandsschätzung, Box-Position + GPS-Heading → GPS-Position des Hindernisses (`src/lib/detection/geoEstimate.ts`).

## Offene Punkte

- Custom YOLO-Schilder-Modell trainieren und via `setCustomSignModelUrl()` einbinden
- Offline-Karten (Vector Tiles)
- Login / Backend (aktuell unentschieden)
