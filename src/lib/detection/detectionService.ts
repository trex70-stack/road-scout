import type {
  DetectedObstacle,
  DetectedSign,
  GeoPosition,
} from "@/lib/types";
import { loadObstacleModel, detectObstacles, type ObstacleBox } from "./obstacleDetector";
import { loadSignModel, type SignBox } from "./signDetector";
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

export async function initModels(): Promise<void> {
  await Promise.all([loadObstacleModel(), loadSignModel()]);
}

export async function detectFrame(
  video: HTMLVideoElement,
  position: GeoPosition | null
): Promise<FrameDetections> {
  const [obstacleModel, signModel] = await Promise.all([
    loadObstacleModel(),
    loadSignModel(),
  ]);

  const [obstacleBoxes, signBoxes] = await Promise.all([
    detectObstacles(obstacleModel, video),
    signModel.detect(video),
  ]);

  const now = Date.now();
  const frameWidth = video.videoWidth || 1;
  const frameHeight = video.videoHeight || 1;

  const signs: DetectedSign[] = signBoxes.map((b) => toSign(b, now));
  const obstacles: DetectedObstacle[] = obstacleBoxes.map((b) =>
    toObstacle(b, now, position, frameWidth, frameHeight)
  );

  return { signs, obstacles };
}

function toSign(box: SignBox, detectedAt: number): DetectedSign {
  return {
    id: nextId("sign"),
    type: box.type,
    label: box.label,
    value: box.value,
    confidence: box.confidence,
    detectedAt,
    source: "camera",
    bbox: box.bbox,
  };
}

function toObstacle(
  box: ObstacleBox,
  detectedAt: number,
  position: GeoPosition | null,
  frameWidth: number,
  frameHeight: number
): DetectedObstacle {
  const [x, , w, h] = box.bbox;
  const distance = estimateDistanceMeters(h, frameHeight, box.type);
  const relBearing = estimateBearingDeg(x + w / 2, frameWidth);

  let lat = position?.latitude ?? 0;
  let lon = position?.longitude ?? 0;
  if (position) {
    const absBearing = ((position.heading ?? 0) + relBearing + 360) % 360;
    const pos = offsetLatLng(position, absBearing, distance);
    lat = pos.latitude;
    lon = pos.longitude;
  }

  return {
    id: nextId("obs"),
    type: box.type,
    label: box.label,
    confidence: box.confidence,
    latitude: lat,
    longitude: lon,
    distanceMeters: Number.isFinite(distance) ? Math.round(distance) : undefined,
    detectedAt,
    bbox: box.bbox,
  };
}

export { setCustomSignModelUrl } from "./signDetector";
