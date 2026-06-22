"use client";

import type { RoadInfo } from "@/lib/types";

interface Props {
  road: RoadInfo | null;
}

export function RoadInfoPanel({ road }: Props) {
  const name = road?.roadName ?? "Unbekannte Straße";
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-neutral-500">Straße</span>
      <span className="text-base font-semibold text-neutral-900 truncate max-w-[60vw]">{name}</span>
    </div>
  );
}
