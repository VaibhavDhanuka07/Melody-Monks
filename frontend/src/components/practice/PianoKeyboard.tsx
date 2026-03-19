"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import * as Tone from "tone";

const whiteKeys = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"] as const;
const blackKeys = [
  { note: "C#4", left: "12%" },
  { note: "D#4", left: "26%" },
  { note: "F#4", left: "55%" },
  { note: "G#4", left: "69%" },
  { note: "A#4", left: "83%" },
] as const;

const chordLibrary: Record<string, string[]> = {
  "C Major": ["C4", "E4", "G4"],
  "D Minor": ["D4", "F4", "A4"],
  "G Major": ["G4", "B4", "D5"],
};

export default function PianoKeyboard() {
  const samplerRef = useRef<Tone.Sampler | null>(null);
  const samplerLoadingRef = useRef<Promise<void> | null>(null);
  const [ready, setReady] = useState(false);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [activeChord, setActiveChord] = useState<string>("");

  const initSampler = useCallback(async () => {
    if (samplerLoadingRef.current) {
      await samplerLoadingRef.current;
      return;
    }

    await Tone.start();

    if (!samplerRef.current) {
      samplerRef.current = new Tone.Sampler({
        urls: {
          C4: "C4.mp3",
          "D#4": "Ds4.mp3",
          "F#4": "Fs4.mp3",
          A4: "A4.mp3",
        },
        release: 1,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
      }).toDestination();
    }

    samplerLoadingRef.current = Tone.loaded()
      .then(() => {
        setReady(true);
      })
      .catch((error) => {
        console.error("Failed to load piano samples", error);
        samplerRef.current?.dispose();
        samplerRef.current = null;
        samplerLoadingRef.current = null;
      });

    await samplerLoadingRef.current;
  }, []);

  const flashNote = useCallback((note: string, duration = 240) => {
    setActiveNotes((prev) => Array.from(new Set([...prev, note])));
    window.setTimeout(() => {
      setActiveNotes((prev) => prev.filter((item) => item !== note));
    }, duration);
  }, []);

  const triggerNote = useCallback(
    async (note: string) => {
      await initSampler();
      samplerRef.current?.triggerAttackRelease(note, "8n");
      flashNote(note);
    },
    [flashNote, initSampler]
  );

  const playChord = useCallback(
    async (name: string) => {
      await initSampler();
      const notes = chordLibrary[name] ?? [];
      setActiveChord(name);
      notes.forEach((note) => {
        samplerRef.current?.triggerAttackRelease(note, "1n");
        flashNote(note, 500);
      });
    },
    [flashNote, initSampler]
  );

  const activeNoteSet = useMemo(() => new Set(activeNotes), [activeNotes]);

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-gold">
                Interactive Keyboard
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                Click keys to play notes
              </h2>
            </div>
            <span className="rounded-full bg-brand-gold-soft/20 px-3 py-1 text-xs font-semibold text-ink">
              {ready ? "Audio ready" : "Tap a key to enable audio"}
            </span>
          </div>

          <div className="relative mt-6 flex h-40 select-none">
            {whiteKeys.map((note) => (
              <button
                key={note}
                onClick={() => triggerNote(note)}
                className={`flex-1 border border-stroke bg-black/50 text-xs font-semibold transition ${
                  activeNoteSet.has(note)
                    ? "bg-brand-gold/20"
                    : "hover:bg-brand-gold/10"
                }`}
              >
                {note.replace("4", "")}
              </button>
            ))}
            {blackKeys.map((key) => (
              <button
                key={key.note}
                onClick={() => triggerNote(key.note)}
                className={`absolute top-0 h-24 w-[9%] rounded-b-xl border border-black/20 bg-ink text-xs font-semibold text-white transition ${
                  activeNoteSet.has(key.note)
                    ? "bg-brand-gold"
                    : "hover:bg-brand-gold-soft"
                }`}
                style={{ left: key.left }}
              >
                {key.note.replace("4", "")}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full space-y-4 lg:w-72">
          <div className="rounded-2xl border border-stroke bg-black/50 px-4 py-3">
            <p className="text-xs font-semibold text-ink-muted">
              Highlighted notes
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {activeNotes.length ? activeNotes.join(", ") : "None"}
            </p>
          </div>
          <div className="rounded-2xl border border-stroke bg-black/50 px-4 py-4">
            <p className="text-xs font-semibold text-ink-muted">Chord demo</p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {activeChord || "Select a chord"}
            </p>
            <div className="mt-4 grid gap-2">
              {Object.keys(chordLibrary).map((chord) => (
                <button
                  key={chord}
                  onClick={() => playChord(chord)}
                  className="rounded-full border border-stroke bg-black/50 px-4 py-2 text-xs font-semibold text-ink transition hover:border-brand-gold"
                >
                  {chord}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-brand-gold/10 via-brand-gold-soft/10 to-brand-gold-soft/10 p-4 text-xs text-ink-muted">
            Use headphones for clearer AI pitch detection.
          </div>
        </div>
      </div>
    </div>
  );
}
