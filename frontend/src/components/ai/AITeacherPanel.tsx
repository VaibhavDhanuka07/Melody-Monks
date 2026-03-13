"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type AITeacherPanelProps = {
  instrument?: string;
  lessonId?: string;
};

type AnalysisResult = {
  pitchScore: number;
  tempoScore: number;
  meanBpm: number | null;
  pitchSeries: number[];
  tempoSeries: number[];
  feedback: string[];
};

const practiceModes = [
  "Singing",
  "Piano",
  "Guitar",
  "Drums",
  "Violin",
  "Flute",
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const downsample = (values: number[], maxPoints: number) => {
  if (values.length <= maxPoints) return values;
  const step = Math.ceil(values.length / maxPoints);
  return values.filter((_, index) => index % step === 0);
};

const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
  const size = buffer.length;
  let rms = 0;
  for (let i = 0; i < size; i += 1) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1;

  let start = 0;
  let end = size - 1;
  while (start < size / 2 && Math.abs(buffer[start]) < 0.2) start += 1;
  while (end > start && Math.abs(buffer[end]) < 0.2) end -= 1;

  const trimmed = buffer.slice(start, end);
  const trimmedSize = trimmed.length;
  const correlations = new Array(trimmedSize).fill(0);

  for (let lag = 0; lag < trimmedSize; lag += 1) {
    for (let i = 0; i < trimmedSize - lag; i += 1) {
      correlations[lag] += trimmed[i] * trimmed[i + lag];
    }
  }

  let dip = 0;
  while (dip < trimmedSize - 1 && correlations[dip] > correlations[dip + 1]) {
    dip += 1;
  }

  let maxCorrelation = -1;
  let maxIndex = -1;
  for (let i = dip; i < trimmedSize; i += 1) {
    if (correlations[i] > maxCorrelation) {
      maxCorrelation = correlations[i];
      maxIndex = i;
    }
  }

  if (maxIndex <= 0) return -1;
  return sampleRate / maxIndex;
};

const analyzePerformance = (
  pitchValues: number[],
  rmsValues: number[],
  timeValues: number[],
  targetTempo: number
): AnalysisResult => {
  const validPitches = pitchValues.filter((value) => value > 0);
  let pitchScore = 0;
  if (validPitches.length > 4) {
    const logValues = validPitches.map((value) => Math.log2(value));
    const mean =
      logValues.reduce((sum, value) => sum + value, 0) / logValues.length;
    const variance =
      logValues.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      logValues.length;
    const std = Math.sqrt(variance);
    pitchScore = clamp(Math.round(100 - std * 120), 0, 100);
  }

  const meanRms =
    rmsValues.reduce((sum, value) => sum + value, 0) /
      (rmsValues.length || 1) || 0;
  const threshold = meanRms * 1.4;
  const peaks: Array<{ index: number; time: number }> = [];

  for (let i = 1; i < rmsValues.length - 1; i += 1) {
    const isPeak =
      rmsValues[i] > threshold &&
      rmsValues[i] > rmsValues[i - 1] &&
      rmsValues[i] > rmsValues[i + 1];
    const lastPeak = peaks[peaks.length - 1];
    if (isPeak && (!lastPeak || timeValues[i] - lastPeak.time > 0.25)) {
      peaks.push({ index: i, time: timeValues[i] });
    }
  }

  const intervals = peaks
    .slice(1)
    .map((peak, index) => peak.time - peaks[index].time)
    .filter((value) => value > 0.1);
  const bpmValues = intervals.map((interval) => 60 / interval);
  const meanBpm =
    bpmValues.reduce((sum, value) => sum + value, 0) /
      (bpmValues.length || 1) || null;
  const bpmVariance =
    bpmValues.reduce((sum, value) => sum + (value - (meanBpm || 0)) ** 2, 0) /
      (bpmValues.length || 1) || 0;
  const bpmStd = Math.sqrt(bpmVariance);
  const tempoStability = bpmValues.length
    ? clamp(Math.round(100 - bpmStd * 5), 0, 100)
    : 0;
  const tempoCloseness =
    meanBpm !== null
      ? clamp(Math.round(100 - Math.abs(meanBpm - targetTempo) * 1.5), 0, 100)
      : 0;
  const tempoScore = bpmValues.length
    ? Math.round(tempoStability * 0.4 + tempoCloseness * 0.6)
    : 0;

  const pitchSeries = downsample(
    validPitches.length ? pitchValues : rmsValues,
    120
  );

  const tempoSeries = new Array(rmsValues.length).fill(
    meanBpm ?? targetTempo
  );
  peaks.forEach((peak, index) => {
    if (index === 0) return;
    const interval = peak.time - peaks[index - 1].time;
    const bpm = interval > 0 ? 60 / interval : meanBpm ?? targetTempo;
    const start = peaks[index - 1].index;
    const end = peak.index;
    for (let i = start; i <= end; i += 1) {
      tempoSeries[i] = bpm;
    }
  });

  const tempoSeriesReduced = downsample(tempoSeries, 120);

  const feedback: string[] = [];
  if (pitchScore === 0) {
    feedback.push("Record a longer phrase to evaluate pitch stability.");
  } else if (pitchScore < 70) {
    feedback.push("Hold notes for 4 beats to stabilize pitch accuracy.");
  } else {
    feedback.push("Pitch stability looks strong. Increase range gradually.");
  }

  if (tempoScore === 0) {
    feedback.push("Play with a metronome to establish tempo consistency.");
  } else if (tempoScore < 70) {
    feedback.push("Reduce tempo by 10 BPM and focus on steady timing.");
  } else {
    feedback.push("Tempo control is solid. Try dynamic variations next.");
  }

  return {
    pitchScore,
    tempoScore,
    meanBpm,
    pitchSeries,
    tempoSeries: tempoSeriesReduced,
    feedback,
  };
};

