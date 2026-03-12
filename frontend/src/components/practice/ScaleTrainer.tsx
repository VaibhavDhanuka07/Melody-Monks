"use client";

import { useCallback, useRef, useState } from "react";
import * as Tone from "tone";

const scales = [
  { name: "C Major", notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"] },
  { name: "G Major", notes: ["G3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4"] },
  { name: "A Minor", notes: ["A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"] },
  { name: "E Minor", notes: ["E3", "F#3", "G3", "A3", "B3", "C4", "D4", "E4"] },
];

export default function ScaleTrainer() {
  const synthRef = useRef<Tone.Synth | null>(null);
  const [tempo, setTempo] = useState(90);
  const [activeScale, setActiveScale] = useState<string>("");

  const init = useCallback(async () => {
    if (synthRef.current) return;
    await Tone.start();
    synthRef.current = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.02, release: 0.2 },
    }).toDestination();
  }, []);

  const playScale = useCallback(
    async (name: string, notes: string[]) => {
      await init();
      setActiveScale(name);
      const now = Tone.now();
      const step = 60 / tempo;
      notes.forEach((note, index) => {
        synthRef.current?.triggerAttackRelease(note, "8n", now + index * step);
      });
    },
    [init, tempo]
  );

  return (
    <div className="card p-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold-soft">Scale Trainer</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          Practice scales with steady tempo
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Select a scale and set the tempo to hear the progression.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-stroke bg-black/50 px-4 py-4">
        <div className="flex items-center justify-between text-sm font-semibold text-ink">
          <span>Tempo</span>
          <span>{tempo} BPM</span>
        </div>
        <input
          type="range"
          min={60}
          max={160}
          value={tempo}
          onChange={(event) => setTempo(Number(event.target.value))}
          className="mt-3 w-full"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {scales.map((scale) => (
          <button
            key={scale.name}
            onClick={() => playScale(scale.name, scale.notes)}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              activeScale === scale.name
                ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                : "border-stroke bg-black/50 text-ink"
            }`}
          >
            {scale.name}
            <span className="mt-2 block text-xs font-normal text-ink-muted">
              {scale.notes.join(" - ")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
