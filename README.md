# Road Scout

Live-Verkehrssituation auf dem Dashboard – erkennt Verkehrsschilder und Hindernisse, zeigt Geschwindigkeit, Straße und Tempolimit an. Läuft im Browser, auf Android und iOS.

> **Sicherheit:** Road Scout ist eine Assistenzfunktion und ersetzt weder den Fahrer noch die eigene Aufmerksamkeit. Die App darf während der Fahrt nicht bedient werden. Verkehrsschilder und Verkehrsregeln sind immer maßgeblich.

## Stack

- Next.js 14 (App Router, Static Export)
- Tailwind CSS (Mobile-First)
- TanStack Query (Server-State) + React Context (UI-State)
- MapLibre GL JS (Karten, OSM-Daten)
- Capacitor 6 (Mobile-Wrap für Android/iOS)
- YOLO-Basierte Bilderkennung (On-Device, Platzhalter in `useTrafficDetection`)

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
- `src/lib/` – Typen, Reverse Geocoding (OSM Nominatim)

## Offene Punkte

- YOLO-Modell-Integration (TensorFlow Lite / ONNX Runtime / Core ML)
- Offline-Karten (Vector Tiles)
- Login / Backend (aktuell unentschieden)
