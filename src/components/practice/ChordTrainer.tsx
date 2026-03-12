"use client";

import { useCallback, useRef, useState } from "react";
import * as Tone from "tone";

const chordSet = [
  { name: "C Major", notes: ["C4", "E4", "G4"] },
  { name: "D Minor", notes: ["D4", "F4", "A4"] },
  { name: "E Minor", notes: ["E4", "G4", "B4"] },
  { name: "G Major", notes: ["G3", "B3", "D4"] },
  { name: "A Minor", notes: ["A3", "C4", "E4"] },
];

export default function ChordTrainer() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const [active, setActive] = useState<string>("");

  const init = useCallback(async () => {
    if (synthRef.current) return;
    await Tone.start();
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
    }).toDestination();
  }, []);

  const playChord = useCallback(
    async (name: string, notes: string[]) => {
      await init();
      setActive(name);
      synthRef.current?.triggerAttackRelease(notes, "2n");
    },
    [init]
  );

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-indigo">Chord Trainer</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            Hear and memorize essential chords
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Tap a chord to hear it. Use the highlighted chord name as your focus
            for repetition.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {chordSet.map((chord) => (
            <button
              key={chord.name}
              onClick={() => playChord(chord.name, chord.notes)}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                active === chord.name
                  ? "border-brand-indigo bg-brand-indigo/10 text-brand-indigo"
                  : "border-stroke bg-white text-ink"
              }`}
            >
              {chord.name}
              <span className="mt-2 block text-xs font-normal text-ink-muted">
                {chord.notes.join(" - ")}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
