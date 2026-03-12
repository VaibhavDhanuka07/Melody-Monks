"use client";

import { useCallback, useRef, useState } from "react";
import * as Tone from "tone";

const notes = [
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
];

export default function EarTraining() {
  const synthRef = useRef<Tone.Synth | null>(null);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [message, setMessage] = useState("Press play to start.");
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const init = useCallback(async () => {
    if (synthRef.current) return;
    await Tone.start();
    synthRef.current = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.02, release: 0.4 },
    }).toDestination();
  }, []);

  const playRandom = useCallback(async () => {
    await init();
    const note = notes[Math.floor(Math.random() * notes.length)];
    setCurrentNote(note);
    setMessage("Listen and choose the note.");
    synthRef.current?.triggerAttackRelease(note, "1n");
  }, [init]);

  const makeGuess = useCallback(
    (guess: string) => {
      if (!currentNote) return;
      const correct = guess === currentNote;
      setStats((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        total: prev.total + 1,
      }));
      setMessage(correct ? "Correct!" : `Not quite. It was ${currentNote}.`);
      setCurrentNote(null);
    },
    [currentNote]
  );

  const accuracy = stats.total
    ? Math.round((stats.correct / stats.total) * 100)
    : 0;

  return (
    <div className="card p-6">
      <div>
        <p className="text-sm font-semibold text-brand-indigo">Ear Training</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          Train your pitch recognition
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Listen to a note and select the correct pitch.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={playRandom}
          className="rounded-full bg-brand-indigo px-5 py-2 text-sm font-semibold text-white shadow-soft"
        >
          Play Random Note
        </button>
        <span className="text-sm font-semibold text-ink">Accuracy: {accuracy}%</span>
      </div>

      <p className="mt-4 text-sm text-ink-muted">{message}</p>

      <div className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {notes.map((note) => (
          <button
            key={note}
            onClick={() => makeGuess(note)}
            className="rounded-2xl border border-stroke bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:border-brand-indigo"
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
}