const LineChart = ({
  values,
  label,
}: {
  values: number[];
  label: string;
}) => {
  if (!values.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-6 text-xs text-ink-muted">
        {label}: Record to generate the graph.
      </div>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">{label}</p>
      <svg
        viewBox="0 0 100 100"
        className="mt-3 h-28 w-full"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke="#C8A96A"
          strokeWidth="2"
          points={points}
        />
      </svg>
    </div>
  );
};

export default function AITeacherPanel({
  instrument,
  lessonId,
}: AITeacherPanelProps) {
  const [mode, setMode] = useState(() => instrument || "Singing");
  const [targetTempo, setTargetTempo] = useState(90);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);
  const [livePitch, setLivePitch] = useState<number | null>(null);
  const [liveRms, setLiveRms] = useState(0);
  const [recordTime, setRecordTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const pitchRef = useRef<number[]>([]);
  const rmsRef = useRef<number[]>([]);
  const timeRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioContextRef.current?.close();
    };
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    setMessage(null);
    setRecordedUrl(null);
    setAnalysis(null);
    setRecordTime(0);
    pitchRef.current = [];
    rmsRef.current = [];
    timeRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = context;
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedUrl(URL.createObjectURL(blob));
      };

      recorder.start();
      setIsRecording(true);

      intervalRef.current = window.setInterval(() => {
        const analyserNode = analyserRef.current;
        const contextRef = audioContextRef.current;
        if (!analyserNode || !contextRef) return;
        const buffer = new Float32Array(analyserNode.fftSize);
        analyserNode.getFloatTimeDomainData(buffer);

        let rms = 0;
        for (let i = 0; i < buffer.length; i += 1) {
          rms += buffer[i] * buffer[i];
        }
        rms = Math.sqrt(rms / buffer.length);

        const pitch = autoCorrelate(buffer, contextRef.sampleRate);
        const safePitch = pitch > 50 && pitch < 2000 ? pitch : -1;

        pitchRef.current.push(safePitch);
        rmsRef.current.push(rms);
        timeRef.current.push(contextRef.currentTime);

        setLivePitch(safePitch > 0 ? safePitch : null);
        setLiveRms(rms);
      }, 140);

      timerRef.current = window.setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Microphone access denied."
      );
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;

    const analysisResult = analyzePerformance(
      pitchRef.current,
      rmsRef.current,
      timeRef.current,
      targetTempo
    );
    setAnalysis(analysisResult);
  }, [isRecording, targetTempo]);

  const saveResults = async () => {
    if (!analysis) return;
    setStatus("saving");
    setMessage(null);

    try {
      const response = await apiFetch("/api/practice-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        auth: true,
        body: JSON.stringify({
          lessonId: lessonId || `${mode.toLowerCase()}-practice`,
          pitchScore: analysis.pitchScore,
          tempoScore: analysis.tempoScore,
          feedback: analysis.feedback.join(" "),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save practice analysis");
      }

      setStatus("saved");
      setMessage("Practice analysis saved.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Unable to save analysis."
      );
    }
  };

  const pitchLabel = livePitch ? `${livePitch.toFixed(1)} Hz` : "--";
  const tempoLabel = analysis?.meanBpm
    ? `${analysis.meanBpm.toFixed(0)} BPM`
    : "--";

  const progressSummary = useMemo(() => {
    if (!analysis) {
      return {
        pitchScore: 0,
        tempoScore: 0,
        feedback: ["Record a sample to get AI feedback."],
      };
    }
    return analysis;
  }, [analysis]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-gold">AI Teacher</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          AI Practice Assistant
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Record your practice, analyze pitch and rhythm, and get instant
          feedback.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="card-strong p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                  Practice Mode
                </p>
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value)}
                  className="mt-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-ink"
                >
                  {practiceModes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-ink-muted">
                Target tempo: {targetTempo} BPM
                <input
                  type="range"
                  min={60}
                  max={180}
                  value={targetTempo}
                  onChange={(event) =>
                    setTargetTempo(Number(event.target.value))
                  }
                  className="mt-2 w-full"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                <p className="text-xs text-ink-muted">Live pitch</p>
                <p className="mt-3 text-xl font-semibold text-ink">{pitchLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                <p className="text-xs text-ink-muted">Live energy</p>
                <p className="mt-3 text-xl font-semibold text-ink">
                  {(liveRms * 100).toFixed(0)}%
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                <p className="text-xs text-ink-muted">Tempo estimate</p>
                <p className="mt-3 text-xl font-semibold text-ink">
                  {tempoLabel}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={startRecording}
                className="btn-primary"
                disabled={isRecording}
              >
                Start Recording
              </button>
              <button
                type="button"
                onClick={stopRecording}
                className="btn-secondary"
                disabled={!isRecording}
              >
                Stop Recording
              </button>
              <span className="text-xs text-ink-muted">
                Recording time: {recordTime}s
              </span>
            </div>

            {recordedUrl ? (
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                <p className="text-xs text-ink-muted">Recorded audio</p>
                <audio controls className="mt-3 w-full">
                  <source src={recordedUrl} />
                </audio>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <LineChart
              values={analysis?.pitchSeries ?? []}
              label="Pitch graph"
            />
            <LineChart
              values={analysis?.tempoSeries ?? []}
              label="Tempo graph"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-strong p-6">
            <p className="text-sm font-semibold text-ink">Feedback Summary</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                <p className="text-xs text-ink-muted">Pitch Accuracy Score</p>
                <p className="mt-3 text-2xl font-semibold text-ink">
                  {progressSummary.pitchScore}%
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
                <p className="text-xs text-ink-muted">Tempo Stability Score</p>
                <p className="mt-3 text-2xl font-semibold text-ink">
                  {progressSummary.tempoScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="card-strong p-6">
            <p className="text-sm font-semibold text-ink">Practice Suggestions</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {progressSummary.feedback.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="card-strong p-6">
            <p className="text-sm font-semibold text-ink">Save Results</p>
            <p className="mt-2 text-sm text-ink-muted">
              Store this analysis in your practice history.
            </p>
            <button
              type="button"
              onClick={saveResults}
              className="btn-secondary mt-4 w-full"
              disabled={!analysis || status === "saving"}
            >
              {status === "saving" ? "Saving..." : "Save Analysis"}
            </button>
            {message ? (
              <p
                className={`mt-3 text-xs ${
                  status === "error" ? "text-red-300" : "text-emerald-300"
                }`}
              >
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
