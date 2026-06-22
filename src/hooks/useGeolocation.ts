"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoPosition } from "@/lib/types";

interface Options {
  enabled: boolean;
  highAccuracy?: boolean;
  onUpdate?: (position: GeoPosition) => void;
}

export function useGeolocation({ enabled, highAccuracy = true, onUpdate }: Options) {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    if (!enabled) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation wird auf diesem Gerät nicht unterstützt.");
      return;
    }

    const onSuccess = (pos: GeolocationPosition) => {
      const next: GeoPosition = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        speedMps: pos.coords.speed,
        heading: pos.coords.heading,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      };
      setPosition(next);
      onUpdateRef.current?.(next);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(err.message);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: highAccuracy,
      maximumAge: 1000,
      timeout: 10_000,
    });

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled, highAccuracy]);

  return { position, error };
}
