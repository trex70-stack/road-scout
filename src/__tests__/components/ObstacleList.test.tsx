import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ObstacleList } from "@/components/dashboard/ObstacleList";
import type { DetectedObstacle } from "@/lib/types";

function makeObstacle(id: string, type: DetectedObstacle["type"], distance?: number): DetectedObstacle {
  return {
    id,
    type,
    label: "Test",
    confidence: 0.9,
    latitude: 50,
    longitude: 10,
    distanceMeters: distance,
    detectedAt: Date.now(),
  };
}

describe("ObstacleList", () => {
  it("zeigt 'Keine Hindernisse' bei leerer Liste", () => {
    render(<ObstacleList obstacles={[]} />);
    expect(screen.getByText("Keine Hindernisse erkannt.")).toBeInTheDocument();
  });

  it("zeigt PKW-Label", () => {
    render(<ObstacleList obstacles={[makeObstacle("o1", "car", 30)]} />);
    expect(screen.getByText("PKW")).toBeInTheDocument();
  });

  it("zeigt LKW-Label", () => {
    render(<ObstacleList obstacles={[makeObstacle("o1", "truck", 30)]} />);
    expect(screen.getByText("LKW")).toBeInTheDocument();
  });

  it("zeigt Person-Label", () => {
    render(<ObstacleList obstacles={[makeObstacle("o1", "person", 30)]} />);
    expect(screen.getByText("Person")).toBeInTheDocument();
  });

  it("zeigt gerundete Distanz", () => {
    render(<ObstacleList obstacles={[makeObstacle("o1", "car", 30.7)]} />);
    expect(screen.getByText("~31m")).toBeInTheDocument();
  });

  it("zeigt Distanz nicht wenn undefined", () => {
    render(<ObstacleList obstacles={[makeObstacle("o1", "car", undefined)]} />);
    expect(screen.queryByText(/~\d+m/)).not.toBeInTheDocument();
  });

  it("zeigt maximal 8 Hindernisse", () => {
    const obstacles = Array.from({ length: 12 }, (_, i) =>
      makeObstacle(`o${i}`, "car", 30 + i)
    );
    render(<ObstacleList obstacles={obstacles} />);
    const chips = screen.getAllByText("PKW");
    expect(chips).toHaveLength(8);
  });
});
