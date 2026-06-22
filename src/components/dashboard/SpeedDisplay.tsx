"use client";

interface Props {
  speedKmh: number | null;
  maxSpeedKmh: number | null;
  source: "sign" | "map" | "unknown";
  overspeed: boolean;
}

export function SpeedDisplay({ speedKmh, maxSpeedKmh, source, overspeed }: Props) {
  const speed = speedKmh != null ? Math.round(speedKmh) : "--";
  const limit = maxSpeedKmh != null ? maxSpeedKmh : null;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex flex-col items-center justify-center rounded-2xl px-4 py-2 ${
          overspeed ? "bg-red-600 text-white" : "bg-neutral-900 text-white"
        }`}
      >
        <span className="text-5xl font-bold tabular-nums leading-none">{speed}</span>
        <span className="text-xs uppercase tracking-wide opacity-70 mt-1">km/h</span>
      </div>
      {limit != null && (
        <div className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center rounded-full border-4 ${
              source === "sign" ? "border-red-600 bg-white" : "border-neutral-400 bg-white"
            } w-16 h-16`}
          >
            <span className="text-2xl font-bold text-neutral-900 tabular-nums">{limit}</span>
          </div>
          <span className="text-[10px] mt-1 text-neutral-500 uppercase">
            {source === "sign" ? "Schild" : source === "map" ? "Karte" : "unbek."}
          </span>
        </div>
      )}
    </div>
  );
}
