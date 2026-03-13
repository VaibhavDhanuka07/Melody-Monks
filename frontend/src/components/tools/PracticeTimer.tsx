"use client";

import { useEffect, useRef, useState } from "react";

const presets = [10, 15, 20, 30, 45];

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function PracticeTimer() {
  const [duration, setDuration] = useState(15);
  const [remaining, setRemaining] = useState(15 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setRemaining(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return duration * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [duration, running]);

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setRemaining(duration * 60);
  };

  return (
    <div className="card-strong p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Practice Timer</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Focused riyaz sessions
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Choose a duration and keep your practice focused and consistent.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/60 px-6 py-4 text-center">
          <p className="text-xs text-ink-muted">Remaining</p>
          <p className="mt-2 text-3xl font-semibold text-ink">
            {formatTime(remaining)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setDuration(preset)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              duration === preset
                ? "border-brand-gold/60 bg-brand-gold/10 text-brand-gold"
                : "border-white/10 text-ink-muted hover:border-brand-gold/40"
            }`}
          >
            {preset} min
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {running ? (
          <button type="button" onClick={handlePause} className="btn-secondary">
            Pause
          </button>
        ) : (
          <button type="button" onClick={handleStart} className="btn-primary">
            Start
          </button>
        )}
        <button type="button" onClick={handleReset} className="btn-secondary">
          Reset
        </button>
      </div>
    </div>
  );
}
