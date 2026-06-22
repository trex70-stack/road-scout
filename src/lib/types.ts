export type SignType =
  | "speed_limit"
  | "yield"
  | "stop"
  | "no_entry"
  | "warning"
  | "other";

export type BBox = [number, number, number, number];

export interface DetectedSign {
  id: string;
  type: SignType;
  label: string;
  value?: number;
  confidence: number;
  detectedAt: number;
  source: "camera" | "map";
  bbox?: BBox;
}

export type ObstacleType = "car" | "truck" | "person" | "unknown";

export interface DetectedObstacle {
  id: string;
  type: ObstacleType;
  label: string;
  confidence: number;
  latitude: number;
  longitude: number;
  distanceMeters?: number;
  detectedAt: number;
  bbox?: BBox;
}

export interface GeoPosition {
  latitude: number;
  longitude: number;
  speedMps: number | null;
  heading: number | null;
  accuracy: number | null;
  timestamp: number;
}

export interface RoadInfo {
  roadName: string | null;
  maxSpeedKmh: number | null;
  source: "sign" | "map" | "unknown";
}

export interface DashboardState {
  position: GeoPosition | null;
  currentRoad: RoadInfo | null;
  signs: DetectedSign[];
  activeSpeedLimit: DetectedSign | null;
  obstacles: DetectedObstacle[];
  isDetecting: boolean;
  isOffline: boolean;
  lastFrame: FrameBoxes | null;
}

export interface FrameBoxes {
  signs: DetectedSign[];
  obstacles: DetectedObstacle[];
  frameWidth: number;
  frameHeight: number;
  capturedAt: number;
}
