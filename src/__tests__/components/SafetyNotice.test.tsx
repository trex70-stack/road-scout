import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SafetyNotice } from "@/components/dashboard/SafetyNotice";

describe("SafetyNotice", () => {
  it("wird initial angezeigt", () => {
    render(<SafetyNotice />);
    expect(screen.getByText("Sicherheitshinweis")).toBeInTheDocument();
  });

  it("verschwindet nach Klick auf 'Verstanden'", () => {
    render(<SafetyNotice />);
    const button = screen.getByText("Verstanden");
    fireEvent.click(button);
    expect(screen.queryByText("Sicherheitshinweis")).not.toBeInTheDocument();
  });

  it("enthaelt Hinweis auf Fahrerverantwortung", () => {
    render(<SafetyNotice />);
    expect(screen.getByText(/Fahrer trägt stets die volle/)).toBeInTheDocument();
  });

  it("enthaelt Hinweis auf Nicht-Bedienung waehrend Fahrt", () => {
    render(<SafetyNotice />);
    expect(screen.getByText(/während der Fahrt nicht bedient/)).toBeInTheDocument();
  });
});
