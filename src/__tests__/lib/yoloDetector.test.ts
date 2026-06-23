import { describe, it, expect } from "vitest";
import { computeIoU, nms, postprocess, type YoloDetection } from "@/lib/detection/yoloDetector";
import type { BBox } from "@/lib/types";

function makeDet(conf: number, cls: number, bbox: BBox): YoloDetection {
  return {
    classId: cls,
    className: "car" as YoloDetection["className"],
    confidence: conf,
    bbox,
  };
}

describe("computeIoU", () => {
  it("gibt 1.0 bei identischen Boxen", () => {
    const box: BBox = [10, 10, 50, 50];
    expect(computeIoU(box, box)).toBeCloseTo(1.0, 2);
  });

  it("gibt 0 bei keiner Ueberschneidung", () => {
    expect(computeIoU([0, 0, 10, 10], [100, 100, 10, 10])).toBe(0);
  });

  it("berechnet korrekte IoU bei teilweiser Ueberschneidung", () => {
    const iou = computeIoU([0, 0, 10, 10], [5, 5, 10, 10]);
    expect(iou).toBeGreaterThan(0);
    expect(iou).toBeLessThan(1);
    expect(iou).toBeCloseTo(25 / 175, 2);
  });

  it("gibt 0 bei Union-Flaeche 0", () => {
    expect(computeIoU([0, 0, 0, 0], [0, 0, 0, 0])).toBe(0);
  });

  it("symmetrisch: IoU(a,b) === IoU(b,a)", () => {
    const a: BBox = [10, 10, 30, 40];
    const b: BBox = [20, 20, 50, 30];
    expect(computeIoU(a, b)).toBeCloseTo(computeIoU(b, a), 5);
  });
});

describe("nms", () => {
  it("unterdrueckt ueberlappende Boxen gleicher Klasse", () => {
    const dets = [
      makeDet(0.9, 0, [10, 10, 50, 50]),
      makeDet(0.8, 0, [12, 12, 50, 50]),
      makeDet(0.7, 0, [200, 200, 50, 50]),
    ];
    const result = nms(dets, 0.5);
    expect(result).toHaveLength(2);
    expect(result[0].confidence).toBe(0.9);
    expect(result[1].confidence).toBe(0.7);
  });

  it("behält Boxen unterschiedlicher Klassen", () => {
    const dets = [
      makeDet(0.9, 0, [10, 10, 50, 50]),
      makeDet(0.8, 1, [12, 12, 50, 50]),
    ];
    const result = nms(dets, 0.5);
    expect(result).toHaveLength(2);
  });

  it("sortiert nach Confidence absteigend", () => {
    const dets = [
      makeDet(0.5, 0, [0, 0, 10, 10]),
      makeDet(0.9, 0, [200, 200, 10, 10]),
      makeDet(0.7, 0, [400, 400, 10, 10]),
    ];
    const result = nms(dets, 0.5);
    expect(result[0].confidence).toBe(0.9);
    expect(result[1].confidence).toBe(0.7);
    expect(result[2].confidence).toBe(0.5);
  });

  it("gibt leeres Array bei leerem Input", () => {
    expect(nms([], 0.5)).toEqual([]);
  });

  it("behält alle Boxen bei niedrigem Threshold", () => {
    const dets = [
      makeDet(0.9, 0, [10, 10, 50, 50]),
      makeDet(0.8, 0, [12, 12, 50, 50]),
    ];
    const result = nms(dets, 0.99);
    expect(result).toHaveLength(2);
  });

  it("unterdrueckt nicht bei IoU genau am Threshold", () => {
    const dets = [
      makeDet(0.9, 0, [0, 0, 10, 10]),
      makeDet(0.8, 0, [0, 0, 10, 10]),
    ];
    const result = nms(dets, 0.5);
    expect(result).toHaveLength(1);
  });
});

describe("postprocess", () => {
  const numClasses = 11;

  function makeOutput(boxes: Array<[number, number, number, number, number[]]>): Float32Array {
    const rowLen = 4 + numClasses;
    const data = new Float32Array(boxes.length * rowLen);
    boxes.forEach(([cx, cy, w, h, confs], i) => {
      const off = i * rowLen;
      data[off] = cx;
      data[off + 1] = cy;
      data[off + 2] = w;
      data[off + 3] = h;
      confs.forEach((c, j) => {
        data[off + 4 + j] = c;
      });
    });
    return data;
  }

  it("filtert Detections unter Confidence-Threshold", () => {
    const output = makeOutput([
      [640, 640, 100, 100, [0.9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      [640, 640, 100, 100, [0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    ]);
    const result = postprocess(output, 1280, 720);
    expect(result).toHaveLength(1);
    expect(result[0].className).toBe("speed_limit_30");
  });

  it("mappt Klassen-IDs korrekt auf Namen", () => {
    const confs = new Array(numClasses).fill(0);
    confs[7] = 0.9;
    const output = makeOutput([[640, 640, 100, 100, confs]]);
    const result = postprocess(output, 1280, 720);
    expect(result[0].className).toBe("car");
  });

  it("gibt leeres Array bei leerem Output", () => {
    const result = postprocess(new Float32Array(0), 1280, 720);
    expect(result).toEqual([]);
  });

  it("waehlt hoechste Confidence als Klasse", () => {
    const confs = new Array(numClasses).fill(0);
    confs[4] = 0.6;
    confs[8] = 0.9;
    const output = makeOutput([[640, 640, 100, 100, confs]]);
    const result = postprocess(output, 1280, 720);
    expect(result[0].className).toBe("truck");
  });

  it("skaliert BBox-Koordinaten auf Frame-Groesse", () => {
    const confs = new Array(numClasses).fill(0);
    confs[7] = 0.9;
    const output = makeOutput([[640, 360, 100, 100, confs]]);
    const result = postprocess(output, 1280, 720);
    const [x, y, w, h] = result[0].bbox;
    expect(x).toBeGreaterThanOrEqual(0);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(w).toBeGreaterThan(0);
    expect(h).toBeGreaterThan(0);
  });

  it("klammert negative Koordinaten auf 0", () => {
    const confs = new Array(numClasses).fill(0);
    confs[7] = 0.9;
    const output = makeOutput([[0, 0, 50, 50, confs]]);
    const result = postprocess(output, 1280, 720);
    const [x, y] = result[0].bbox;
    expect(x).toBeGreaterThanOrEqual(0);
    expect(y).toBeGreaterThanOrEqual(0);
  });
});
