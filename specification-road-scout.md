# Road Scout – Spezifikation

## 1. Ziel und Fokus

Road Scout ist eine App, die auf Android, iOS und im Browser läuft und dem Fahrer live die aktuelle Verkehrssituation auf einem Dashboard anzeigt.

**Dashboard-Inhalte:**
- Aktuell erkannte Verkehrsschilder. Geschwindigkeitsschilder werden besonders groß dargestellt, alle anderen Schilder etwas kleiner.
- Auf welcher Straße befinde ich mich gerade (Straßenname)
- Wie schnell fahre ich gerade (aktuelle Geschwindigkeit)
- Erlaubte Geschwindigkeit – und ob sie aus erkannten Schildern oder aus dem Kartenmaterial stammt
- Wo wurde ein Hindernis erkannt (PKW, LKW, Personen) – als Marker auf der Karte

**Ausgabe:**
- Optisches Dashboard
- Zusätzlich Sprachausgabe (Text-to-Speech) für wichtige Ansagen (z. B. „Tempolimit 60") und Gefahrenwarnungen bei erkannten Hindernissen – damit der Fahrer nicht nur auf den Bildschirm schauen muss.

**Sicherheitshinweis:**
Road Scout ist eine Assistenzfunktion und ersetzt weder den Fahrer noch die eigenen Augen. Der Fahrer trägt stets die volle Verantwortung. Die App darf während der Fahrt nicht bedient werden. Straßenschilder und Verkehrsregeln sind immer maßgeblich, auch wenn die App etwas anderes anzeigt.

## 2. Technischer Stack & Architektur

### 2.1 Frontend
- **Basis:** Next.js 14 (React) mit App Router
- **Styling:** Tailwind CSS (Mobile-First Ansatz)
- **State Management:** TanStack Query für Server-State, React Context für UI-State
- **Mobile Deployment:** Capacitor.js 6 (wrapt Next.js Static Export als native App)
- **Mobile Build:** `next build` mit `output: 'export'` → statische HTML/CSS/JS
- **Mobile Auth:** Client-Side-Only (kein SSR, keine Middleware) – AuthProvider übernimmt Redirect
- **Mobile Plattformen:** Android (API 24+) und iOS (iOS 14+) parallel

### 2.2 Karten
- **MapLibre GL JS** (WebGL) als primärer Renderer im Browser und in der App
- **MapLibre Native** als Option für höhere Performance auf Mobile
- **Datenbasis:** OpenStreetMap
- **Tempolimit aus Karte:** OSM `maxspeed`-Tags zur Bestimmung der erlaubten Geschwindigkeit, wenn kein Schild erkannt wurde
- **Reverse Geocoding:** OSM Nominatim (oder lokale/offline-DB) zur Ermittlung des Straßennamens aus den GPS-Koordinaten

### 2.3 Kamera
- **Capacitor Camera-Plugin** für den Zugriff auf die Gerätekamera
- **Dauerhafter Live-Stream** (nicht nur Einzelfoto) als Eingabe für die Bilderkennung
- **Webcam im Browser-Modus** (`getUserMedia`) als Fallback für die Web-Version

### 2.4 Bilderkennung (KI)
- **Modell:** YOLO-basiertes Objekterkennungsmodell, trainiert auf Verkehrsschilder und Hindernisse (PKW, LKW, Personen)
- **Ausführungsort:** Auf dem Gerät (On-Device) – kein Server nötig
- **Integration:** Optimiertes Modell via TensorFlow Lite / ONNX Runtime / Core ML (plattformspezifisch)
- **Vorteile:** Echtzeit-Erkennung mit niedriger Latenz, funktioniert offline im Funkloch, keine Server- und Mobilfunkkosten, Datenschutz (Kamerabilder verlassen nicht das Gerät)

### 2.5 Sprachausgabe
- **Browser:** Web Speech API (`SpeechSynthesis`)
- **Mobile:** Capacitor TTS-Plugin (z. B. `@capacitor-community/text-to-speech`) als Brücke zu nativen Sprachausgaben
- **Ansagen:** Tempolimit-Wechsel, erkannte Gefahren/Hindernisse

### 2.6 Native APIs (Capacitor)
- **Geolocation** – GPS-Position und aktuelle Geschwindigkeit
- **Camera** – Live-Stream für die Bilderkennung
- **Network** – Online/Offline-Erkennung
- **Haptics** – Vibration bei Warnungen
- **StatusBar** – Vollbild-Darstellung
- **Text-to-Speech** – Sprachausgabe
- **Push** – optional, für spätere Funktionen

### 2.7 Offline-Modus
- **Offline-Karten:** Vektor-Kacheln (Vector Tiles) im Gerätespeicher für Gebiete ohne Netzwerk
- **Gebündeltes KI-Modell:** Erkennt Schilder und Hindernisse ohne Server-Verbindung
- **Reverse Geocoding offline:** Lokale OSM-Daten-DB als Fallback, wenn Nominatim nicht erreichbar ist

### 2.8 Leistungsanforderungen
- **Bilderkennung:** Ziel ~10–15 Bilder/Sekunde (FPS) für flüssige Live-Erkennung
- **Latenz:** < 200 ms vom Kamerabild bis zum erkannten Schild auf dem Dashboard
- **Ressourcen:** Kamera + KI + Karten-Rendering sind ressourcenhungrig – Akkuverbrauch und Gerät-Erwärmung müssen überwacht und ggf. limitiert werden (z. B. FPS-Drosselung bei Akku < 20 %)
- **Hinweis:** Auf älteren Geräten ggf. Reduzierung der Modellgröße oder der FPS

## 3. Offene Fragen
- **Benutzerkonto / Login:** Noch unentschieden. Aktuell ist keine zwingende Funktion erforderlich. Falls später geräteübergreifende Synchronisation von Einstellungen/Favoriten gewünscht wird, ist ein Backend + Login nötig (dann Client-Side-Only Auth wie in 2.1 vorbereitet).
- **Backend:** Nur nötig, falls Login/Sync gebaut wird. Ohne Login läuft die App rein lokal.
