"use client";

import { useMemo, useState } from "react";

const focuses = [
  "Vocal Training",
  "Hindustani Classical",
  "Bollywood Singing",
  "Piano",
  "Guitar",
  "Violin",
  "Tabla",
  "Harmonium",
];

const durations = [20, 30, 45, 60];

const buildPlan = (focus: string, duration: number, level: string) => {
  const blocks = [
    { title: "Warmup", minutes: Math.max(5, Math.round(duration * 0.2)) },
    { title: "Technique", minutes: Math.round(duration * 0.3) },
    { title: "Repertoire", minutes: Math.round(duration * 0.3) },
    { title: "Performance / Review", minutes: Math.round(duration * 0.2) },
  ];

  const tips: Record<string, string[]> = {
    "Vocal Training": [
      "Sargam with drone support",
      "Breath control drills",
      "Pitch accuracy practice",
    ],
    "Hindustani Classical": [
      "Alankar patterns",
      "Raag phrase practice",
      "Taal alignment",
    ],
    "Bollywood Singing": [
      "Lyric diction focus",
      "Emotion and phrasing",
      "Stage presence rehearsal",
    ],
    Piano: ["Scale runs", "Chord transitions", "Left-hand patterns"],
    Guitar: ["Chord changes", "Strumming patterns", "Scale practice"],
    Violin: ["Long tones", "Intonation drills", "Scale practice"],
    Tabla: ["Theka practice", "Layakari drills", "Taal cycles"],
    Harmonium: ["Sargam practice", "Bellows control", "Accompaniment"],
  };

  return {
    focus,
    level,
    blocks,
    tips: tips[focus] || ["Warmup routine", "Technique drills", "Review"],
  };
};

export default function PracticePlanCard() {
  const [focus, setFocus] = useState(focuses[0]);
  const [duration, setDuration] = useState(durations[1]);
  const [level, setLevel] = useState("Beginner");

  const plan = useMemo(() => buildPlan(focus, duration, level), [
    focus,
    duration,
    level,
  ]);

  return (
    <div className="card-strong p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">
            Daily Practice Plan
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Personalized riyaz plan
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Generate a focused plan based on instrument and duration.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-ink-muted">
          Total: {duration} minutes
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="text-xs text-ink-muted">
          Focus
          <select
            value={focus}
            onChange={(event) => setFocus(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
          >
            {focuses.map((item) => (
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
          Duration
          <select
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
          >
            {durations.map((item) => (
              <option key={item} value={item}>
                {item} minutes
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
            Plan Blocks
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            {plan.blocks.map((block) => (
              <li key={block.title} className="flex items-center justify-between">
                <span>{block.title}</span>
                <span className="text-ink-muted">{block.minutes} min</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
            Focus Tips
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {plan.tips.map((tip) => (
              <li key={tip}>- {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
