"use client";

import { useEffect, useRef } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useCamera } from "@/hooks/useCamera";
import { useTrafficDetection } from "@/hooks/useTrafficDetection";
import { useSpeech } from "@/hooks/useSpeech";
import { reverseGeocode } from "@/lib/geocoding";
import type { DetectedObstacle } from "@/lib/types";

interface Options {
  detectionEnabled: boolean;
  cameraEnabled: boolean;
  speechEnabled: boolean;
}

export function useDashboardEngine({ detectionEnabled, cameraEnabled, speechEnabled }: Options) {
  const { state, setPosition, setRoad, addSign, addObstacle, setDetecting, setOffline, setLastFrame, clearStale } = useDashboard();
  const { speak } = useSpeech();
  const lastAnnouncedLimitRef = useRef<number | null>(null);
  const lastAnnouncedObstacleRef = useRef<string | null>(null);

  const { position, error: geoError } = useGeolocation({
    enabled: true,
    highAccuracy: true,
    onUpdate: (pos) => setPosition(pos),
  });

  const camera = useCamera({ enabled: cameraEnabled, fps: 15 });

  const detection = useTrafficDetection({
    enabled: detectionEnabled && camera.isStreaming,
    videoRef: camera.videoRef,
    fps: 5,
    position: state.position,
  });

  useEffect(() => {
    setDetecting(detection.isRunning);
  }, [detection.isRunning, setDetecting]);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [setOffline]);

  useEffect(() => {
    if (!position) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const result = await reverseGeocode(position.latitude, position.longitude, controller.signal);
      const source = state.activeSpeedLimit ? "sign" : result.maxSpeedKmh != null ? "map" : "unknown";
      setRoad({
        roadName: result.roadName,
        maxSpeedKmh: state.activeSpeedLimit?.value ?? result.maxSpeedKmh ?? null,
        source,
      });
    }, 800);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [position, state.activeSpeedLimit, setRoad]);

  useEffect(() => {
    for (const sign of detection.lastResult.signs) {
      addSign(sign);
    }
    const video = camera.videoRef.current;
    setLastFrame({
      signs: detection.lastResult.signs,
      obstacles: detection.lastResult.obstacles,
      frameWidth: video?.videoWidth || 1,
      frameHeight: video?.videoHeight || 1,
      capturedAt: Date.now(),
    });
  }, [detection.lastResult, addSign, setLastFrame, camera.videoRef]);

  useEffect(() => {
    for (const obstacle of detection.lastResult.obstacles) {
      addObstacle(obstacle);
    }
  }, [detection.lastResult, addObstacle]);

  useEffect(() => {
    if (!speechEnabled) return;
    const limit = state.activeSpeedLimit?.value ?? null;
    if (limit != null && limit !== lastAnnouncedLimitRef.current) {
      lastAnnouncedLimitRef.current = limit;
      speak(`Tempolimit ${limit}`);
    }
  }, [speechEnabled, state.activeSpeedLimit, speak]);

  useEffect(() => {
    if (!speechEnabled) return;
    const nearest = state.obstacles
      .filter((o) => o.distanceMeters != null)
      .sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity))[0];
    if (nearest && nearest.id !== lastAnnouncedObstacleRef.current) {
      lastAnnouncedObstacleRef.current = nearest.id;
      const label = obstacleLabel(nearest.type);
      const dist = Math.round(nearest.distanceMeters ?? 0);
      speak(`${label} in ${dist} Metern`, {}, 5000);
    }
  }, [speechEnabled, state.obstacles, speak]);

  useEffect(() => {
    const id = setInterval(() => clearStale(15_000), 5_000);
    return () => clearInterval(id);
  }, [clearStale]);

  return {
    state,
    position,
    camera,
    geoError,
    isDetecting: detection.isRunning,
    isLoadingModel: detection.isLoadingModel,
    modelError: detection.modelError,
    detectionFps: detection.fps,
  };
}

function obstacleLabel(type: DetectedObstacle["type"]): string {
  switch (type) {
    case "car":
      return "Auto";
    case "truck":
      return "LKW";
    case "person":
      return "Person";
    default:
      return "Hindernis";
  }
}
