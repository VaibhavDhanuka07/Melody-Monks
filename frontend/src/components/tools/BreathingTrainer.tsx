"use client";

import { useEffect, useRef, useState } from "react";

const phases = [
  { label: "Inhale", color: "text-emerald-300" },
  { label: "Hold", color: "text-amber-300" },
  { label: "Exhale", color: "text-sky-300" },
];

export default function BreathingTrainer() {
  const [isRunning, setIsRunning] = useState(false);
  const [inhale, setInhale] = useState(4);
  const [hold, setHold] = useState(4);
  const [exhale, setExhale] = useState(6);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remaining, setRemaining] = useState(inhale);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setRemaining([inhale, hold, exhale][phaseIndex] || inhale);
  }, [inhale, hold, exhale, phaseIndex]);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setPhaseIndex((current) => (current + 1) % phases.length);
          return [inhale, hold, exhale][(phaseIndex + 1) % phases.length] || inhale;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [exhale, hold, inhale, isRunning, phaseIndex]);

  const activePhase = phases[phaseIndex];

  return (
    <div className="card-strong p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Breathing Trainer</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Control breath cycles
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Use inhale-hold-exhale cycles to improve breath management.
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

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_2fr]">
        <div className="rounded-2xl border border-white/10 bg-black/60 px-6 py-4 text-center">
          <p className="text-xs text-ink-muted">Phase</p>
          <p className={`mt-2 text-2xl font-semibold ${activePhase.color}`}>
            {activePhase.label}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {remaining}s remaining
          </p>
        </div>
        <div className="space-y-3">
          <label className="text-xs text-ink-muted">
            Inhale (sec)
            <input
              type="number"
              min={2}
              max={10}
              value={inhale}
              onChange={(event) => setInhale(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
            />
          </label>
          <label className="text-xs text-ink-muted">
            Hold (sec)
            <input
              type="number"
              min={0}
              max={10}
              value={hold}
              onChange={(event) => setHold(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
            />
          </label>
          <label className="text-xs text-ink-muted">
            Exhale (sec)
            <input
              type="number"
              min={2}
              max={12}
              value={exhale}
              onChange={(event) => setExhale(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
