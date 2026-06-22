"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { DetectedSign, DetectedObstacle } from "@/lib/types";

interface DetectionResult {
  signs: DetectedSign[];
  obstacles: DetectedObstacle[];
}

interface Options {
  enabled: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  fps?: number;
}

let idCounter = 0;
const nextId = () => `det-${Date.now()}-${idCounter++}`;

export function useTrafficDetection({ enabled, videoRef, fps = 10 }: Options) {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<DetectionResult>({ signs: [], obstacles: [] });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const detect = useCallback(async (): Promise<DetectionResult> => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return { signs: [], obstacles: [] };

    // Platzhalter: YOLO-Modell (TensorFlow Lite / ONNX Runtime / Core ML) hier anbinden.
    // Aktuell wird das Videoframe nur ausgelesen, um die Pipeline zu validieren.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _frame = video.videoWidth > 0;
    return { signs: [], obstacles: [] };
  }, [videoRef]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    const intervalMs = Math.max(1, Math.round(1000 / fps));
    intervalRef.current = setInterval(async () => {
      const result = await detect();
      setLastResult(result);
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    };
  }, [enabled, fps, detect]);

  return { isRunning, lastResult, detect, makeId: nextId };
}
