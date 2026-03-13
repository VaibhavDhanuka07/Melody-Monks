"use client";

import { useState } from "react";

const raagPatterns = [
  {
    name: "Raag Yaman",
    aroh: "N R G M D N S",
    avaroh: "S N D P M G R S",
    phrases: ["N R G M", "M D N S", "G M D N", "S N D P"],
  },
  {
    name: "Raag Bhairav",
    aroh: "S R G M P D N S",
    avaroh: "S N D P M G R S",
    phrases: ["S R G M", "M P D N", "G M P D", "S N D P"],
  },
  {
    name: "Raag Kafi",
    aroh: "S R g M P D n S",
    avaroh: "S n D P M g R S",
    phrases: ["S R g M", "M P D n", "g M P D", "S n D P"],
  },
];

export default function RaagPracticeTool() {
  const [active, setActive] = useState(raagPatterns[0]);
  const [phrase, setPhrase] = useState(active.phrases[0]);

  const handleGenerate = () => {
    const next =
      active.phrases[Math.floor(Math.random() * active.phrases.length)];
    setPhrase(next);
  };

  return (
    <div className="card-strong p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Raag Practice</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Generate raag phrases
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Choose a raag and practice with rotating phrase prompts.
          </p>
        </div>
        <button type="button" onClick={handleGenerate} className="btn-secondary">
          Generate Phrase
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {raagPatterns.map((raag) => (
          <button
            key={raag.name}
            type="button"
            onClick={() => {
              setActive(raag);
              setPhrase(raag.phrases[0]);
            }}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              active.name === raag.name
                ? "border-brand-gold/60 bg-brand-gold/10 text-brand-gold"
                : "border-white/10 text-ink-muted hover:border-brand-gold/40"
            }`}
          >
            {raag.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-4">
          <p className="text-xs text-ink-muted">Aroh</p>
          <p className="mt-2 text-lg font-semibold text-ink">{active.aroh}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-4">
          <p className="text-xs text-ink-muted">Avaroh</p>
          <p className="mt-2 text-lg font-semibold text-ink">{active.avaroh}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/60 px-4 py-4">
        <p className="text-xs text-ink-muted">Practice Phrase</p>
        <p className="mt-2 text-2xl font-semibold text-ink">{phrase}</p>
      </div>
    </div>
  );
}
