"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type ShowcaseImage = {
  id: string;
  src: string;
  title: string;
  caption: string;
  layout: string;
};

const showcaseImages: ShowcaseImage[] = [
  {
    id: "hero-stage",
    src: "/vasu/vasu-hero-stage.svg",
    title: "Signature Stage Presence",
    caption: "Cinematic performance coaching rooted in Indian stage craft.",
    layout: "md:col-span-2 md:row-span-2",
  },
  {
    id: "mentor-portrait",
    src: "/vasu/vasu-mentor-portrait.svg",
    title: "Mentor Portrait",
    caption: "A premium brand frame for Debojeet Lahiri and Melody Monks.",
    layout: "md:row-span-2",
  },
  {
    id: "masterclass",
    src: "/vasu/vasu-masterclass.svg",
    title: "Masterclass Moments",
    caption: "High-touch coaching with students in structured live sessions.",
    layout: "",
  },
  {
    id: "live-class",
    src: "/vasu/vasu-live-class.svg",
    title: "Live Class Frames",
    caption: "Online and offline classes designed to feel like studio mentorship.",
    layout: "",
  },
  {
    id: "studio-session",
    src: "/vasu/vasu-studio-session.svg",
    title: "Studio Sessions",
    caption: "Recording, playback review, and professional feedback loops.",
    layout: "md:col-span-2",
  },
  {
    id: "student-recital",
    src: "/vasu/vasu-student-recital.svg",
    title: "Student Recitals",
    caption: "Students move from practice rooms to recital-ready performances.",
    layout: "",
  },
  {
    id: "judge-panel",
    src: "/vasu/vasu-judge-panel.svg",
    title: "Industry Authority",
    caption: "Built around the instructor's judge, guest, and mentor profile.",
    layout: "",
  },
  {
    id: "practice-room",
    src: "/vasu/vasu-practice-room.svg",
    title: "Daily Practice Rooms",
    caption: "Practice systems, keys, rhythm, and repetition that build confidence.",
    layout: "",
  },
];

export default function PhotoShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const activeImage = useMemo(
    () => (activeIndex === null ? null : showcaseImages[activeIndex]),
    [activeIndex]
  );

  const openImage = useCallback((index: number) => {
    setActiveIndex(index);
    setIsZoomed(false);
  }, []);

  const closeImage = useCallback(() => {
    setActiveIndex(null);
    setIsZoomed(false);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % showcaseImages.length;
    });
    setIsZoomed(false);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + showcaseImages.length) % showcaseImages.length;
    });
    setIsZoomed(false);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeImage();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, closeImage, goNext, goPrev]);

  useEffect(() => {
    if (activeIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [activeIndex]);

  return (
    <section className="mx-auto w-full max-w-6xl px-6" id="photo-showcase">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Photo Showcase</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">
            Inside the academy studio and live classes
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            A cinematic glimpse into teaching, performances, and practice
            sessions.
          </p>
        </div>
        <div className="text-xs uppercase tracking-[0.35em] text-ink-muted">
          6 curated scenes
        </div>
      </div>

      <div className="mt-8 grid auto-rows-[140px] grid-cols-1 gap-4 sm:auto-rows-[150px] sm:grid-cols-2 md:grid-cols-3 md:auto-rows-[180px] md:grid-flow-dense">
        {showcaseImages.map((image, index) => (
          <div
            key={image.id}
            className={`relative ${image.layout} overflow-hidden rounded-3xl border border-white/10 bg-black/50`}
          >
            <button
              type="button"
              onClick={() => openImage(index)}
              className="group relative h-full w-full text-left"
              aria-label={`Open ${image.title}`}
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm font-semibold text-ink">{image.title}</p>
                <p className="mt-1 text-xs text-ink-muted">{image.caption}</p>
              </div>
            </button>
          </div>
        ))}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 px-4 py-8"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={closeImage} />
          <div
            className="relative z-10 w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
                  Photo Showcase
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-ink">
                  {activeImage.title}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">
                  {activeImage.caption}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-white/10 px-3 py-2 text-ink-muted">
                  {activeIndex! + 1} / {showcaseImages.length}
                </span>
                <button
                  type="button"
                  onClick={goPrev}
                  className="rounded-full border border-white/10 px-4 py-2 text-ink-muted transition hover:text-ink"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-full border border-white/10 px-4 py-2 text-ink-muted transition hover:text-ink"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomed((prev) => !prev)}
                  className="rounded-full border border-brand-gold/40 px-4 py-2 text-brand-gold transition hover:border-brand-gold"
                >
                  {isZoomed ? "Reset Zoom" : "Zoom"}
                </button>
                <button
                  type="button"
                  onClick={closeImage}
                  className="rounded-full border border-white/10 px-4 py-2 text-ink-muted transition hover:text-ink"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/70">
              <div className="relative aspect-[16/9] w-full cursor-zoom-in">
                <Image
                  src={activeImage.src}
                  alt={activeImage.title}
                  fill
                  sizes="100vw"
                  className={`object-contain transition-transform duration-500 ${
                    isZoomed ? "scale-110" : "scale-100"
                  }`}
                  onClick={() => setIsZoomed((prev) => !prev)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
