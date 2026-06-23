import { describe, it, expect } from "vitest";
import { classify } from "@/components/dashboard/HudDangerBar";

describe("classify - Gefahrenstufen", () => {
  it("gibt 'Gefahr' (rot) bei < 20m", () => {
    const level = classify(15);
    expect(level.label).toBe("Gefahr");
    expect(level.barColor).toBe("bg-red-600");
    expect(level.pulse).toBe(true);
  });

  it("gibt 'Gefahr' bei 0m", () => {
    const level = classify(0);
    expect(level.label).toBe("Gefahr");
    expect(level.pulse).toBe(true);
  });

  it("gibt 'Gefahr' bei 19.9m (Grenzwert)", () => {
    const level = classify(19.9);
    expect(level.label).toBe("Gefahr");
  });

  it("gibt 'Achtung' (orange) bei 20m", () => {
    const level = classify(20);
    expect(level.label).toBe("Achtung");
    expect(level.barColor).toBe("bg-orange-500");
    expect(level.pulse).toBe(false);
  });

  it("gibt 'Achtung' bei 49.9m", () => {
    const level = classify(49.9);
    expect(level.label).toBe("Achtung");
  });

  it("gibt 'Frei' (gruen) bei 50m", () => {
    const level = classify(50);
    expect(level.label).toBe("Frei");
    expect(level.barColor).toBe("bg-emerald-500");
    expect(level.pulse).toBe(false);
  });

  it("gibt 'Frei' bei 100m", () => {
    const level = classify(100);
    expect(level.label).toBe("Frei");
  });

  it("gibt 'Frei' bei sehr grosser Distanz", () => {
    const level = classify(1000);
    expect(level.label).toBe("Frei");
  });
});
