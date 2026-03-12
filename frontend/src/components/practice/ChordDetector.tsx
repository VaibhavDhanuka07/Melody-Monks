"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const chordDictionary: Record<string, string[]> = {
  "C Major": ["C", "E", "G"],
  "D Minor": ["D", "F", "A"],
  "G Major": ["G", "B", "D"],
};

const frequencyToNoteName = (frequency: number) => {
  const midi = Math.round(69 + 12 * Math.log2(frequency / 440));
  return noteNames[midi % 12];
};

export default function ChordDetector() {
  const [isListening, setIsListening] = useState(false);
  const [detectedChord, setDetectedChord] = useState("--");
  const [accuracy, setAccuracy] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const analyze = useCallback(() => {
    const analyser = analyserRef.current;
    const context = audioContextRef.current;
    if (!analyser || !context) return;

    const dataArray = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(dataArray);

    const peaks: Array<{ freq: number; amp: number }> = [];
    const sampleRate = context.sampleRate;
    const binSize = sampleRate / (2 * analyser.fftSize);

    dataArray.forEach((amp, index) => {
      if (amp > -55) {
        const freq = index * binSize;
        if (freq >= 60 && freq <= 1200) {
          peaks.push({ freq, amp });
        }
      }
    });

    peaks.sort((a, b) => b.amp - a.amp);
    const topPeaks = peaks.slice(0, 6);
    const noteSet = new Set(
      topPeaks.map((peak) => frequencyToNoteName(peak.freq))
    );

    let bestMatch = "--";
    let bestScore = 0;

    Object.entries(chordDictionary).forEach(([name, notes]) => {
      const matches = notes.filter((note) => noteSet.has(note)).length;
      const score = matches / notes.length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = name;
      }
    });

    setDetectedChord(bestMatch);
    setAccuracy(Math.round(bestScore * 100));

    rafRef.current = requestAnimationFrame(analyze);
  }, []);

  const start = useCallback(async () => {
    if (isListening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 4096;

      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = context;
      analyserRef.current = analyser;
      mediaStreamRef.current = stream;
      setIsListening(true);
      analyze();
    } catch (error) {
      console.error("Microphone access denied", error);
    }
  }, [analyze, isListening]);

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-gold-soft">
            AI Chord Detection
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Detect chords from live audio
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Detects multiple frequencies and matches them to common chords.
          </p>
        </div>
        <button
          onClick={isListening ? stop : start}
          className="rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-white shadow-soft"
        >
          {isListening ? "Stop" : "Start"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-stroke bg-black/50 px-4 py-4">
          <p className="text-xs font-semibold text-ink-muted">Detected Chord</p>
          <p className="mt-3 text-2xl font-semibold text-ink">
            {detectedChord}
          </p>
        </div>
        <div className="rounded-2xl border border-stroke bg-black/50 px-4 py-4">
          <p className="text-xs font-semibold text-ink-muted">Accuracy</p>
          <p className="mt-3 text-2xl font-semibold text-ink">
            {accuracy}%
          </p>
        </div>
      </div>
      <div className="mt-4 text-xs text-ink-muted">
        Example chords: C Major = C E G, D Minor = D F A, G Major = G B D.
      </div>
    </div>
  );
}
