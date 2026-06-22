"use client";

import type { DetectedObstacle } from "@/lib/types";

interface Props {
  obstacles: DetectedObstacle[];
}

const OBSTACLE_LABELS: Record<DetectedObstacle["type"], string> = {
  car: "PKW",
  truck: "LKW",
  person: "Person",
  unknown: "Unbekannt",
};

const OBSTICLE_COLORS: Record<DetectedObstacle["type"], string> = {
  car: "bg-blue-100 text-blue-800 border-blue-300",
  truck: "bg-orange-100 text-orange-800 border-orange-300",
  person: "bg-red-100 text-red-800 border-red-300",
  unknown: "bg-neutral-100 text-neutral-800 border-neutral-300",
};

export function ObstacleList({ obstacles }: Props) {
  if (obstacles.length === 0) {
    return (
      <div className="text-xs text-neutral-500 py-2">Keine Hindernisse erkannt.</div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {obstacles.slice(0, 8).map((o) => (
        <div
          key={o.id}
          className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
            OBSTICLE_COLORS[o.type]
          }`}
        >
          <span>{OBSTACLE_LABELS[o.type]}</span>
          {o.distanceMeters != null && (
            <span className="opacity-70 tabular-nums">~{Math.round(o.distanceMeters)}m</span>
          )}
        </div>
      ))}
    </div>
  );
}
