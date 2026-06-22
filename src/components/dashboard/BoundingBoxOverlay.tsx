"use client";

import { useEffect, useRef } from "react";
import type { FrameBoxes, DetectedSign, DetectedObstacle } from "@/lib/types";

interface Props {
  frame: FrameBoxes | null;
  active: boolean;
}

const OBSTACLE_COLORS: Record<DetectedObstacle["type"], string> = {
  car: "#2563eb",
  truck: "#ea580c",
  person: "#dc2626",
  unknown: "#525252",
};

const SIGN_COLORS: Record<DetectedSign["type"], string> = {
  speed_limit: "#dc2626",
  stop: "#dc2626",
  yield: "#eab308",
  no_entry: "#dc2626",
  warning: "#eab308",
  other: "#525252",
};

export function BoundingBoxOverlay({ frame, active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      if (!active || !frame) return;

      const scaleX = cssW / frame.frameWidth;
      const scaleY = cssH / frame.frameHeight;

      for (const obs of frame.obstacles) {
        if (!obs.bbox) continue;
        drawBox(ctx, obs.bbox, scaleX, scaleY, OBSTACLE_COLORS[obs.type], obstacleLabel(obs));
      }
      for (const sign of frame.signs) {
        if (!sign.bbox) continue;
        drawBox(ctx, sign.bbox, scaleX, scaleY, SIGN_COLORS[sign.type], signLabel(sign));
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(container);
    return () => ro.disconnect();
  }, [frame, active]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

function drawBox(
  ctx: CanvasRenderingContext2D,
  bbox: [number, number, number, number],
  scaleX: number,
  scaleY: number,
  color: string,
  label: string
) {
  const [x, y, w, h] = bbox;
  const px = x * scaleX;
  const py = y * scaleY;
  const pw = w * scaleX;
  const ph = h * scaleY;

  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.strokeRect(px, py, pw, ph);

  const labelH = 16;
  const labelW = ctx.measureText(label).width + 8;
  ctx.fillStyle = color;
  ctx.fillRect(px, Math.max(0, py - labelH), Math.min(labelW, pw + 40), labelH);
  ctx.fillStyle = "#ffffff";
  ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(label, px + 4, Math.max(0, py - labelH / 2));
}

function obstacleLabel(o: DetectedObstacle): string {
  const dist = o.distanceMeters != null ? ` · ${o.distanceMeters}m` : "";
  const conf = Math.round(o.confidence * 100);
  return `${o.label}${dist} · ${conf}%`;
}

function signLabel(s: DetectedSign): string {
  const value = s.value != null ? ` ${s.value}` : "";
  const conf = Math.round(s.confidence * 100);
  return `${s.label}${value} · ${conf}%`;
}
