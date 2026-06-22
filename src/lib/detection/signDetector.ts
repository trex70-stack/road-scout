import { ensureBackend, tf } from "./tfBackend";
import type { SignType } from "@/lib/types";

export interface SignBox {
  type: SignType;
  label: string;
  value?: number;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface SignDetectionModel {
  detect(video: HTMLVideoElement): Promise<SignBox[]>;
}

let modelPromise: Promise<SignDetectionModel> | null = null;
let customModelUrl: string | null = null;

export function setCustomSignModelUrl(url: string | null): void {
  if (url !== customModelUrl) {
    customModelUrl = url;
    modelPromise = null;
  }
}

export async function loadSignModel(): Promise<SignDetectionModel> {
  if (!modelPromise) {
    modelPromise = customModelUrl ? loadCustomModel(customModelUrl) : Promise.resolve(new StubSignModel());
  }
  return modelPromise;
}

async function loadCustomModel(url: string): Promise<SignDetectionModel> {
  await ensureBackend();
  const graph = await tf.loadGraphModel(url);
  return new CustomSignModel(graph);
}

class StubSignModel implements SignDetectionModel {
  async detect(): Promise<SignBox[]> {
    return [];
  }
}

class CustomSignModel implements SignDetectionModel {
  constructor(private readonly graph: tf.GraphModel) {}

  async detect(video: HTMLVideoElement): Promise<SignBox[]> {
    if (video.readyState < 2) return [];
    const input = tf.browser.fromPixels(video);
    try {
      const resized = tf.image.resizeBilinear(input, [640, 640]);
      const normalized = resized.div(255);
      const batched = normalized.expandDims(0);
      const output = this.graph.predict(batched) as tf.Tensor;
      return parseYoloOutput(output, video.videoWidth, video.videoHeight);
    } finally {
      input.dispose();
    }
  }
}

function parseYoloOutput(
  output: tf.Tensor,
  frameWidth: number,
  frameHeight: number
): SignBox[] {
  const data = output.dataSync();
  output.dispose();
  const boxes: SignBox[] = [];
  const numClasses = 6;
  const rowLen = 5 + numClasses;
  const numDetections = Math.floor(data.length / rowLen);

  for (let i = 0; i < numDetections; i++) {
    const off = i * rowLen;
    const objConf = data[off + 4];
    if (objConf < 0.5) continue;
    let bestClass = 0;
    let bestConf = 0;
    for (let c = 0; c < numClasses; c++) {
      const conf = data[off + 5 + c];
      if (conf > bestConf) {
        bestConf = conf;
        bestClass = c;
      }
    }
    const confidence = objConf * bestConf;
    if (confidence < 0.5) continue;

    const cx = data[off] * frameWidth;
    const cy = data[off + 1] * frameHeight;
    const w = data[off + 2] * frameWidth;
    const h = data[off + 3] * frameHeight;
    const bbox: [number, number, number, number] = [cx - w / 2, cy - h / 2, w, h];

    const { type, label, value } = classToSign(bestClass);
    boxes.push({ type, label, value, confidence, bbox });
  }
  return boxes;
}

function classToSign(classId: number): { type: SignType; label: string; value?: number } {
  switch (classId) {
    case 0:
      return { type: "speed_limit", label: "Tempolimit", value: 30 };
    case 1:
      return { type: "speed_limit", label: "Tempolimit", value: 50 };
    case 2:
      return { type: "speed_limit", label: "Tempolimit", value: 70 };
    case 3:
      return { type: "stop", label: "Stopp" };
    case 4:
      return { type: "yield", label: "Vorfahrt achten" };
    case 5:
      return { type: "no_entry", label: "Einfahrt verboten" };
    default:
      return { type: "other", label: "Schild" };
  }
}
