"use client";

import { useEffect, useRef, useState } from "react";

const patterns = [
  {
    name: "8-step groove",
    steps: [1, 0, 0, 1, 0, 1, 0, 0],
  },
  {
    name: "Tabla pulse",
    steps: [1, 0, 1, 0, 1, 0, 1, 0],
  },
  {
    name: "Syncopation",
    steps: [1, 0, 0, 1, 1, 0, 0, 1],
  },
];

export default function BeatGenerator() {
  const [bpm, setBpm] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [activePattern, setActivePattern] = useState(patterns[0]);
  const [step, setStep] = useState(0);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const playClick = (accent: boolean) => {
    if (!audioRef.current) {
      audioRef.current = new AudioContext();
    }
    const ctx = audioRef.current;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = accent ? 1200 : 800;
    gain.gain.value = 0.25;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.05);
  };

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const interval = (60 / bpm) * 1000;
    timerRef.current = window.setInterval(() => {
      setStep((prev) => {
        const next = (prev + 1) % activePattern.steps.length;
        const accent = activePattern.steps[next] === 1;
        playClick(accent);
        return next;
      });
    }, interval);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activePattern, bpm, isRunning]);

  return (
    <div className="card-strong p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Beat Generator</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Loop a groove pattern
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Choose a pattern and follow the pulse.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsRunning((prev) => !prev)}
          className="btn-primary"
        >
          {isRunning ? "Stop" : "Play"}
        </button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {patterns.map((pattern) => (
          <button
            key={pattern.name}
            type="button"
            onClick={() => {
              setActivePattern(pattern);
              setStep(0);
            }}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              activePattern.name === pattern.name
                ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                : "border-white/10 text-ink-muted hover:border-brand-gold/40"
            }`}
          >
            {pattern.name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-ink-muted">
        <span>Tempo</span>
        <span>{bpm} BPM</span>
      </div>
      <input
        type="range"
        min={60}
        max={160}
        value={bpm}
        onChange={(event) => setBpm(Number(event.target.value))}
        className="mt-2 w-full"
      />

      <div className="mt-6 flex gap-2">
        {activePattern.steps.map((value, index) => (
          <div
            key={`${activePattern.name}-${index}`}
            className={`h-4 w-4 rounded-full transition ${
              step === index && isRunning
                ? "bg-brand-gold shadow-soft"
                : value === 1
                ? "bg-ink/40"
                : "bg-ink/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
