import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SignDisplay } from "@/components/dashboard/SignDisplay";
import type { DetectedSign } from "@/lib/types";

function makeSign(id: string, type: DetectedSign["type"], value?: number, confidence = 0.9): DetectedSign {
  return { id, type, label: "Test", value, confidence, detectedAt: Date.now(), source: "camera" };
}

describe("SignDisplay", () => {
  it("zeigt 'Keine Schilder' bei leerer Liste", () => {
    render(<SignDisplay signs={[]} />);
    expect(screen.getByText("Keine Schilder erkannt.")).toBeInTheDocument();
  });

  it("zeigt Tempolimit-Wert bei speed_limit", () => {
    render(<SignDisplay signs={[makeSign("s1", "speed_limit", 50)]} />);
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("zeigt Label bei Nicht-Speed-Limit-Schild", () => {
    render(<SignDisplay signs={[makeSign("s1", "stop", undefined)]} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("zeigt Confidence in Prozent", () => {
    render(<SignDisplay signs={[makeSign("s1", "stop", undefined, 0.85)]} />);
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("zeigt mehrere Schilder", () => {
    render(
      <SignDisplay signs={[makeSign("s1", "speed_limit", 30), makeSign("s2", "stop")]} />
    );
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("zeigt Wert nicht bei speed_limit ohne value", () => {
    render(<SignDisplay signs={[makeSign("s1", "speed_limit", undefined)]} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
