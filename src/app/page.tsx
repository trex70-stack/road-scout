"use client";

import { useState } from "react";
import { useDashboardEngine } from "@/hooks/useDashboardEngine";
import { SpeedDisplay } from "@/components/dashboard/SpeedDisplay";
import { SignDisplay } from "@/components/dashboard/SignDisplay";
import { RoadInfoPanel } from "@/components/dashboard/RoadInfoPanel";
import { ObstacleList } from "@/components/dashboard/ObstacleList";
import { CameraPreview } from "@/components/dashboard/CameraPreview";
import { MapView } from "@/components/map/MapViewClient";
import { SafetyNotice } from "@/components/dashboard/SafetyNotice";

export default function DashboardPage() {
  const [detectionEnabled, setDetectionEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const { state, camera, geoError, isDetecting, isLoadingModel, modelError, detectionFps } = useDashboardEngine({
    detectionEnabled,
    cameraEnabled,
    speechEnabled,
  });

  const speedKmh = state.position?.speedMps != null ? state.position.speedMps * 3.6 : null;
  const maxSpeed = state.currentRoad?.maxSpeedKmh ?? null;
  const overspeed = speedKmh != null && maxSpeed != null && speedKmh > maxSpeed + 3;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      <SafetyNotice />

      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200">
        <RoadInfoPanel road={state.currentRoad} />
        <div className="flex items-center gap-2">
          <ToggleChip active={cameraEnabled} onClick={() => setCameraEnabled((v) => !v)} label="Kamera" />
          <ToggleChip active={detectionEnabled} onClick={() => setDetectionEnabled((v) => !v)} label="KI" />
          <ToggleChip active={speechEnabled} onClick={() => setSpeechEnabled((v) => !v)} label="Sprache" />
        </div>
      </header>

      <section className="px-4 py-3 bg-white border-b border-neutral-200">
        <div className="flex items-start justify-between gap-3">
          <SpeedDisplay
            speedKmh={speedKmh}
            maxSpeedKmh={maxSpeed}
            source={state.currentRoad?.source ?? "unknown"}
            overspeed={overspeed}
          />
          <CameraPreview
            videoRef={camera.videoRef}
            isStreaming={camera.isStreaming}
            error={camera.error}
          />
        </div>
      </section>

      <section className="flex-1 px-4 py-3 min-h-[40vh]">
        <MapView position={state.position} obstacles={state.obstacles} />
      </section>

      <section className="px-4 py-3 bg-white border-t border-neutral-200 space-y-3">
        <div>
          <h2 className="text-[10px] uppercase tracking-wide text-neutral-500 mb-1">Erkannte Schilder</h2>
          <SignDisplay signs={state.signs} />
        </div>
        <div>
          <h2 className="text-[10px] uppercase tracking-wide text-neutral-500 mb-1">Hindernisse</h2>
          <ObstacleList obstacles={state.obstacles} />
        </div>
      </section>

      <footer className="px-4 py-2 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500">
        <span>
          {isLoadingModel
            ? "Lade KI-Modell …"
            : isDetecting
            ? `Erkennung aktiv · ${detectionFps} FPS`
            : "Erkennung pausiert"}
          {state.isOffline && " · Offline"}
        </span>
        <span className="flex items-center gap-2">
          {modelError && <span className="text-orange-600">KI: {modelError}</span>}
          {geoError && <span className="text-red-600">GPS: {geoError}</span>}
        </span>
      </footer>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium border ${
        active
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white text-neutral-500 border-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
