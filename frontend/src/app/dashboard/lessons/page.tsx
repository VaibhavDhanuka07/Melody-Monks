import Link from "next/link";
import { curriculumModules } from "@/data/curriculum";

export default function DashboardLessonsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Lessons</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          Your weekly lesson plan
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Follow the 12-week progression and complete each lesson in order.
        </p>
      </div>

      <div className="grid gap-6">
        {curriculumModules.map((module, index) => (
          <div key={module.id} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                  Week {index + 1}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-ink">
                  {module.title}
                </h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-muted">
                4 lessons
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {module.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.slug}`}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink transition hover:border-brand-gold"
                >
                  <p className="text-xs text-ink-muted">{lesson.id}</p>
                  <p className="mt-2 font-semibold text-ink">
                    {lesson.title}
                  </p>
                  <p className="mt-2 text-xs text-ink-muted">{lesson.duration}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
