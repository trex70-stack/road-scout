import { describe, it, expect, vi, beforeEach } from "vitest";
import { reverseGeocode } from "@/lib/geocoding";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => mockFetch.mockReset());

describe("reverseGeocode", () => {
  it("extrahiert roadName und maxSpeed aus gueltiger Antwort", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: { road: "Hauptstraße" },
        extratags: { maxspeed: "50" },
      }),
    });

    const result = await reverseGeocode(50.0, 10.0);
    expect(result.roadName).toBe("Hauptstraße");
    expect(result.maxSpeedKmh).toBe(50);
  });

  it("parst maxSpeed mit Suffix (z.B. '30 km/h')", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: { road: "Teststraße" },
        extratags: { maxspeed: "30 km/h" },
      }),
    });

    const result = await reverseGeocode(50.0, 10.0);
    expect(result.maxSpeedKmh).toBe(30);
  });

  it("gibt null fuer nicht-numerische maxSpeed zurueck", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: { road: "Test" },
        extratags: { maxspeed: "walk" },
      }),
    });

    const result = await reverseGeocode(50.0, 10.0);
    expect(result.maxSpeedKmh).toBeNull();
  });

  it("gibt null zurueck wenn maxspeed fehlt", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: { road: "Test" },
        extratags: {},
      }),
    });

    const result = await reverseGeocode(50.0, 10.0);
    expect(result.maxSpeedKmh).toBeNull();
  });

  it("gibt null/null zurueck bei HTTP-Fehler", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });

    const result = await reverseGeocode(50.0, 10.0);
    expect(result.roadName).toBeNull();
    expect(result.maxSpeedKmh).toBeNull();
  });

  it("gibt null/null zurueck bei Netzwerkfehler", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await reverseGeocode(50.0, 10.0);
    expect(result.roadName).toBeNull();
    expect(result.maxSpeedKmh).toBeNull();
  });

  it("nutzt pedestrian als Fallback wenn road fehlt", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: { pedestrian: "Fußweg" },
        extratags: {},
      }),
    });

    const result = await reverseGeocode(50.0, 10.0);
    expect(result.roadName).toBe("Fußweg");
  });

  it("nutzt path als Fallback wenn road und pedestrian fehlen", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: { path: "Wanderweg" },
        extratags: {},
      }),
    });

    const result = await reverseGeocode(50.0, 10.0);
    expect(result.roadName).toBe("Wanderweg");
  });

  it("gibt null zurueck wenn keine Strassen-Info vorhanden", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: { city: "Berlin" },
        extratags: {},
      }),
    });

    const result = await reverseGeocode(50.0, 10.0);
    expect(result.roadName).toBeNull();
  });

  it("reicht AbortSignal an fetch weiter", async () => {
    const controller = new AbortController();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ address: {}, extratags: {} }),
    });

    await reverseGeocode(50.0, 10.0, controller.signal);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal })
    );
  });
});
