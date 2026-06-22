import type { GeoPosition } from "@/lib/types";

const EARTH_RADIUS_M = 6378137;
const REAL_HEIGHTS_M: Record<string, number> = {
  car: 1.5,
  truck: 3.5,
  person: 1.7,
  unknown: 1.5,
};
const FOCAL_FACTOR = 0.9;

export function estimateDistanceMeters(
  bboxHeightPx: number,
  frameHeightPx: number,
  type: string
): number {
  const realHeight = REAL_HEIGHTS_M[type] ?? 1.5;
  const ratio = bboxHeightPx / Math.max(1, frameHeightPx);
  if (ratio <= 0) return Infinity;
  return (realHeight * FOCAL_FACTOR) / ratio;
}

export function estimateBearingDeg(
  bboxCenterX: number,
  frameWidth: number,
  fovDeg = 70
): number {
  const offset = (bboxCenterX / frameWidth - 0.5) * 2;
  return offset * (fovDeg / 2);
}

export function offsetLatLng(
  origin: GeoPosition,
  bearingDeg: number,
  distanceMeters: number
): { latitude: number; longitude: number } {
  const bearing = (bearingDeg * Math.PI) / 180;
  const lat1 = (origin.latitude * Math.PI) / 180;
  const lon1 = (origin.longitude * Math.PI) / 180;
  const dByR = distanceMeters / EARTH_RADIUS_M;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(dByR) + Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing)
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
      Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat2)
    );
  return {
    latitude: (lat2 * 180) / Math.PI,
    longitude: (lon2 * 180) / Math.PI,
  };
}
