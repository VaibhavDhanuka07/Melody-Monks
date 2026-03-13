"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { Review } from "@/data/reviews";
import VideoLightbox, { type LightboxVideo } from "./VideoLightbox";

const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

type ReviewsCarouselProps = {
  reviews: Review[];
};

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [index, setIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<LightboxVideo | null>(null);

  const handleNext = () => {
    setIndex((current) => (current + 1) % reviews.length);
  };

  const handlePrev = () => {
    setIndex((current) => (current - 1 + reviews.length) % reviews.length);
  };

  const active = reviews[index];

  return (
    <div className="card-strong relative overflow-hidden p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-gold">Student Reviews</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-ink-muted transition hover:text-ink"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-ink-muted transition hover:text-ink"
          >
            Next
          </button>
        </div>
      </div>
      <div className="mt-8 min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={active.photo}
                  alt={active.studentName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-ink">
                  {active.studentName}
                </p>
                <p className="text-xs text-ink-muted">{active.program}</p>
              </div>
            </div>
            <p className="text-lg text-ink">&ldquo;{active.reviewText}&rdquo;</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted">
              <span>Rating: {active.rating}/5</span>
              {active.videoUrl ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveVideo({
                      title: `${active.studentName} testimonial`,
                      src: active.videoUrl || "",
                      poster: active.videoPoster || active.photo,
                    })
                  }
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-ink-muted transition hover:text-ink"
                >
                  Watch video
                </button>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <VideoLightbox
        open={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        video={activeVideo}
      />
    </div>
  );
}
