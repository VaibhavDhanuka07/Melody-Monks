"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { uploadFileWithSignedUrl } from "@/lib/storage/upload";

type LessonListItem = {
  id: string;
  slug: string;
  title: string;
  moduleTitle: string;
  moduleOrder: number;
};

type LessonModuleGroup = {
  id: string;
  title: string;
  order: number;
  lessons: LessonListItem[];
};

type LessonDownloads = {
  id: string;
  title: string;
  description: string;
  href: string;
};

type LessonPlayerProps = {
  instrument: string;
  courseName: string;
  moduleTitle: string;
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonVideoUrl: string;
  lessonNotes: string;
  lessonTheory: string;
  practiceExercises: string[];
  assignment: string;
  modules: LessonModuleGroup[];
  lessonIndex: number;
  totalLessons: number;
  downloads: LessonDownloads[];
  coverImage: string;
};

const playbackRates = [0.75, 1, 1.25, 1.5, 2];
const tabs = ["Overview", "Notes", "Exercises", "Downloads"] as const;
type TabKey = (typeof tabs)[number];

export default function LessonPlayer({
  instrument,
  courseName,
  moduleTitle,
  lessonId,
  lessonSlug,
  lessonTitle,
  lessonVideoUrl,
  lessonNotes,
  lessonTheory,
  practiceExercises,
  assignment,
  modules,
  lessonIndex,
  totalLessons,
  downloads,
  coverImage,
}: LessonPlayerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("Overview");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [lessonListOpen, setLessonListOpen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSavedTime = useRef(0);

  const storageKey = useMemo(
    () => `lesson-progress-${instrument.toLowerCase()}`,
    [instrument]
  );

  const [progressMap, setProgressMap] = useState<
    Record<string, { completed: boolean; watchedTime: number }>
  >({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Record<
        string,
        { completed: boolean; watchedTime: number }
      >;
      if (parsed) {
        setProgressMap(parsed);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const updateLocalProgress = useCallback(
    (updates: { completed?: boolean; watchedTime?: number }) => {
      setProgressMap((prev) => {
        const current = prev[lessonSlug] ?? {
          completed: false,
          watchedTime: 0,
        };
        const next = {
          ...prev,
          [lessonSlug]: {
            completed: updates.completed ?? current.completed,
            watchedTime: updates.watchedTime ?? current.watchedTime,
          },
        };
        if (typeof window !== "undefined") {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        }
        return next;
      });
    },
    [lessonSlug, storageKey]
  );

  const syncProgress = useCallback(
    async (payload: { completed: boolean; watchedTime: number }) => {
      try {
        await apiFetch("/api/lesson-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          auth: true,
          body: JSON.stringify({
            lessonId: lessonSlug,
            completed: payload.completed,
            watchedTime: payload.watchedTime,
          }),
        });
      } catch {
        // Ignore sync errors to avoid blocking playback.
      }
    },
    [lessonSlug]
  );

  const currentProgress = progressMap[lessonSlug];
  const completedLessons = useMemo(
    () =>
      new Set(
        Object.entries(progressMap)
          .filter(([, value]) => value.completed)
          .map(([key]) => key)
      ),
    [progressMap]
  );

  const totalCompleted = completedLessons.size;
  const courseProgressPercent = totalLessons
    ? Math.round((totalCompleted / totalLessons) * 100)
    : 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentProgress?.watchedTime) return;
    const resumeTime = Math.min(currentProgress.watchedTime, video.duration || 0);
    if (resumeTime > 1 && video.currentTime < 1) {
      video.currentTime = resumeTime;
    }
  }, [currentProgress?.watchedTime]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const currentTime = video.currentTime;
    const percent = Math.min(100, (currentTime / video.duration) * 100);
    setProgressPercent(percent);

    if (Math.abs(currentTime - lastSavedTime.current) >= 8) {
      lastSavedTime.current = currentTime;
      updateLocalProgress({ watchedTime: currentTime });
    }
  };

  const handlePause = () => {
    const video = videoRef.current;
    if (!video) return;
    updateLocalProgress({ watchedTime: video.currentTime });
    void syncProgress({
      completed: currentProgress?.completed ?? false,
      watchedTime: video.currentTime,
    });
  };

  const handleEnded = () => {
    const video = videoRef.current;
    const watchedTime = video?.currentTime ?? 0;
    updateLocalProgress({ completed: true, watchedTime });
    void syncProgress({ completed: true, watchedTime });
  };

  const handleRateChange = (value: number) => {
    setPlaybackRate(value);
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void video.requestFullscreen();
    }
  };

  const markCompleted = () => {
    const video = videoRef.current;
    const watchedTime = video?.currentTime ?? 0;
    updateLocalProgress({ completed: true, watchedTime });
    void syncProgress({ completed: true, watchedTime });
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploaded = await uploadFileWithSignedUrl({
        file,
        kind: "performance-upload",
      });
      setUploadedUrl(uploaded.url);
      return uploaded.url;
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to upload video"
      );
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAssignmentSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get("videoFile") as File;
    let videoUrl = String(formData.get("videoUrl") || "");

    if (file && file.size > 0) {
      const uploaded = await handleUpload(file);
      if (uploaded) {
        videoUrl = uploaded;
      }
    }

    if (!videoUrl) {
      setStatus("error");
      setMessage("Please provide a video link or upload a file.");
      return;
    }

    const payload = {
      name: formData.get("name"),
      title: formData.get("title"),
      videoUrl,
      notes: formData.get("notes"),
    };

    try {
      const response = await apiFetch("/api/performance-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        auth: true,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to submit performance");
      }

      setStatus("success");
      setMessage("Assignment submitted for instructor review.");
      setUploadedUrl(null);
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong. Try again."
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-ink-muted">
            {courseName} | Lesson {lessonIndex} / {totalLessons}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">{lessonTitle}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Module: {moduleTitle} | {instrument} Program
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={`/courses/${instrument.toLowerCase()}`}
            className="btn-ghost w-full sm:w-auto"
          >
            Back to Course
          </Link>
          <Link
            href={`/dashboard/ai-teacher?instrument=${instrument}&lessonId=${lessonSlug}`}
            className="btn-primary w-full sm:w-auto"
          >
            Practice with AI Teacher
          </Link>
          <button
            type="button"
            onClick={markCompleted}
            className="btn-secondary w-full sm:w-auto"
          >
            Mark Complete
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.4fr]">
        <div className="space-y-6">
          <div className="card-strong overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={coverImage}
                    alt={instrument}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                    Streaming lesson
                  </p>
                  <p className="text-sm font-semibold text-ink">{lessonId}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  Progress {Math.round(progressPercent)}%
                </span>
                {currentProgress?.completed ? (
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                    Completed
                  </span>
                ) : null}
              </div>
            </div>
            <div className="relative bg-black">
              {videoReady ? (
                <video
                  ref={videoRef}
                  controls
                  playsInline
                  preload="none"
                  autoPlay
                  poster={coverImage}
                  className="h-full w-full object-cover"
                  onTimeUpdate={handleTimeUpdate}
                  onPause={handlePause}
                  onEnded={handleEnded}
                >
                  <source src={lessonVideoUrl} />
                </video>
              ) : (
                <button
                  type="button"
                  onClick={() => setVideoReady(true)}
                  className="group relative flex w-full flex-col items-center justify-center"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={coverImage}
                      alt={lessonTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 70vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold text-sm font-semibold text-black shadow-glow">
                      Play
                    </div>
                    <p className="text-xs text-ink-muted">
                      Tap to load the lesson video
                    </p>
                  </div>
                </button>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                  className="h-full bg-brand-gold"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4 text-sm text-ink-muted">
              <div className="flex flex-wrap items-center gap-3">
                <span>Playback speed</span>
                <select
                  value={playbackRate}
                  onChange={(event) =>
                    handleRateChange(Number(event.target.value))
                  }
                  className="rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs text-ink"
                >
                  {playbackRates.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}x
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleFullscreen}
                className="rounded-full border border-white/10 px-4 py-2 text-xs text-ink-muted transition hover:text-ink"
              >
                Fullscreen
              </button>
            </div>
          </div>

          <div className="card-strong p-6">
            <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeTab === tab
                      ? "bg-brand-gold/20 text-brand-gold"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Overview" ? (
              <div className="mt-5 space-y-4 text-sm text-ink-muted">
                <p>
                  This lesson focuses on {lessonTitle.toLowerCase()} with
                  guided practice and performance feedback.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                      Outcomes
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                      {practiceExercises.slice(0, 2).map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                      <li>- Assignment submission</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                      Resources
                    </p>
                    <p className="mt-3 text-sm text-ink-muted">
                      Access worksheets, sheet music, and backing tracks inside the
                      downloads tab.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "Notes" ? (
              <div className="mt-5 space-y-4 text-sm text-ink-muted">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                    Lesson Notes
                  </p>
                  <p className="mt-3">{lessonNotes}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                    Theory
                  </p>
                  <p className="mt-3">{lessonTheory}</p>
                </div>
              </div>
            ) : null}

            {activeTab === "Exercises" ? (
              <div className="mt-5 space-y-6 text-sm text-ink-muted">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                    Practice Exercises
                  </p>
                  <ul className="mt-3 space-y-2">
                    {practiceExercises.map((exercise) => (
                      <li key={exercise}>- {exercise}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                    Assignment
                  </p>
                  <p className="mt-3 text-sm text-ink-muted">{assignment}</p>
                </div>
                <form onSubmit={handleAssignmentSubmit} className="card p-6 space-y-4">
                  <p className="text-sm font-semibold text-ink">
                    Upload Practice Video
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm text-ink-muted">
                      Name
                      <input
                        name="name"
                        required
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
                      />
                    </label>
                    <label className="text-sm text-ink-muted">
                      Title
                      <input
                        name="title"
                        defaultValue={`${lessonTitle} Practice`}
                        required
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
                      />
                    </label>
                    <label className="text-sm text-ink-muted md:col-span-2">
                      Upload MP4/MOV (optional)
                      <input
                        type="file"
                        name="videoFile"
                        accept="video/mp4,video/quicktime,video/*"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
                      />
                    </label>
                    <label className="text-sm text-ink-muted md:col-span-2">
                      Video Link
                      <input
                        name="videoUrl"
                        placeholder="https://..."
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
                      />
                    </label>
                    <label className="text-sm text-ink-muted md:col-span-2">
                      Notes
                      <input
                        name="notes"
                        placeholder="What feedback do you want?"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Submitting..." : "Submit Assignment"}
                  </button>
                  {uploading ? (
                    <p className="text-xs text-ink-muted">Uploading video...</p>
                  ) : null}
                  {uploadedUrl ? (
                    <p className="text-xs text-emerald-300">Upload complete.</p>
                  ) : null}
                  {message ? (
                    <p
                      className={`text-sm ${
                        status === "error" ? "text-red-300" : "text-emerald-300"
                      }`}
                    >
                      {message}
                    </p>
                  ) : null}
                </form>
              </div>
            ) : null}

            {activeTab === "Downloads" ? (
              <div className="mt-5 space-y-4">
                {downloads.map((download) => (
                  <a
                    key={download.id}
                    href={download.href}
                    download
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-ink-muted transition hover:border-brand-gold/40"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {download.title}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {download.description}
                      </p>
                    </div>
                    <span className="text-xs text-brand-gold">Download</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-4 lg:hidden">
            <div className="card-strong p-5">
              <p className="text-sm font-semibold text-ink">Course Progress</p>
              <p className="mt-2 text-xs text-ink-muted">
                Progress: {totalCompleted} / {totalLessons} lessons completed
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-brand-gold"
                  style={{ width: `${courseProgressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                {courseProgressPercent}% complete
              </p>
            </div>

            <div className="card-strong p-5">
              <button
                type="button"
                onClick={() => setLessonListOpen((prev) => !prev)}
                className="flex w-full items-center justify-between text-sm font-semibold text-ink"
                aria-expanded={lessonListOpen}
              >
                Lesson List
                <span className="text-xs text-ink-muted">
                  {lessonListOpen ? "Hide" : "Show"}
                </span>
              </button>
              {lessonListOpen ? (
                <div className="mt-4 space-y-4">
                  {modules.map((moduleItem) => (
                    <div key={moduleItem.id} className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                        Module {moduleItem.order} - {moduleItem.title}
                      </p>
                      <div className="space-y-2">
                        {moduleItem.lessons.map((lesson) => {
                          const isCurrent = lesson.slug === lessonSlug;
                          const isComplete = completedLessons.has(lesson.slug);
                          return (
                            <Link
                              key={lesson.slug}
                              href={`/courses/${instrument.toLowerCase()}/lesson/${lesson.slug}`}
                              className={`flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-xs transition ${
                                isCurrent
                                  ? "border-brand-gold/60 bg-brand-gold/10 text-brand-gold"
                                  : "border-white/10 bg-black/40 text-ink-muted hover:border-brand-gold/40"
                              }`}
                            >
                              <span className="truncate">{lesson.title}</span>
                              <span className="text-xs">
                                {isComplete ? "Done" : ""}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="hidden space-y-4 lg:block">
          <div className="card-strong p-5">
            <p className="text-sm font-semibold text-ink">Course Progress</p>
            <p className="mt-2 text-xs text-ink-muted">
              Progress: {totalCompleted} / {totalLessons} lessons completed
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-brand-gold"
                style={{ width: `${courseProgressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-muted">
              {courseProgressPercent}% complete
            </p>
          </div>

          <div className="card-strong max-h-[520px] overflow-y-auto p-5">
            <p className="text-sm font-semibold text-ink">Lesson List</p>
            <div className="mt-4 space-y-4">
              {modules.map((moduleItem) => (
                <div key={moduleItem.id} className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                    Module {moduleItem.order} - {moduleItem.title}
                  </p>
                  <div className="space-y-2">
                    {moduleItem.lessons.map((lesson) => {
                      const isCurrent = lesson.slug === lessonSlug;
                      const isComplete = completedLessons.has(lesson.slug);
                      return (
                        <Link
                          key={lesson.slug}
                          href={`/courses/${instrument.toLowerCase()}/lesson/${lesson.slug}`}
                          className={`flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-xs transition ${
                            isCurrent
                              ? "border-brand-gold/60 bg-brand-gold/10 text-brand-gold"
                              : "border-white/10 bg-black/40 text-ink-muted hover:border-brand-gold/40"
                          }`}
                        >
                          <span className="truncate">
                            {lesson.title}
                          </span>
                          <span className="text-xs">
                            {isComplete ? "Done" : ""}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
