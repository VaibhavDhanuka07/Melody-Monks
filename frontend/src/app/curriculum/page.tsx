"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { curriculumCourses } from "@/data/universal-curriculum";

export default function CurriculumPage() {
  const [activeSlug, setActiveSlug] = useState(
    curriculumCourses[0]?.slug ?? "singing"
  );

  const activeCourse = useMemo(
    () =>
      curriculumCourses.find((course) => course.slug === activeSlug) ??
      curriculumCourses[0],
    [activeSlug]
  );

  if (!activeCourse) {
    return null;
  }

  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong grid gap-8 p-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Curriculum</p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">
              12-week universal music curriculum
            </h1>
            <p className="mt-4 text-sm text-ink-muted">
              Choose your instrument and follow the 48-lesson learning path with
              practice exercises, assignments, and performance reviews.
            </p>
          </div>

          <div className="grid gap-4 text-sm text-ink-muted">
            <div className="relative h-56 overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={activeCourse.image}
                alt={activeCourse.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            </div>
            <label className="text-xs text-ink-muted">
              Select instrument
              <select
                value={activeSlug}
                onChange={(event) => setActiveSlug(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              >
                {curriculumCourses.map((course) => (
                  <option key={course.slug} value={course.slug}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
              {activeCourse.modules.length} modules |{" "}
              {activeCourse.modules.length * 4} lessons
            </div>
            <Link
              href={`/courses/${activeCourse.slug}/curriculum`}
              className="btn-primary"
            >
              View Full Curriculum
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-6">
          {activeCourse.modules.map((module, index) => {
            const progress = Math.min(100, 8 + index * 7);
            return (
              <div key={module.id} className="card-strong overflow-hidden">
                <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
                  <div className="relative min-h-[220px] border-b border-white/10 lg:border-b-0 lg:border-r">
                    <Image
                      src={module.image}
                      alt={module.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 30vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                        Week {module.order}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-ink">
                        {module.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="max-w-2xl text-sm text-ink-muted">
                        {module.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
                        <span className="rounded-full border border-white/10 px-4 py-2">
                          {module.lessonCount} lessons
                        </span>
                        <span className="rounded-full border border-white/10 px-4 py-2">
                          {module.duration}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <div className="flex items-center justify-between text-xs text-ink-muted">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-brand-gold"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <Link
                        href={`/lessons/${module.lessons[0]?.slug}`}
                        className="btn-primary px-4 py-2 text-xs"
                      >
                        Start Module
                      </Link>
                    </div>
                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                      {module.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/lessons/${lesson.slug}`}
                          className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4 text-sm text-ink transition hover:border-brand-gold"
                        >
                          <p className="text-xs text-ink-muted">{lesson.id}</p>
                          <p className="mt-2 font-semibold text-ink">
                            {lesson.title}
                          </p>
                          <p className="mt-2 text-xs text-ink-muted">
                            {lesson.duration}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
