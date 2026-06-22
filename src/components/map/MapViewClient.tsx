"use client";

import dynamic from "next/dynamic";
import type { GeoPosition, DetectedObstacle } from "@/lib/types";

const MapViewInner = dynamic(
  () => import("@/components/map/MapView").then((m) => m.MapView),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[200px] bg-neutral-100 animate-pulse rounded-xl" /> }
);

interface Props {
  position: GeoPosition | null;
  obstacles: DetectedObstacle[];
}

export function MapView(props: Props) {
  return <MapViewInner {...props} />;
}
