const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

export interface ReverseGeocodeResult {
  roadName: string | null;
  maxSpeedKmh: number | null;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<ReverseGeocodeResult> {
  const url = `${NOMINATIM_URL}?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&extratags=1`;
  try {
    const res = await fetch(url, {
      signal,
      headers: { "Accept-Language": "de" },
    });
    if (!res.ok) return { roadName: null, maxSpeedKmh: null };
    const data = await res.json();
    const roadName: string | null =
      data.address?.road ?? data.address?.pedestrian ?? data.address?.path ?? null;
    const maxSpeedRaw = data.extratags?.maxspeed ?? null;
    const maxSpeedKmh = parseMaxSpeed(maxSpeedRaw);
    return { roadName, maxSpeedKmh };
  } catch {
    return { roadName: null, maxSpeedKmh: null };
  }
}

function parseMaxSpeed(raw: string | null): number | null {
  if (!raw) return null;
  const match = /^(\d+)/.exec(raw);
  return match ? Number(match[1]) : null;
}
