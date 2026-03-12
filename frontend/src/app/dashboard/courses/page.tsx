import Link from "next/link";
import { site } from "@/data/site";

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
            title: "Piano Mastery Program",
            progress: "42% complete",
            nextLesson: "Improvisation Basics",
          },
          {
            title: "Technique Lab",
            progress: "18% complete",
            nextLesson: "Hanon Warmups",
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
    </div>
  );
}
