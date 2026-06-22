"use client";

import { BoundingBoxOverlay } from "./BoundingBoxOverlay";
import type { FrameBoxes } from "@/lib/types";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  error: string | null;
  lastFrame: FrameBoxes | null;
  isDetecting: boolean;
}

export function CameraPreview({ videoRef, isStreaming, error, lastFrame, isDetecting }: Props) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
      />
      <BoundingBoxOverlay frame={lastFrame} active={isDetecting} />
      {!isStreaming && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-sm text-center p-3 bg-black/40">
          {error ?? "Kamera inaktiv"}
        </div>
      )}
      <div className="absolute top-2 left-2 flex items-center gap-1">
        <span className="text-[10px] text-white bg-black/50 px-2 py-0.5 rounded-full">
          {isDetecting ? "● LIVE" : "○ PAUSE"}
        </span>
      </div>
    </div>
  );
}
