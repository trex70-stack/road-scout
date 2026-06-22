"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Options {
  enabled: boolean;
  fps?: number;
}

interface CameraState {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
}

export function useCamera({ enabled, fps }: Options): CameraState {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const start = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Kamera wird auf diesem Gerät nicht unterstützt.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, frameRate: fps ? { ideal: fps } : undefined },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setIsStreaming(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kamerazugriff fehlgeschlagen.");
    }
  }, [fps]);

  useEffect(() => {
    if (enabled) {
      void start();
    } else {
      stop();
    }
    return () => stop();
  }, [enabled, start, stop]);

  return { videoRef, isStreaming, error, start, stop };
}
