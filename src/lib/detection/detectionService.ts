import type {
  DetectedObstacle,
  DetectedSign,
  GeoPosition,
  SignType,
  ObstacleType,
} from "@/lib/types";
import { loadYoloModel, runYoloDetection } from "./yoloDetector";
import {
  estimateDistanceMeters,
  estimateBearingDeg,
  offsetLatLng,
} from "./geoEstimate";

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${seq++}`;

export interface FrameDetections {
  signs: DetectedSign[];
  obstacles: DetectedObstacle[];
}

const SIGN_CLASS_MAP: Record<string, { type: SignType; label: string; value?: number }> = {
  speed_limit_30: { type: "speed_limit", label: "Tempolimit", value: 30 },
  speed_limit_50: { type: "speed_limit", label: "Tempolimit", value: 50 },
  speed_limit_70: { type: "speed_limit", label: "Tempolimit", value: 70 },
  speed_limit_100: { type: "speed_limit", label: "Tempolimit", value: 100 },
  stop: { type: "stop", label: "Stopp" },
  yield: { type: "yield", label: "Vorfahrt achten" },
  no_entry: { type: "no_entry", label: "Einfahrt verboten" },
};

const OBSTACLE_CLASS_MAP: Record<string, { type: ObstacleType; label: string }> = {
  car: { type: "car", label: "PKW" },
  truck: { type: "truck", label: "LKW" },
  bus: { type: "truck", label: "Bus" },
  person: { type: "person", label: "Person" },
};

export async function initModels(): Promise<void> {
  await loadYoloModel();
}

export async function detectFrame(
  video: HTMLVideoElement,
  position: GeoPosition | null
): Promise<FrameDetections> {
  const session = await loadYoloModel();
  const rawDetections = await runYoloDetection(session, video);

  const now = Date.now();
  const frameWidth = video.videoWidth || 1;
  const frameHeight = video.videoHeight || 1;

  const signs: DetectedSign[] = [];
  const obstacles: DetectedObstacle[] = [];

  for (const det of rawDetections) {
    const signMeta = SIGN_CLASS_MAP[det.className];
    const obstacleMeta = OBSTACLE_CLASS_MAP[det.className];

    if (signMeta) {
      signs.push({
        id: nextId("sign"),
        type: signMeta.type,
        label: signMeta.label,
        value: signMeta.value,
        confidence: det.confidence,
        detectedAt: now,
        source: "camera",
        bbox: det.bbox,
      });
    } else if (obstacleMeta) {
      const [, , , h] = det.bbox;
      const distance = estimateDistanceMeters(h, frameHeight, obstacleMeta.type);
      const [x, , w] = det.bbox;
      const relBearing = estimateBearingDeg(x + w / 2, frameWidth);

      let lat = position?.latitude ?? 0;
      let lon = position?.longitude ?? 0;
      if (position) {
        const absBearing = ((position.heading ?? 0) + relBearing + 360) % 360;
        const pos = offsetLatLng(position, absBearing, distance);
        lat = pos.latitude;
        lon = pos.longitude;
      }

      obstacles.push({
        id: nextId("obs"),
        type: obstacleMeta.type,
        label: obstacleMeta.label,
        confidence: det.confidence,
        latitude: lat,
        longitude: lon,
        distanceMeters: Number.isFinite(distance) ? Math.round(distance) : undefined,
        detectedAt: now,
        bbox: det.bbox,
      });
    }
  }

  return { signs, obstacles };
}
