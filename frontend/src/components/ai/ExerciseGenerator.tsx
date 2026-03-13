"use client";

import { useMemo, useState } from "react";

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

const focusAreas = [
  "Pitch Accuracy",
  "Rhythm Control",
  "Technique",
  "Expression",
  "Performance Prep",
];

const baseExercises: Record<string, string[]> = {
  Vocal: [
    "Sargam ladder with drone",
    "Breath control holds",
    "Alankar patterns",
    "Taal alignment practice",
  ],
  Piano: [
    "Major scale runs",
    "Chord inversion drills",
    "Left-hand accompaniment",
    "Sight-reading passages",
  ],
  Guitar: [
    "Chord change cycles",
    "Strumming patterns",
    "Pentatonic scale",
    "Fingerstyle arpeggios",
  ],
  Violin: [
    "Long-tone bows",
    "Intonation drills",
    "Scale sequences",
    "Shift position practice",
  ],
  Tabla: [
    "Theka practice",
    "Layakari drills",
    "Bol patterns",
    "Taal cycle recitation",
  ],
  Harmonium: [
    "Sargam practice",
    "Bellows control",
    "Chord progressions",
    "Accompaniment drills",
  ],
  Flute: [
    "Breath support exercises",
    "Pitch stability holds",
    "Scale patterns",
    "Articulation practice",
  ],
  Drums: [
    "Stick control warmup",
    "Groove subdivision",
    "Beat variations",
    "Fill practice",
  ],
};

const focusTips: Record<string, string> = {
  "Pitch Accuracy": "Use a tanpura drone and hold each note for 4 beats.",
  "Rhythm Control": "Keep a metronome at a slow tempo before speeding up.",
  Technique: "Isolate tricky passages and repeat slowly for clean execution.",
  Expression: "Add dynamics and phrasing once the notes are stable.",
  "Performance Prep": "Record a take and review posture, tone, and confidence.",
};

const buildExercises = (
  instrument: string,
  focus: string,
  duration: number,
  seed: number
) => {
  const pool = baseExercises[instrument] || baseExercises.Vocal;
  const rotation = seed % pool.length;
  const items = [...pool.slice(rotation), ...pool.slice(0, rotation)];
  const selected = items.slice(0, 3);
  const perExercise = Math.max(5, Math.round(duration / 4));

  return [
    ...selected.map((title) => ({
      title,
      minutes: perExercise,
      note: focusTips[focus] || focusTips["Pitch Accuracy"],
    })),
    {
      title: `${focus} focus drill`,
      minutes: Math.max(5, duration - perExercise * 3),
      note: focusTips[focus] || focusTips["Pitch Accuracy"],
    },
  ];
};

export default function ExerciseGenerator() {
  const [instrument, setInstrument] = useState("Vocal");
  const [focus, setFocus] = useState(focusAreas[0]);
  const [duration, setDuration] = useState(30);
  const [level, setLevel] = useState("Beginner");
  const [seed, setSeed] = useState(0);

  const exercises = useMemo(
    () => buildExercises(instrument, focus, duration, seed),
    [instrument, focus, duration, seed]
  );

  return (
    <div className="card-strong p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">
            Exercise Generator
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            AI practice drills
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Build custom exercises for each day&apos;s riyaz.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSeed((value) => value + 1)}
          className="btn-secondary"
        >
          Generate
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
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
          Focus
          <select
            value={focus}
            onChange={(event) => setFocus(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
          >
            {focusAreas.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-ink-muted">
          Level
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
          >
            {["Beginner", "Intermediate", "Advanced"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-ink-muted">
          Duration (min)
          <input
            type="number"
            min={15}
            max={120}
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {exercises.map((exercise) => (
          <div
            key={`${exercise.title}-${exercise.minutes}`}
            className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4"
          >
            <p className="text-sm font-semibold text-ink">{exercise.title}</p>
            <p className="mt-2 text-xs text-ink-muted">
              {exercise.minutes} min · {level}
            </p>
            <p className="mt-3 text-xs text-ink-muted">{exercise.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
