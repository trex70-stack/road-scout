"use client";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  error: string | null;
}

export function CameraPreview({ videoRef, isStreaming, error }: Props) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-neutral-900 aspect-[4/3] w-full max-w-[180px]">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
      />
      {!isStreaming && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] text-center p-2">
          {error ?? "Kamera inaktiv"}
        </div>
      )}
      <div className="absolute top-1 left-1 text-[9px] text-white/80 bg-black/40 px-1 rounded">
        LIVE
      </div>
    </div>
  );
}
