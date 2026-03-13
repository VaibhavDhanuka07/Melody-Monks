"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { curriculumCourses } from "@/data/universal-curriculum";

export default function AssignmentsPage() {
  const [activeSlug, setActiveSlug] = useState(curriculumCourses[0]?.slug ?? "singing");
  const activeCourse = useMemo(
    () => curriculumCourses.find((course) => course.slug === activeSlug) ?? curriculumCourses[0],
    [activeSlug]
  );

  const assignments = useMemo(() => {
    if (!activeCourse) return [];
    return activeCourse.modules
      .flatMap((module) =>
        module.lessons.map((lesson) => ({
          title: `Week ${module.order}: ${lesson.title}`,
          detail: lesson.assignment,
          slug: lesson.slug,
        }))
      )
      .slice(0, 6);
  }, [activeCourse]);

  if (!activeCourse) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Assignments</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          Weekly practice assignments
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Submit recordings and notes for instructor feedback.
        </p>
      </div>

      <div className="card-strong p-6">
        <label className="text-xs text-ink-muted">
          Select course
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
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <div key={assignment.title} className="card p-6">
            <p className="text-lg font-semibold text-ink">{assignment.title}</p>
            <p className="mt-2 text-sm text-ink-muted">{assignment.detail}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/lessons/${assignment.slug}`}
                className="btn-secondary"
              >
                View Lesson
              </Link>
              <Link href="/dashboard/performance-upload" className="btn-primary">
                Submit Recording
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
