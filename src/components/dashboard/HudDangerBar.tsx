"use client";

import type { DetectedObstacle } from "@/lib/types";

interface Props {
  obstacles: DetectedObstacle[];
}

interface DangerLevel {
  color: string;
  barColor: string;
  label: string;
  pulse: boolean;
}

export function classify(distance: number): DangerLevel {
  if (distance < 20) {
    return { color: "text-red-700", barColor: "bg-red-600", label: "Gefahr", pulse: true };
  }
  if (distance < 50) {
    return { color: "text-orange-700", barColor: "bg-orange-500", label: "Achtung", pulse: false };
  }
  return { color: "text-emerald-700", barColor: "bg-emerald-500", label: "Frei", pulse: false };
}

const MAX_DISTANCE = 100;

export function HudDangerBar({ obstacles }: Props) {
  const withDistance = obstacles.filter((o) => o.distanceMeters != null);
  const nearest = withDistance.sort(
    (a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity)
  )[0];

  if (!nearest) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 border border-neutral-200">
        <span className="text-xs text-neutral-500">Kein Hindernis in Reichweite</span>
        <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
          <div className="h-full bg-emerald-400" style={{ width: "100%" }} />
        </div>
      </div>
    );
  }

  const distance = nearest.distanceMeters ?? 0;
  const level = classify(distance);
  const fillPct = Math.max(0, Math.min(100, (1 - distance / MAX_DISTANCE) * 100));

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${
        level.pulse ? "border-red-400 animate-pulse" : "border-neutral-200"
      } bg-white`}
    >
      <div className="flex flex-col">
        <span className={`text-xs font-bold ${level.color}`}>{level.label}</span>
        <span className="text-[10px] text-neutral-500 uppercase">{nearest.label}</span>
      </div>
      <div className="flex-1 h-3 rounded-full bg-neutral-200 overflow-hidden relative">
        <div
          className={`h-full ${level.barColor} transition-all duration-300`}
          style={{ width: `${fillPct}%` }}
        />
      </div>
      <div className="flex flex-col items-end tabular-nums">
        <span className={`text-base font-bold ${level.color}`}>{Math.round(distance)}</span>
        <span className="text-[9px] text-neutral-500 uppercase">Meter</span>
      </div>
    </div>
  );
}
