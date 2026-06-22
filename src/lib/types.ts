export type SignType =
  | "speed_limit"
  | "yield"
  | "stop"
  | "no_entry"
  | "warning"
  | "other";

export interface DetectedSign {
  id: string;
  type: SignType;
  label: string;
  value?: number;
  confidence: number;
  detectedAt: number;
  source: "camera" | "map";
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
}
