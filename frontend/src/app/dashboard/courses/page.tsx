import Link from "next/link";
import { site } from "@/data/site";
import { curriculumCourses } from "@/data/universal-curriculum";

export default function DashboardCoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">My Courses</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          {site.programName}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Track your enrollment, progress, and upcoming lessons.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Indian Music Mastery Program",
            progress: "42% complete",
            nextLesson: "Raag Yaman - Bandish",
          },
          {
            title: "Bollywood Singing",
            progress: "18% complete",
            nextLesson: "Breath Control Basics",
          },
        ].map((course) => (
          <div key={course.title} className="card p-6">
            <p className="text-lg font-semibold text-ink">{course.title}</p>
            <p className="mt-2 text-sm text-ink-muted">{course.progress}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-ink-muted">
              Next lesson
            </p>
            <p className="mt-2 text-sm text-ink">{course.nextLesson}</p>
            <Link href="/dashboard/lessons" className="btn-secondary mt-4">
              View Lessons
            </Link>
          </div>
        ))}
      </div>

      <div className="card-strong p-6">
        <p className="text-sm font-semibold text-brand-gold">
          Universal Curriculum
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          Explore instrument learning paths
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          12-week pathways with 48 lessons for every instrument.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {curriculumCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}/curriculum`}
              className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4 text-sm text-ink transition hover:border-brand-gold"
            >
              <p className="text-sm font-semibold text-ink">{course.name}</p>
              <p className="mt-2 text-xs text-ink-muted">{course.level}</p>
              <p className="mt-2 text-xs text-ink-muted">
                {course.modules.length} modules · {course.modules.length * 4} lessons
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
