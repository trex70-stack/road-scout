import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { ensureBackend, tf } from "./tfBackend";
import type { ObstacleType } from "@/lib/types";

export interface ObstacleBox {
  type: ObstacleType;
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
}

const COCO_MAP: Record<string, ObstacleType> = {
  car: "car",
  bus: "truck",
  truck: "truck",
  person: "person",
};

const LABEL_MAP: Record<ObstacleType, string> = {
  car: "PKW",
  truck: "LKW",
  person: "Person",
  unknown: "Unbekannt",
};

let modelPromise: Promise<cocoSsd.ObjectDetection> | null = null;

export async function loadObstacleModel(): Promise<cocoSsd.ObjectDetection> {
  if (!modelPromise) {
    modelPromise = (async () => {
      await ensureBackend();
      return cocoSsd.load({ base: "lite_mobilenet_v2" });
    })();
  }
  return modelPromise;
}

export async function detectObstacles(
  model: cocoSsd.ObjectDetection,
  video: HTMLVideoElement
): Promise<ObstacleBox[]> {
  if (video.readyState < 2) return [];
  const input = tf.browser.fromPixels(video);
  try {
    const raw = await model.detect(input, 20, 0.45);
    const results: ObstacleBox[] = [];
    for (const det of raw) {
      const type = COCO_MAP[det.class];
      if (!type) continue;
      results.push({
        type,
        label: LABEL_MAP[type],
        confidence: det.score,
        bbox: det.bbox as [number, number, number, number],
      });
    }
    return results;
  } finally {
    input.dispose();
  }
}
