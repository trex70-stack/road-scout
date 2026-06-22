"use client";

import { useState } from "react";

export function SafetyNotice() {
  const [accepted, setAccepted] = useState(false);
  if (accepted) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl p-5 max-w-sm text-sm text-neutral-800">
        <h2 className="text-base font-bold mb-2">Sicherheitshinweis</h2>
        <p className="mb-3">
          Road Scout ist eine Assistenzfunktion und ersetzt weder den Fahrer noch
          die eigene Aufmerksamkeit. Der Fahrer trägt stets die volle
          Verantwortung. Die App darf während der Fahrt nicht bedient werden.
          Verkehrsschilder und Verkehrsregeln sind immer maßgeblich – auch wenn
          die App etwas anderes anzeigt.
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => setAccepted(true)}
            className="rounded-full bg-neutral-900 text-white px-4 py-2 text-sm font-medium"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}
