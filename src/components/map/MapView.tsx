"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { GeoPosition, DetectedObstacle } from "@/lib/types";

interface Props {
  position: GeoPosition | null;
  obstacles: DetectedObstacle[];
}

const OSM_RASTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap-Mitwirkende",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm-tiles",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const OBSTACLE_COLORS: Record<DetectedObstacle["type"], string> = {
  car: "#2563eb",
  truck: "#ea580c",
  person: "#dc2626",
  unknown: "#525252",
};

export function MapView({ position, obstacles }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const obstacleMarkersRef = useRef<Record<string, Marker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_RASTER_STYLE,
      center: [10.4515, 51.1657],
      zoom: 6,
      attributionControl: { compact: true },
      dragRotate: false,
      pitchWithRotate: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !position) return;
    const lngLat: [number, number] = [position.longitude, position.latitude];
    if (!userMarkerRef.current) {
      const el = document.createElement("div");
      el.className = "roadscout-user-marker";
      el.style.cssText =
        "width:16px;height:16px;border-radius:9999px;background:#1d4ed8;border:2px solid #fff;box-shadow:0 0 0 3px rgba(29,78,216,0.4);";
      userMarkerRef.current = new maplibregl.Marker(el).setLngLat(lngLat).addTo(map);
    } else {
      userMarkerRef.current.setLngLat(lngLat);
    }
    map.easeTo({ center: lngLat, zoom: Math.max(map.getZoom(), 15), duration: 500 });
  }, [position]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const existing = obstacleMarkersRef.current;
    const seen = new Set<string>();

    for (const obstacle of obstacles) {
      seen.add(obstacle.id);
      const lngLat: [number, number] = [obstacle.longitude, obstacle.latitude];
      const color = OBSTACLE_COLORS[obstacle.type];
      if (existing[obstacle.id]) {
        existing[obstacle.id].setLngLat(lngLat);
      } else {
        const el = document.createElement("div");
        el.style.cssText = `width:12px;height:12px;border-radius:9999px;background:${color};border:2px solid #fff;`;
        existing[obstacle.id] = new maplibregl.Marker(el).setLngLat(lngLat).addTo(map);
      }
    }

    for (const id of Object.keys(existing)) {
      if (!seen.has(id)) {
        existing[id].remove();
        delete existing[id];
      }
    }
  }, [obstacles]);

  return <div ref={containerRef} className="w-full h-full min-h-[200px] rounded-xl overflow-hidden" />;
}
