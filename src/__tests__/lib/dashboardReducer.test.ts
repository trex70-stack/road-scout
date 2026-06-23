import { describe, it, expect } from "vitest";
import { reducer, initialState } from "@/context/DashboardContext";
import type {
  DetectedSign,
  DetectedObstacle,
  GeoPosition,
  RoadInfo,
  FrameBoxes,
} from "@/lib/types";
import type { Action } from "@/context/DashboardContext";

function makeSign(id: string, type: DetectedSign["type"], value?: number, detectedAt = Date.now()): DetectedSign {
  return { id, type, label: "Test", value, confidence: 0.9, detectedAt, source: "camera" };
}

function makeObstacle(id: string, type: DetectedObstacle["type"] = "car", detectedAt = Date.now()): DetectedObstacle {
  return {
    id,
    type,
    label: "PKW",
    confidence: 0.9,
    latitude: 50,
    longitude: 10,
    distanceMeters: 30,
    detectedAt,
  };
}

function makePos(): GeoPosition {
  return { latitude: 50, longitude: 10, speedMps: 5, heading: 180, accuracy: 5, timestamp: Date.now() };
}

describe("reducer - SET_POSITION", () => {
  it("setzt Position", () => {
    const pos = makePos();
    const state = reducer(initialState, { type: "SET_POSITION", position: pos });
    expect(state.position).toBe(pos);
  });
});

describe("reducer - SET_ROAD", () => {
  it("setzt Strasseninfo", () => {
    const road: RoadInfo = { roadName: "Teststr.", maxSpeedKmh: 50, source: "map" };
    const state = reducer(initialState, { type: "SET_ROAD", road });
    expect(state.currentRoad).toBe(road);
  });
});

describe("reducer - ADD_SIGN", () => {
  it("fuegt Schild hinzu", () => {
    const sign = makeSign("s1", "stop");
    const state = reducer(initialState, { type: "ADD_SIGN", sign });
    expect(state.signs).toHaveLength(1);
    expect(state.signs[0].id).toBe("s1");
  });

  it("setzt activeSpeedLimit bei Speed-Limit-Schild", () => {
    const sign = makeSign("s1", "speed_limit", 50);
    const state = reducer(initialState, { type: "ADD_SIGN", sign });
    expect(state.activeSpeedLimit).toBe(sign);
  });

  it("aendert activeSpeedLimit nicht bei Nicht-Speed-Limit-Schild", () => {
    const speedSign = makeSign("s1", "speed_limit", 50);
    let state = reducer(initialState, { type: "ADD_SIGN", sign: speedSign });
    const stopSign = makeSign("s2", "stop");
    state = reducer(state, { type: "ADD_SIGN", sign: stopSign });
    expect(state.activeSpeedLimit?.value).toBe(50);
  });

  it("dedupliziert nach ID", () => {
    const sign1 = makeSign("s1", "stop");
    let state = reducer(initialState, { type: "ADD_SIGN", sign: sign1 });
    const sign2 = makeSign("s1", "yield");
    state = reducer(state, { type: "ADD_SIGN", sign: sign2 });
    expect(state.signs).toHaveLength(1);
    expect(state.signs[0].type).toBe("yield");
  });

  it("respektiert MAX_SIGNS=10", () => {
    let state = initialState;
    for (let i = 0; i < 15; i++) {
      state = reducer(state, { type: "ADD_SIGN", sign: makeSign(`s${i}`, "stop") });
    }
    expect(state.signs).toHaveLength(10);
  });

  it("neuestes Schild ist vorne", () => {
    const s1 = makeSign("s1", "stop");
    let state = reducer(initialState, { type: "ADD_SIGN", sign: s1 });
    const s2 = makeSign("s2", "yield");
    state = reducer(state, { type: "ADD_SIGN", sign: s2 });
    expect(state.signs[0].id).toBe("s2");
  });
});

