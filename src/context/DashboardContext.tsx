"use client";

import { createContext, useContext, useReducer, useCallback } from "react";
import type {
  DashboardState,
  DetectedSign,
  DetectedObstacle,
  GeoPosition,
  RoadInfo,
  FrameBoxes,
} from "@/lib/types";

export type Action =
  | { type: "SET_POSITION"; position: GeoPosition }
  | { type: "SET_ROAD"; road: RoadInfo }
  | { type: "ADD_SIGN"; sign: DetectedSign }
  | { type: "CLEAR_STALE_SIGNS"; before: number }
  | { type: "ADD_OBSTACLE"; obstacle: DetectedObstacle }
  | { type: "CLEAR_STALE_OBSTACLES"; before: number }
  | { type: "SET_DETECTING"; isDetecting: boolean }
  | { type: "SET_OFFLINE"; isOffline: boolean }
  | { type: "SET_LAST_FRAME"; frame: FrameBoxes };

const MAX_SIGNS = 10;
const MAX_OBSTACLES = 20;

export function reducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case "SET_POSITION":
      return { ...state, position: action.position };
    case "SET_ROAD":
      return { ...state, currentRoad: action.road };
    case "ADD_SIGN": {
      const signs = [action.sign, ...state.signs.filter((s) => s.id !== action.sign.id)].slice(0, MAX_SIGNS);
      const activeSpeedLimit =
        action.sign.type === "speed_limit" && action.sign.value != null
          ? action.sign
          : state.activeSpeedLimit;
      return { ...state, signs, activeSpeedLimit };
    }
    case "CLEAR_STALE_SIGNS": {
      const signs = state.signs.filter((s) => s.detectedAt >= action.before);
      const activeSpeedLimit =
        state.activeSpeedLimit && state.activeSpeedLimit.detectedAt >= action.before
          ? state.activeSpeedLimit
          : null;
      return { ...state, signs, activeSpeedLimit };
    }
    case "ADD_OBSTACLE": {
      const obstacles = [action.obstacle, ...state.obstacles.filter((o) => o.id !== action.obstacle.id)].slice(0, MAX_OBSTACLES);
      return { ...state, obstacles };
    }
    case "CLEAR_STALE_OBSTACLES":
      return { ...state, obstacles: state.obstacles.filter((o) => o.detectedAt >= action.before) };
    case "SET_DETECTING":
      return { ...state, isDetecting: action.isDetecting };
    case "SET_OFFLINE":
      return { ...state, isOffline: action.isOffline };
    case "SET_LAST_FRAME":
      return { ...state, lastFrame: action.frame };
    default:
      return state;
  }
}

export const initialState: DashboardState = {
  position: null,
  currentRoad: null,
  signs: [],
  activeSpeedLimit: null,
  obstacles: [],
  isDetecting: false,
  isOffline: false,
  lastFrame: null,
};

export interface DashboardContextValue {
  state: DashboardState;
  setPosition: (position: GeoPosition) => void;
  setRoad: (road: RoadInfo) => void;
  addSign: (sign: DetectedSign) => void;
  addObstacle: (obstacle: DetectedObstacle) => void;
  setDetecting: (isDetecting: boolean) => void;
  setOffline: (isOffline: boolean) => void;
  setLastFrame: (frame: FrameBoxes) => void;
  clearStale: (olderThanMs: number) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setPosition = useCallback((position: GeoPosition) => dispatch({ type: "SET_POSITION", position }), []);
  const setRoad = useCallback((road: RoadInfo) => dispatch({ type: "SET_ROAD", road }), []);
  const addSign = useCallback((sign: DetectedSign) => dispatch({ type: "ADD_SIGN", sign }), []);
  const addObstacle = useCallback((obstacle: DetectedObstacle) => dispatch({ type: "ADD_OBSTACLE", obstacle }), []);
  const setDetecting = useCallback((isDetecting: boolean) => dispatch({ type: "SET_DETECTING", isDetecting }), []);
  const setOffline = useCallback((isOffline: boolean) => dispatch({ type: "SET_OFFLINE", isOffline }), []);
  const setLastFrame = useCallback((frame: FrameBoxes) => dispatch({ type: "SET_LAST_FRAME", frame }), []);

  const clearStale = useCallback((olderThanMs: number) => {
    const before = Date.now() - olderThanMs;
    dispatch({ type: "CLEAR_STALE_SIGNS", before });
    dispatch({ type: "CLEAR_STALE_OBSTACLES", before });
  }, []);

  return (
    <DashboardContext.Provider
      value={{ state, setPosition, setRoad, addSign, addObstacle, setDetecting, setOffline, setLastFrame, clearStale }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
