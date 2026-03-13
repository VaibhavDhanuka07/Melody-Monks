"use client";

import { useEffect, useRef, useState } from "react";

export default function StrummingTrainer() {
  const [bpm, setBpm] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [stroke, setStroke] = useState<"Down" | "Up">("Down");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const interval = (60 / bpm) * 1000;
    setStroke("Down");
    timerRef.current = window.setInterval(() => {
      setStroke((prev) => (prev === "Down" ? "Up" : "Down"));
    }, interval);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [bpm, isRunning]);

  return (
    <div className="card-strong p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Strumming Trainer</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Down-up strumming rhythm
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Follow the down-up indicator and lock in tempo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsRunning((prev) => !prev)}
          className="btn-primary"
        >
          {isRunning ? "Stop" : "Start"}
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="rounded-2xl border border-white/10 bg-black/60 px-6 py-4 text-center">
          <p className="text-xs text-ink-muted">Stroke</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{stroke}</p>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm text-ink-muted">
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
        </div>
      </div>
    </div>
  );
}
