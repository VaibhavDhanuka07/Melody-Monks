"use client";

import { useState } from "react";

const routineItems = [
  "Warmup",
  "Technique",
  "Lesson practice",
  "Song practice",
  "Free play",
];

export default function PracticeTrackerPage() {
  const [checked, setChecked] = useState<string[]>([]);
  const [minutes, setMinutes] = useState(60);

  const toggle = (item: string) => {
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Practice Tracker</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          Log today&apos;s practice routine
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Track daily practice, time spent, and consistency.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">Daily routine</p>
          <div className="mt-4 space-y-3">
            {routineItems.map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink-muted"
              >
                <input
                  type="checkbox"
                  checked={checked.includes(item)}
                  onChange={() => toggle(item)}
                  className="h-4 w-4 rounded border-white/20 bg-black"
                />
                {item}
              </label>
            ))}
          </div>
          <div className="mt-6">
            <label className="text-xs uppercase tracking-[0.3em] text-ink-muted">
              Practice minutes
            </label>
            <input
              type="range"
              min={15}
              max={180}
              value={minutes}
              onChange={(event) => setMinutes(Number(event.target.value))}
              className="mt-3 w-full"
            />
            <p className="mt-2 text-sm text-ink">{minutes} minutes</p>
          </div>
        </div>
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">Practice stats</p>
          <div className="mt-4 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4 text-sm text-ink-muted">
              Weekly time: 2h 10m
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4 text-sm text-ink-muted">
              Daily streak: 6 days
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4 text-sm text-ink-muted">
              Accuracy score: 91%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
