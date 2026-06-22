"use client";

import type { DetectedSign } from "@/lib/types";

interface Props {
  signs: DetectedSign[];
}

const SIGN_STYLES: Partial<Record<DetectedSign["type"], string>> = {
  speed_limit: "bg-white border-red-600 text-neutral-900",
  stop: "bg-red-600 text-white border-red-800",
  yield: "bg-white border-yellow-400 text-neutral-900",
  no_entry: "bg-red-600 text-white border-red-800",
  warning: "bg-yellow-300 text-neutral-900 border-yellow-500",
  other: "bg-white text-neutral-900 border-neutral-300",
};

export function SignDisplay({ signs }: Props) {
  if (signs.length === 0) {
    return (
      <div className="text-xs text-neutral-500 py-2">Keine Schilder erkannt.</div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {signs.map((sign) => {
        const isSpeed = sign.type === "speed_limit";
        const style = SIGN_STYLES[sign.type] ?? SIGN_STYLES.other!;
        return (
          <div
            key={sign.id}
            className={`flex flex-col items-center justify-center rounded-xl border-2 px-3 py-2 shrink-0 ${
              isSpeed ? "w-20 h-20" : "w-14 h-14"
            } ${style}`}
          >
            {isSpeed && sign.value != null ? (
              <span className="text-2xl font-bold tabular-nums leading-none">{sign.value}</span>
            ) : (
              <span className="text-[10px] font-semibold text-center leading-tight">{sign.label}</span>
            )}
            <span className="text-[8px] mt-1 opacity-60">
              {Math.round(sign.confidence * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
