import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/detection/yoloDetector", () => ({
  loadYoloModel: vi.fn(),
  runYoloDetection: vi.fn(),
}));

import { detectFrame } from "@/lib/detection/detectionService";
import { runYoloDetection, type YoloDetection } from "@/lib/detection/yoloDetector";
import type { GeoPosition, BBox } from "@/lib/types";

const mockedRunYolo = vi.mocked(runYoloDetection);

function makeVideo(width = 1280, height = 720): HTMLVideoElement {
  const video = {
    videoWidth: width,
    videoHeight: height,
    readyState: 4,
  } as unknown as HTMLVideoElement;
  return video;
}

function makeDetection(className: YoloDetection["className"], confidence: number, bbox: BBox): YoloDetection {
  return {
    classId: 0,
    className,
    confidence,
    bbox,
  };
}

beforeEach(() => {
  mockedRunYolo.mockReset();
});

describe("detectFrame - Integration", () => {
  it("gibt leere Listen zurueck bei keinen Detections", async () => {
    mockedRunYolo.mockResolvedValueOnce([]);
    const video = makeVideo();
    const result = await detectFrame(video, null);
    expect(result.signs).toEqual([]);
    expect(result.obstacles).toEqual([]);
  });

  it("erstellt DetectedSign aus YOLO-Speed-Limit-Detection", async () => {
    mockedRunYolo.mockResolvedValueOnce([
      makeDetection("speed_limit_50", 0.9, [100, 100, 50, 50]),
    ]);
    const video = makeVideo();
    const result = await detectFrame(video, null);
    expect(result.signs).toHaveLength(1);
    expect(result.signs[0].type).toBe("speed_limit");
    expect(result.signs[0].value).toBe(50);
    expect(result.signs[0].label).toBe("Tempolimit");
    expect(result.signs[0].confidence).toBe(0.9);
    expect(result.signs[0].source).toBe("camera");
  });

  it("erstellt DetectedObstacle aus YOLO-Car-Detection mit GPS-Position", async () => {
    mockedRunYolo.mockResolvedValueOnce([
      makeDetection("car", 0.85, [100, 100, 50, 50]),
    ]);
    const video = makeVideo(1280, 720);
    const position: GeoPosition = {
      latitude: 50.0,
      longitude: 10.0,
      speedMps: 5,
      heading: 0,
      accuracy: 5,
      timestamp: Date.now(),
    };
    const result = await detectFrame(video, position);
    expect(result.obstacles).toHaveLength(1);
    expect(result.obstacles[0].type).toBe("car");
    expect(result.obstacles[0].label).toBe("PKW");
    expect(result.obstacles[0].distanceMeters).toBeDefined();
    expect(result.obstacles[0].distanceMeters).toBeGreaterThan(0);
  });

  it("mappt Bus auf truck-Typ", async () => {
    mockedRunYolo.mockResolvedValueOnce([
      makeDetection("bus", 0.8, [100, 100, 80, 80]),
    ]);
    const video = makeVideo();
    const result = await detectFrame(video, null);
    expect(result.obstacles).toHaveLength(1);
    expect(result.obstacles[0].type).toBe("truck");
    expect(result.obstacles[0].label).toBe("Bus");
  });

  it("berechnet Distanz aus BBox-Hoehe", async () => {
    mockedRunYolo.mockResolvedValueOnce([
      makeDetection("car", 0.9, [100, 100, 50, 100]),
    ]);
    const video = makeVideo(1280, 720);
    const result = await detectFrame(video, null);
    const distance = result.obstacles[0].distanceMeters;
    expect(distance).toBeDefined();
    expect(distance).toBeGreaterThan(0);
  });

  it("erstellt korrekte IDs (eindeutig)", async () => {
    mockedRunYolo.mockResolvedValueOnce([
      makeDetection("car", 0.9, [100, 100, 50, 50]),
      makeDetection("speed_limit_30", 0.9, [200, 200, 50, 50]),
    ]);
    const video = makeVideo();
    const result = await detectFrame(video, null);
    const ids = [...result.signs.map((s) => s.id), ...result.obstacles.map((o) => o.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("setzt detectedAt auf aktuelle Zeit", async () => {
    mockedRunYolo.mockResolvedValueOnce([
      makeDetection("car", 0.9, [100, 100, 50, 50]),
    ]);
    const before = Date.now();
    const video = makeVideo();
    const result = await detectFrame(video, null);
    const after = Date.now();
    expect(result.obstacles[0].detectedAt).toBeGreaterThanOrEqual(before);
    expect(result.obstacles[0].detectedAt).toBeLessThanOrEqual(after);
  });

  it("trennt Schilder und Hindernisse korrekt", async () => {
    mockedRunYolo.mockResolvedValueOnce([
      makeDetection("speed_limit_50", 0.9, [100, 100, 50, 50]),
      makeDetection("stop", 0.9, [200, 200, 50, 50]),
      makeDetection("car", 0.9, [300, 300, 80, 80]),
      makeDetection("person", 0.9, [400, 400, 40, 80]),
    ]);
    const video = makeVideo();
    const result = await detectFrame(video, null);
    expect(result.signs).toHaveLength(2);
    expect(result.obstacles).toHaveLength(2);
  });

  it("uebergibt BBox in Output", async () => {
    const bbox: BBox = [100, 100, 50, 50];
    mockedRunYolo.mockResolvedValueOnce([
      makeDetection("car", 0.9, bbox),
    ]);
    const video = makeVideo();
    const result = await detectFrame(video, null);
    expect(result.obstacles[0].bbox).toEqual(bbox);
  });
});
