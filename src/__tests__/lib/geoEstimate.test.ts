import { describe, it, expect } from "vitest";
import {
  estimateDistanceMeters,
  estimateBearingDeg,
  offsetLatLng,
} from "@/lib/detection/geoEstimate";
import type { GeoPosition } from "@/lib/types";

function makePos(lat: number, lon: number, heading = 0): GeoPosition {
  return { latitude: lat, longitude: lon, speedMps: null, heading, accuracy: null, timestamp: 0 };
}

describe("estimateDistanceMeters", () => {
  it("berechnet Distanz fuer Auto (1.5m) bei 100px in 1080px Frame", () => {
    const d = estimateDistanceMeters(100, 1080, "car");
    expect(d).toBeCloseTo((1.5 * 0.9) / (100 / 1080), 2);
  });

  it("berechnet Distanz fuer LKW (3.5m) bei 100px in 1080px Frame", () => {
    const d = estimateDistanceMeters(100, 1080, "truck");
    expect(d).toBeCloseTo((3.5 * 0.9) / (100 / 1080), 2);
  });

  it("berechnet Distanz fuer Person (1.7m)", () => {
    const d = estimateDistanceMeters(100, 1080, "person");
    expect(d).toBeCloseTo((1.7 * 0.9) / (100 / 1080), 2);
  });

  it("verwendet Fallback-Hoehe 1.5m fuer unbekannten Typ", () => {
    const d = estimateDistanceMeters(100, 1080, "unknown");
    expect(d).toBeCloseTo((1.5 * 0.9) / (100 / 1080), 2);
  });

  it("gibt Infinity bei Ratio <= 0", () => {
    expect(estimateDistanceMeters(0, 1080, "car")).toBe(Infinity);
  });

  it("verhindert Division durch 0 bei frameHeight=0", () => {
    const d = estimateDistanceMeters(100, 0, "car");
    expect(d).toBeCloseTo((1.5 * 0.9) / (100 / 1), 2);
  });

  it("kleinere Box = groessere Distanz", () => {
    const close = estimateDistanceMeters(200, 1080, "car");
    const far = estimateDistanceMeters(50, 1080, "car");
    expect(close).toBeLessThan(far);
  });
});

describe("estimateBearingDeg", () => {
  it("gibt 0 bei Box in Bildmitte", () => {
    expect(estimateBearingDeg(640, 1280)).toBe(0);
  });

  it("gibt negative Grad bei Box links", () => {
    const b = estimateBearingDeg(0, 1280);
    expect(b).toBeCloseTo(-35, 1);
  });

  it("gibt positive Grad bei Box rechts", () => {
    const b = estimateBearingDeg(1280, 1280);
    expect(b).toBeCloseTo(35, 1);
  });

  it("respektiert benutzerdefiniertes FOV", () => {
    expect(estimateBearingDeg(0, 1280, 90)).toBeCloseTo(-45, 1);
  });

  it("viertel links gibt -halbes FOV", () => {
    expect(estimateBearingDeg(320, 1280, 70)).toBeCloseTo(-17.5, 1);
  });
});

describe("offsetLatLng", () => {
  it("100m nach Norden erhoeht Latitude", () => {
    const origin = makePos(50.0, 10.0, 0);
    const result = offsetLatLng(origin, 0, 100);
    expect(result.latitude).toBeGreaterThan(50.0);
    expect(result.longitude).toBeCloseTo(10.0, 6);
  });

  it("100m nach Sieden senkt Latitude", () => {
    const origin = makePos(50.0, 10.0, 0);
    const result = offsetLatLng(origin, 180, 100);
    expect(result.latitude).toBeLessThan(50.0);
  });

  it("100m nach Osten erhoeht Longitude", () => {
    const origin = makePos(50.0, 10.0, 0);
    const result = offsetLatLng(origin, 90, 100);
    expect(result.longitude).toBeGreaterThan(10.0);
    expect(result.latitude).toBeCloseTo(50.0, 6);
  });

  it("0m Distanz aendert Position nicht", () => {
    const origin = makePos(50.0, 10.0, 0);
    const result = offsetLatLng(origin, 45, 0);
    expect(result.latitude).toBeCloseTo(50.0, 8);
    expect(result.longitude).toBeCloseTo(10.0, 8);
  });

  it("1km Distanz ist ungefaehr 0.009 Grad Latitude", () => {
    const origin = makePos(50.0, 10.0, 0);
    const result = offsetLatLng(origin, 0, 1000);
    expect(result.latitude).toBeCloseTo(50.009, 2);
  });
});
