"use client";

import { useEffect, useRef, useState } from "react";

export default function Metronome() {
  const [bpm, setBpm] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const playClick = (accent: boolean) => {
    if (!audioRef.current) {
      audioRef.current = new AudioContext();
    }
    const ctx = audioRef.current;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = accent ? 1200 : 900;
    gain.gain.value = 0.3;
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
    setBeat(0);
    playClick(true);
    timerRef.current = window.setInterval(() => {
      setBeat((prev) => {
        const next = (prev + 1) % 4;
        playClick(next === 0);
        return next;
      });
    }, interval);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [bpm, isRunning]);

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-purple">Metronome</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            Keep perfect time
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Adjust BPM and follow the visual beat indicator.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className="rounded-full bg-brand-indigo px-5 py-2 text-sm font-semibold text-white shadow-soft"
          >
            {isRunning ? "Stop" : "Start"}
          </button>
          <span className="rounded-full border border-stroke bg-white px-4 py-2 text-sm font-semibold text-ink">
            {bpm} BPM
          </span>
        </div>
      </div>

      <div className="mt-6">
        <input
          type="range"
          min={40}
          max={220}
          value={bpm}
          onChange={(event) => setBpm(Number(event.target.value))}
          className="w-full"
        />
        <div className="mt-6 flex items-center gap-3">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-4 w-4 rounded-full transition ${
                beat === index && isRunning
                  ? "bg-brand-amber shadow-soft"
                  : "bg-ink/10"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
