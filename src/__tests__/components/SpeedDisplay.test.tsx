import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpeedDisplay } from "@/components/dashboard/SpeedDisplay";

describe("SpeedDisplay", () => {
  it("zeigt gerundete Geschwindigkeit an", () => {
    render(<SpeedDisplay speedKmh={48.7} maxSpeedKmh={50} source="sign" overspeed={false} />);
    expect(screen.getByText("49")).toBeInTheDocument();
  });

  it("zeigt '--' wenn speedKmh null ist", () => {
    render(<SpeedDisplay speedKmh={null} maxSpeedKmh={50} source="sign" overspeed={false} />);
    expect(screen.getByText("--")).toBeInTheDocument();
  });

  it("zeigt km/h Label", () => {
    render(<SpeedDisplay speedKmh={50} maxSpeedKmh={null} source="unknown" overspeed={false} />);
    expect(screen.getByText("km/h")).toBeInTheDocument();
  });

  it("zeigt roten Hintergrund bei overspeed", () => {
    const { container } = render(
      <SpeedDisplay speedKmh={80} maxSpeedKmh={50} source="sign" overspeed={true} />
    );
    const speedBox = container.querySelector(".bg-red-600");
    expect(speedBox).not.toBeNull();
  });

  it("zeigt neutralen Hintergrund ohne overspeed", () => {
    const { container } = render(
      <SpeedDisplay speedKmh={30} maxSpeedKmh={50} source="sign" overspeed={false} />
    );
    const speedBox = container.querySelector(".bg-neutral-900");
    expect(speedBox).not.toBeNull();
  });

  it("zeigt Tempolimit-Schild wenn limit gesetzt", () => {
    render(<SpeedDisplay speedKmh={30} maxSpeedKmh={50} source="sign" overspeed={false} />);
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("Schild")).toBeInTheDocument();
  });

  it("versteckt Tempolimit-Schild wenn limit null", () => {
    render(<SpeedDisplay speedKmh={30} maxSpeedKmh={null} source="unknown" overspeed={false} />);
    expect(screen.queryByText("Schild")).not.toBeInTheDocument();
  });

  it("zeigt Quelle 'Karte'", () => {
    render(<SpeedDisplay speedKmh={30} maxSpeedKmh={50} source="map" overspeed={false} />);
    expect(screen.getByText("Karte")).toBeInTheDocument();
  });

  it("zeigt Quelle 'unbek.'", () => {
    render(<SpeedDisplay speedKmh={30} maxSpeedKmh={50} source="unknown" overspeed={false} />);
    expect(screen.getByText("unbek.")).toBeInTheDocument();
  });
});
