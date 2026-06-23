#!/bin/bash
# Kopiert Custom-Icons + Hintergrund in das Android-Projekt
# Wird nach `cap add android` ausgefuehrt
set -e

ICON_SRC="assets/android-icons"
RES_DIR="android/app/src/main/res"

for density in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
  cp "$ICON_SRC/mipmap-$density/ic_launcher.png" "$RES_DIR/mipmap-$density/"
  cp "$ICON_SRC/mipmap-$density/ic_launcher_round.png" "$RES_DIR/mipmap-$density/"
  cp "$ICON_SRC/mipmap-$density/ic_launcher_foreground.png" "$RES_DIR/mipmap-$density/"
done

# Hintergrundfarbe aktualisieren
cat > "$RES_DIR/values/ic_launcher_background.xml" << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0F172A</color>
</resources>
EOF

# Drawable Hintergrund (einfach dunkelblau)
cat > "$RES_DIR/drawable/ic_launcher_background.xml" << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportHeight="108"
    android:viewportWidth="108">
    <path
        android:fillColor="#0F172A"
        android:pathData="M0,0h108v108h-108z" />
</vector>
EOF

echo "[icons] Custom Icons installiert"
