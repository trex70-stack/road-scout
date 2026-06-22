import * as ort from "onnxruntime-web";
import type { BBox } from "@/lib/types";

export type DetectionClass =
  | "speed_limit_30"
  | "speed_limit_50"
  | "speed_limit_70"
  | "speed_limit_100"
  | "stop"
  | "yield"
  | "no_entry"
  | "car"
  | "truck"
  | "bus"
  | "person";

export interface YoloDetection {
  classId: number;
  className: DetectionClass;
  confidence: number;
  bbox: BBox;
}

const CLASS_NAMES: DetectionClass[] = [
  "speed_limit_30",
  "speed_limit_50",
  "speed_limit_70",
  "speed_limit_100",
  "stop",
  "yield",
  "no_entry",
  "car",
  "truck",
  "bus",
  "person",
];

const INPUT_SIZE = 640;
const CONF_THRESHOLD = 0.45;
const IOU_THRESHOLD = 0.5;
const MODEL_URL = "/models/yolov8n_road/best.onnx";

let sessionPromise: Promise<ort.InferenceSession> | null = null;

export async function loadYoloModel(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create(MODEL_URL, {
      executionProviders: ["webgl", "wasm"],
      graphOptimizationLevel: "all",
    });
  }
  return sessionPromise;
}

export async function runYoloDetection(
  session: ort.InferenceSession,
  video: HTMLVideoElement
): Promise<YoloDetection[]> {
  if (video.readyState < 2) return [];

  const input = preprocess(video, INPUT_SIZE);
  const feeds: Record<string, ort.Tensor> = {};
  const inputName = session.inputNames[0];
  feeds[inputName] = new ort.Tensor("float32", input, [1, 3, INPUT_SIZE, INPUT_SIZE]);

  const results = await session.run(feeds);
  const outputName = session.outputNames[0];
  const output = results[outputName];
  const detections = postprocess(output.data as Float32Array, video.videoWidth, video.videoHeight);

  return detections;
}

function preprocess(video: HTMLVideoElement, size: number): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const scale = Math.min(size / vw, size / vh);
  const nw = Math.round(vw * scale);
  const nh = Math.round(vh * scale);
  const offsetX = (size - nw) / 2;
  const offsetY = (size - nh) / 2;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(video, offsetX, offsetY, nw, nh);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  const tensor = new Float32Array(3 * size * size);
  for (let i = 0; i < size * size; i++) {
    tensor[i] = data[i * 4] / 255;
    tensor[size * size + i] = data[i * 4 + 1] / 255;
    tensor[2 * size * size + i] = data[i * 4 + 2] / 255;
  }
  return tensor;
}

function postprocess(
  output: Float32Array,
  frameWidth: number,
  frameHeight: number
): YoloDetection[] {
  const numClasses = CLASS_NAMES.length;
  const dims = output.length;
  const numBoxes = dims / (4 + numClasses);
  const rowLen = 4 + numClasses;

  const candidates: YoloDetection[] = [];

  for (let i = 0; i < numBoxes; i++) {
    const off = i * rowLen;
    let maxConf = 0;
    let maxClass = 0;
    for (let c = 0; c < numClasses; c++) {
      const conf = output[off + 4 + c];
      if (conf > maxConf) {
        maxConf = conf;
        maxClass = c;
      }
    }
    if (maxConf < CONF_THRESHOLD) continue;

    const cx = output[off];
    const cy = output[off + 1];
    const w = output[off + 2];
    const h = output[off + 3];

    const scale = Math.min(INPUT_SIZE / frameWidth, INPUT_SIZE / frameHeight);
    const offsetX = (INPUT_SIZE - frameWidth * scale) / 2;
    const offsetY = (INPUT_SIZE - frameHeight * scale) / 2;

    const x1 = (cx - w / 2 - offsetX) / scale;
    const y1 = (cy - h / 2 - offsetY) / scale;
    const bw = w / scale;
    const bh = h / scale;

    const bbox: BBox = [
      Math.max(0, x1),
      Math.max(0, y1),
      Math.min(frameWidth, bw),
      Math.min(frameHeight, bh),
    ];

    candidates.push({
      classId: maxClass,
      className: CLASS_NAMES[maxClass],
      confidence: maxConf,
      bbox,
    });
  }

  return nms(candidates, IOU_THRESHOLD);
}

function nms(detections: YoloDetection[], iouThreshold: number): YoloDetection[] {
  const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);
  const kept: YoloDetection[] = [];
  const suppressed = new Set<number>();

  for (let i = 0; i < sorted.length; i++) {
    if (suppressed.has(i)) continue;
    kept.push(sorted[i]);
    for (let j = i + 1; j < sorted.length; j++) {
      if (suppressed.has(j)) continue;
      if (sorted[i].classId !== sorted[j].classId) continue;
      const iou = computeIoU(sorted[i].bbox, sorted[j].bbox);
      if (iou > iouThreshold) suppressed.add(j);
    }
  }
  return kept;
}

function computeIoU(a: BBox, b: BBox): number {
  const [ax, ay, aw, ah] = a;
  const [bx, by, bw, bh] = b;
  const x1 = Math.max(ax, bx);
  const y1 = Math.max(ay, by);
  const x2 = Math.min(ax + aw, bx + bw);
  const y2 = Math.min(ay + ah, by + bh);
  const interW = Math.max(0, x2 - x1);
  const interH = Math.max(0, y2 - y1);
  const interArea = interW * interH;
  const unionArea = aw * ah + bw * bh - interArea;
  return unionArea > 0 ? interArea / unionArea : 0;
}
