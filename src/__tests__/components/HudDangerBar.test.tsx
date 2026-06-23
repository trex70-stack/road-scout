import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HudDangerBar } from "@/components/dashboard/HudDangerBar";
import type { DetectedObstacle } from "@/lib/types";

function makeObstacle(id: string, distance: number, type: DetectedObstacle["type"] = "car"): DetectedObstacle {
  return {
    id,
    type,
    label: "PKW",
    confidence: 0.9,
    latitude: 50,
    longitude: 10,
    distanceMeters: distance,
    detectedAt: Date.now(),
  };
}

describe("HudDangerBar", () => {
  it("zeigt 'Kein Hindernis' bei leerer Liste", () => {
    render(<HudDangerBar obstacles={[]} />);
    expect(screen.getByText("Kein Hindernis in Reichweite")).toBeInTheDocument();
  });

  it("zeigt naechstes Hindernis (kleinste Distanz)", () => {
    render(
      <HudDangerBar obstacles={[makeObstacle("o1", 80), makeObstacle("o2", 15)]} />
    );
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("zeigt 'Gefahr' bei < 20m", () => {
    render(<HudDangerBar obstacles={[makeObstacle("o1", 15)]} />);
    expect(screen.getByText("Gefahr")).toBeInTheDocument();
  });

  it("zeigt 'Achtung' bei 20-50m", () => {
    render(<HudDangerBar obstacles={[makeObstacle("o1", 35)]} />);
    expect(screen.getByText("Achtung")).toBeInTheDocument();
  });

  it("zeigt 'Frei' bei > 50m", () => {
    render(<HudDangerBar obstacles={[makeObstacle("o1", 75)]} />);
    expect(screen.getByText("Frei")).toBeInTheDocument();
  });

  it("zeigt Meter-Label", () => {
    render(<HudDangerBar obstacles={[makeObstacle("o1", 35)]} />);
    expect(screen.getByText("Meter")).toBeInTheDocument();
  });

  it("zeigt Hindernis-Typ", () => {
    render(<HudDangerBar obstacles={[makeObstacle("o1", 35, "truck")]} />);
    expect(screen.getByText("PKW")).toBeInTheDocument();
  });

  it("ignoriert Hindernisse ohne Distanz", () => {
    const obs: DetectedObstacle = {
      ...makeObstacle("o1", 0),
      distanceMeters: undefined,
    };
    render(<HudDangerBar obstacles={[obs]} />);
    expect(screen.getByText("Kein Hindernis in Reichweite")).toBeInTheDocument();
  });
});
