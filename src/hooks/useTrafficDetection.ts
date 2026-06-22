"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { DetectedSign, DetectedObstacle, GeoPosition } from "@/lib/types";
import { initModels, detectFrame } from "@/lib/detection/detectionService";

interface DetectionResult {
  signs: DetectedSign[];
  obstacles: DetectedObstacle[];
}

interface Options {
  enabled: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  fps?: number;
  position: GeoPosition | null;
}

interface DetectionState {
  isRunning: boolean;
  isLoadingModel: boolean;
  modelError: string | null;
  lastResult: DetectionResult;
  fps: number;
}

export function useTrafficDetection({ enabled, videoRef, fps = 5, position }: Options): DetectionState {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<DetectionResult>({ signs: [], obstacles: [] });
  const [measuredFps, setMeasuredFps] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runningRef = useRef(false);
  const lastFrameRef = useRef(0);

  const runDetection = useCallback(async () => {
    if (runningRef.current) return;
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    runningRef.current = true;
    try {
      const result = await detectFrame(video, position);
      setLastResult(result);
      const now = performance.now();
      const delta = now - lastFrameRef.current;
      if (delta > 0 && lastFrameRef.current > 0) {
        setMeasuredFps(Math.round(1000 / delta));
      }
      lastFrameRef.current = now;
    } catch (err) {
      setModelError(err instanceof Error ? err.message : "Erkennung fehlgeschlagen.");
    } finally {
      runningRef.current = false;
    }
  }, [videoRef, position]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      return;
    }

    let cancelled = false;
    setIsLoadingModel(true);
    setModelError(null);
    initModels()
      .catch((err) => {
        if (!cancelled) setModelError(err instanceof Error ? err.message : "Modellladefehler.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingModel(false);
      });

    const intervalMs = Math.max(1, Math.round(1000 / fps));
    intervalRef.current = setInterval(() => {
      void runDetection();
    }, intervalMs);
    setIsRunning(true);

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    };
  }, [enabled, fps, runDetection]);

  return {
    isRunning,
    isLoadingModel,
    modelError,
    lastResult,
    fps: measuredFps,
  };
}
