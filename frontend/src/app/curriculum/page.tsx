import Link from "next/link";
import { curriculumModules, curriculumSummary } from "@/data/curriculum";

export default function CurriculumPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Curriculum</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            12-week piano mastery curriculum
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            {curriculumSummary.lessons} lessons across {curriculumSummary.modules}
            modules, designed for beginner to advanced pianists.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-6">
          {curriculumModules.map((module, index) => (
            <div key={module.id} className="card-strong p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                    Week {index + 1}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">
                    {module.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-muted">
                    {module.description}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-ink-muted">
                  4 lessons
                </span>
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
          ))}
        </div>
      </section>
    </div>
  );
}