describe("reducer - CLEAR_STALE_SIGNS", () => {
  it("entfernt alte Schilder", () => {
    const oldTime = Date.now() - 20000;
    const newTime = Date.now();
    let state = reducer(initialState, { type: "ADD_SIGN", sign: makeSign("old", "stop", undefined, oldTime) });
    state = reducer(state, { type: "ADD_SIGN", sign: makeSign("new", "yield", undefined, newTime) });
    state = reducer(state, { type: "CLEAR_STALE_SIGNS", before: Date.now() - 5000 });
    expect(state.signs).toHaveLength(1);
    expect(state.signs[0].id).toBe("new");
  });

  it("setzt activeSpeedLimit auf null wenn veraltet", () => {
    const oldTime = Date.now() - 20000;
    const sign = makeSign("s1", "speed_limit", 50, oldTime);
    let state = reducer(initialState, { type: "ADD_SIGN", sign });
    state = reducer(state, { type: "CLEAR_STALE_SIGNS", before: Date.now() - 5000 });
    expect(state.activeSpeedLimit).toBeNull();
  });

  it("behält activeSpeedLimit wenn nicht veraltet", () => {
    const newTime = Date.now();
    const sign = makeSign("s1", "speed_limit", 50, newTime);
    let state = reducer(initialState, { type: "ADD_SIGN", sign });
    state = reducer(state, { type: "CLEAR_STALE_SIGNS", before: Date.now() - 5000 });
    expect(state.activeSpeedLimit?.value).toBe(50);
  });
});

describe("reducer - ADD_OBSTACLE", () => {
  it("fuegt Hindernis hinzu", () => {
    const obs = makeObstacle("o1");
    const state = reducer(initialState, { type: "ADD_OBSTACLE", obstacle: obs });
    expect(state.obstacles).toHaveLength(1);
  });

  it("dedupliziert nach ID", () => {
    const o1 = makeObstacle("o1", "car");
    let state = reducer(initialState, { type: "ADD_OBSTACLE", obstacle: o1 });
    const o2 = makeObstacle("o1", "truck");
    state = reducer(state, { type: "ADD_OBSTACLE", obstacle: o2 });
    expect(state.obstacles).toHaveLength(1);
    expect(state.obstacles[0].type).toBe("truck");
  });

  it("respektiert MAX_OBSTACLES=20", () => {
    let state = initialState;
    for (let i = 0; i < 25; i++) {
      state = reducer(state, { type: "ADD_OBSTACLE", obstacle: makeObstacle(`o${i}`) });
    }
    expect(state.obstacles).toHaveLength(20);
  });
});

describe("reducer - CLEAR_STALE_OBSTACLES", () => {
  it("entfernt alte Hindernisse", () => {
    const oldTime = Date.now() - 20000;
    const newTime = Date.now();
    let state = reducer(initialState, { type: "ADD_OBSTACLE", obstacle: makeObstacle("old", "car", oldTime) });
    state = reducer(state, { type: "ADD_OBSTACLE", obstacle: makeObstacle("new", "car", newTime) });
    state = reducer(state, { type: "CLEAR_STALE_OBSTACLES", before: Date.now() - 5000 });
    expect(state.obstacles).toHaveLength(1);
    expect(state.obstacles[0].id).toBe("new");
  });
});

describe("reducer - SET_DETECTING / SET_OFFLINE", () => {
  it("setzt isDetecting", () => {
    const state = reducer(initialState, { type: "SET_DETECTING", isDetecting: true });
    expect(state.isDetecting).toBe(true);
  });

  it("setzt isOffline", () => {
    const state = reducer(initialState, { type: "SET_OFFLINE", isOffline: true });
    expect(state.isOffline).toBe(true);
  });
});

describe("reducer - SET_LAST_FRAME", () => {
  it("setzt lastFrame", () => {
    const frame: FrameBoxes = {
      signs: [],
      obstacles: [],
      frameWidth: 1280,
      frameHeight: 720,
      capturedAt: Date.now(),
    };
    const state = reducer(initialState, { type: "SET_LAST_FRAME", frame });
    expect(state.lastFrame).toBe(frame);
  });
});

describe("reducer - Unknown Action", () => {
  it("gibt State unveraendert zurueck bei unbekannter Action", () => {
    const unknown = { type: "UNKNOWN" } as unknown as Action;
    const state = reducer(initialState, unknown);
    expect(state).toBe(initialState);
  });
});

describe("reducer - initialState", () => {
  it("hat korrekte Initialwerte", () => {
    expect(initialState.position).toBeNull();
    expect(initialState.currentRoad).toBeNull();
    expect(initialState.signs).toEqual([]);
    expect(initialState.activeSpeedLimit).toBeNull();
    expect(initialState.obstacles).toEqual([]);
    expect(initialState.isDetecting).toBe(false);
    expect(initialState.isOffline).toBe(false);
    expect(initialState.lastFrame).toBeNull();
  });
});
