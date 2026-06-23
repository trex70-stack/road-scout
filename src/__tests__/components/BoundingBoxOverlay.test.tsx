import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { BoundingBoxOverlay } from "@/components/dashboard/BoundingBoxOverlay";
import type { FrameBoxes, DetectedObstacle, DetectedSign } from "@/lib/types";

const mockCtx = {
  clearRect: vi.fn(),
  setTransform: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  measureText: vi.fn(() => ({ width: 40 })),
  fillText: vi.fn(),
  lineWidth: 0,
  strokeStyle: "",
  fillStyle: "",
  font: "",
  textBaseline: "",
};

vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(mockCtx as unknown as CanvasRenderingContext2D);

function makeFrame(obstacles: DetectedObstacle[], signs: DetectedSign[]): FrameBoxes {
  return {
    signs,
    obstacles,
    frameWidth: 1280,
    frameHeight: 720,
    capturedAt: Date.now(),
  };
}

describe("BoundingBoxOverlay", () => {
  it("rendert ohne Absturz bei null-Frame", () => {
    const { container } = render(<BoundingBoxOverlay frame={null} active={true} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("rendert ohne Absturz bei aktivem Frame mit Hindernissen", () => {
    const obstacle: DetectedObstacle = {
      id: "o1",
      type: "car",
      label: "PKW",
      confidence: 0.9,
      latitude: 50,
      longitude: 10,
      distanceMeters: 30,
      detectedAt: Date.now(),
      bbox: [100, 100, 200, 150],
    };
    const frame = makeFrame([obstacle], []);
    const { container } = render(<BoundingBoxOverlay frame={frame} active={true} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("rendert ohne Absturz bei Schildern", () => {
    const sign: DetectedSign = {
      id: "s1",
      type: "speed_limit",
      label: "Tempolimit",
      value: 50,
      confidence: 0.9,
      detectedAt: Date.now(),
      source: "camera",
      bbox: [100, 100, 200, 150],
    };
    const frame = makeFrame([], [sign]);
    const { container } = render(<BoundingBoxOverlay frame={frame} active={true} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("rendert ohne Absturz bei inaktivem Overlay", () => {
    const frame = makeFrame([], []);
    const { container } = render(<BoundingBoxOverlay frame={frame} active={false} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("hat pointer-events-none Container", () => {
    const { container } = render(<BoundingBoxOverlay frame={null} active={true} />);
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
