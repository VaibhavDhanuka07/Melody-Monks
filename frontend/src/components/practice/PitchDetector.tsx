"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const frequencyToNote = (frequency: number) => {
  const midi = Math.round(69 + 12 * Math.log2(frequency / 440));
  const name = noteNames[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
};

const detectFrequency = (analyser: AnalyserNode, sampleRate: number) => {
  const dataArray = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(dataArray);

  const binSize = sampleRate / (2 * analyser.fftSize);
  const minIndex = Math.floor(50 / binSize);
  const maxIndexRange = Math.min(
    dataArray.length - 1,
    Math.floor(2000 / binSize)
  );

  let maxValue = -Infinity;
  let peakIndex = -1;
  for (let i = minIndex; i <= maxIndexRange; i += 1) {
    if (dataArray[i] > maxValue) {
      maxValue = dataArray[i];
      peakIndex = i;
    }
  }

  if (peakIndex === -1 || maxValue < -70) {
    return { frequency: -1, clarity: 0 };
  }

  const frequency = peakIndex * binSize;
  const clarity = Math.min(1, Math.max(0, (maxValue + 90) / 90));
  return { frequency, clarity };
};

export default function PitchDetector() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("--");
  const [frequency, setFrequency] = useState<number | null>(null);
  const [clarity, setClarity] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
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

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    const context = audioContextRef.current;
    if (!analyser || !context) return;

    const result = detectFrequency(analyser, context.sampleRate);
    if (result.frequency !== -1) {
      setFrequency(result.frequency);
      setNote(frequencyToNote(result.frequency));
      setClarity(result.clarity);
    } else {
      setFrequency(null);
      setNote("--");
      setClarity(0);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    if (isListening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;

      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = context;
      analyserRef.current = analyser;
      mediaStreamRef.current = stream;
      setIsListening(true);
      tick();
    } catch (error) {
      console.error("Microphone access denied", error);
    }
  }, [isListening, tick]);

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-gold">
            AI Piano Note Detection
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Detect notes in real time
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Uses FFT frequency analysis to identify notes from your microphone.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={isListening ? stop : start}
            className="rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-white shadow-soft"
          >
            {isListening ? "Stop" : "Start"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stroke bg-black/50 px-4 py-4">
          <p className="text-xs font-semibold text-ink-muted">Detected note</p>
          <p className="mt-3 text-2xl font-semibold text-ink">{note}</p>
        </div>
        <div className="rounded-2xl border border-stroke bg-black/50 px-4 py-4">
          <p className="text-xs font-semibold text-ink-muted">Frequency</p>
          <p className="mt-3 text-2xl font-semibold text-ink">
            {frequency ? `${frequency.toFixed(1)} Hz` : "--"}
          </p>
        </div>
        <div className="rounded-2xl border border-stroke bg-black/50 px-4 py-4">
          <p className="text-xs font-semibold text-ink-muted">Clarity</p>
          <p className="mt-3 text-2xl font-semibold text-ink">
            {(clarity * 100).toFixed(0)}%
          </p>
        </div>
      </div>
      <div className="mt-4 text-xs text-ink-muted">
        Reference: A4 = 440 Hz, C4 = 261 Hz, E4 = 329 Hz.
      </div>
    </div>
  );
}
