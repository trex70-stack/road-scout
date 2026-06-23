import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { DashboardProvider, useDashboard, type DashboardContextValue } from "@/context/DashboardContext";
import type { DetectedSign, DetectedObstacle, GeoPosition } from "@/lib/types";

function Probe({ onState }: { onState: (state: DashboardContextValue) => void }) {
  const ctx = useDashboard();
  onState(ctx);
  return null;
}

function renderWithProvider() {
  const ref: { current: DashboardContextValue | null } = { current: null };
  render(
    <DashboardProvider>
      <Probe onState={(c) => { ref.current = c; }} />
    </DashboardProvider>
  );
  if (!ref.current) throw new Error("Context not available");
  return ref;
}

function makeSign(id: string, type: DetectedSign["type"], value?: number): DetectedSign {
  return { id, type, label: "Test", value, confidence: 0.9, detectedAt: Date.now(), source: "camera" };
}

function makeObstacle(id: string): DetectedObstacle {
  return { id, type: "car", label: "PKW", confidence: 0.9, latitude: 50, longitude: 10, distanceMeters: 30, detectedAt: Date.now() };
}

function makePos(): GeoPosition {
  return { latitude: 50, longitude: 10, speedMps: 5, heading: 180, accuracy: 5, timestamp: Date.now() };
}

describe("Dashboard Flow - Integration", () => {
  it("initialisiert mit leerem State", () => {
    const ref = renderWithProvider();
    expect(ref.current!.state.signs).toEqual([]);
    expect(ref.current!.state.obstacles).toEqual([]);
    expect(ref.current!.state.position).toBeNull();
  });

  it("setPosition aktualisiert State", () => {
    const ref = renderWithProvider();
    const pos = makePos();
    act(() => ref.current!.setPosition(pos));
    expect(ref.current!.state.position).toBe(pos);
  });

  it("addSign fuegt Schild hinzu und setzt activeSpeedLimit", () => {
    const ref = renderWithProvider();
    const sign = makeSign("s1", "speed_limit", 50);
    act(() => ref.current!.addSign(sign));
    expect(ref.current!.state.signs).toHaveLength(1);
    expect(ref.current!.state.activeSpeedLimit?.value).toBe(50);
  });

  it("addObstacle fuegt Hindernis hinzu", () => {
    const ref = renderWithProvider();
    const obs = makeObstacle("o1");
    act(() => ref.current!.addObstacle(obs));
    expect(ref.current!.state.obstacles).toHaveLength(1);
  });

  it("addSign dedupliziert nach ID", () => {
    const ref = renderWithProvider();
    act(() => ref.current!.addSign(makeSign("s1", "stop")));
    act(() => ref.current!.addSign(makeSign("s1", "yield")));
    expect(ref.current!.state.signs).toHaveLength(1);
  });

  it("clearStale entfernt alte Schilder und Hindernisse", () => {
    const ref = renderWithProvider();
    const oldSign = makeSign("old", "stop");
    oldSign.detectedAt = Date.now() - 20000;
    const newSign = makeSign("new", "yield");
    newSign.detectedAt = Date.now();

    const oldObs = makeObstacle("old");
    oldObs.detectedAt = Date.now() - 20000;
    const newObs = makeObstacle("new");
    newObs.detectedAt = Date.now();

    act(() => {
      ref.current!.addSign(oldSign);
      ref.current!.addSign(newSign);
      ref.current!.addObstacle(oldObs);
      ref.current!.addObstacle(newObs);
    });
    act(() => ref.current!.clearStale(5000));

    expect(ref.current!.state.signs).toHaveLength(1);
    expect(ref.current!.state.signs[0].id).toBe("new");
    expect(ref.current!.state.obstacles).toHaveLength(1);
    expect(ref.current!.state.obstacles[0].id).toBe("new");
  });

  it("setDetecting und setOffline aktualisieren Flags", () => {
    const ref = renderWithProvider();
    act(() => ref.current!.setDetecting(true));
    act(() => ref.current!.setOffline(true));
    expect(ref.current!.state.isDetecting).toBe(true);
    expect(ref.current!.state.isOffline).toBe(true);
  });

  it("setLastFrame aktualisiert Frame", () => {
    const ref = renderWithProvider();
    const frame = {
      signs: [],
      obstacles: [],
      frameWidth: 1280,
      frameHeight: 720,
      capturedAt: Date.now(),
    };
    act(() => ref.current!.setLastFrame(frame));
    expect(ref.current!.state.lastFrame).toBe(frame);
  });

  it("setRoad aktualisiert Strasseninfo", () => {
    const ref = renderWithProvider();
    const road = { roadName: "Teststr.", maxSpeedKmh: 50, source: "map" as const };
    act(() => ref.current!.setRoad(road));
    expect(ref.current!.state.currentRoad).toBe(road);
  });

  it("activeSpeedLimit wird beim Clear von veralteten Schildern null", () => {
    const ref = renderWithProvider();
    const sign = makeSign("s1", "speed_limit", 50);
    sign.detectedAt = Date.now() - 20000;
    act(() => ref.current!.addSign(sign));
    act(() => ref.current!.clearStale(5000));
    expect(ref.current!.state.activeSpeedLimit).toBeNull();
  });
});
