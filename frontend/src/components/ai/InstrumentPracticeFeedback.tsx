"use client";

import { useState } from "react";

const instruments = [
  "Vocal",
  "Piano",
  "Guitar",
  "Violin",
  "Tabla",
  "Harmonium",
  "Flute",
  "Drums",
];

export default function InstrumentPracticeFeedback() {
  const [instrument, setInstrument] = useState("Vocal");
  const [duration, setDuration] = useState(30);
  const [goal, setGoal] = useState("Pitch accuracy");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleGenerate = () => {
    const notes: string[] = [];
    if (duration < 20) {
      notes.push("Increase practice time to at least 25 minutes for growth.");
    }
    if (goal.toLowerCase().includes("pitch")) {
      notes.push("Add 5 minutes of slow sargam with drone support.");
    }
    if (instrument === "Vocal") {
      notes.push("Prioritize breath control and sur stability.");
    }
    if (instrument === "Tabla" || instrument === "Drums") {
      notes.push("Spend 10 minutes on taal cycles with a metronome.");
    }
    if (instrument === "Piano" || instrument === "Guitar") {
      notes.push("Review scales and chord transitions at a slow tempo.");
    }
    if (notes.length === 0) {
      notes.push("Great work. Keep the same routine and increase tempo slowly.");
    }

    setFeedback(notes.join(" "));
  };

  return (
    <div className="card-strong p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">
            Instrument Practice Analysis
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            AI practice feedback
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Get instant feedback suggestions based on your practice inputs.
          </p>
        </div>
        <button type="button" onClick={handleGenerate} className="btn-primary">
          Generate Feedback
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="text-xs text-ink-muted">
          Instrument
          <select
            value={instrument}
            onChange={(event) => setInstrument(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
          >
            {instruments.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-ink-muted">
          Duration (min)
          <input
            type="number"
            min={10}
            max={120}
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
          />
        </label>
        <label className="text-xs text-ink-muted">
          Focus goal
          <input
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
          />
        </label>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/60 px-4 py-4 text-sm text-ink-muted">
        {feedback
          ? feedback
          : "Submit your practice details to receive feedback suggestions."}
      </div>
    </div>
  );
}
