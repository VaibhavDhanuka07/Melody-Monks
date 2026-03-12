"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { Testimonial } from "@/data/site";

const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

type TestimonialsCarouselProps = {
  testimonials: Testimonial[];
};

export default function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((current) => (current + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const active = testimonials[index];

  return (
    <div className="card-strong relative overflow-hidden p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-gold">Testimonials</p>
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
            key={active.name}
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
                  src={active.image}
                  alt={active.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-ink">{active.name}</p>
                <p className="text-xs text-ink-muted">{active.title}</p>
              </div>
            </div>
            <p className="text-lg text-ink">
              &ldquo;{active.quote}&rdquo;
            </p>
            <p className="text-sm text-ink-muted">Rating: {active.rating}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
