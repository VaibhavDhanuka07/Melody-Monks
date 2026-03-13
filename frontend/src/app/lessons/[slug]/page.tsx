import Link from "next/link";
import { notFound } from "next/navigation";
import SheetMusicDownloadButton from "@/components/site/SheetMusicDownloadButton";
import { findLessonBySlug } from "@/data/curriculum";
import { getLessonBySlug } from "@/data/universal-curriculum";

export default function LessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const universal = getLessonBySlug(params.slug);
  const legacyLesson = findLessonBySlug(params.slug);

  if (!universal && !legacyLesson) {
    return notFound();
  }

  const lesson = universal?.lesson ?? legacyLesson!;
  const moduleInfo = universal?.module;
  const course = universal?.course;
  const theory =
    lesson && "theory" in lesson ? lesson.theory : null;
  const practiceExercises =
    lesson && "practiceExercises" in lesson
      ? lesson.practiceExercises
      : null;
  const moduleLabel =
    moduleInfo?.title ?? (lesson && "module" in lesson ? lesson.module : "Lesson");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-16">
      <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted">
        {course ? (
          <>
            <Link href={`/courses/${course.slug}`} className="hover:text-ink">
              {course.name}
            </Link>
            <span>/</span>
            <Link
              href={`/courses/${course.slug}/curriculum`}
              className="hover:text-ink"
            >
              Curriculum
            </Link>
          </>
        ) : (
          <Link href="/curriculum" className="hover:text-ink">
            Curriculum
          </Link>
        )}
        <span>/</span>
        <span className="text-ink">{lesson.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <div className="card-strong overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                  {lesson.id}
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-ink">
                  {lesson.title}
                </h1>
                <p className="mt-2 text-sm text-ink-muted">
                  Module: {moduleLabel} | {lesson.duration}
                </p>
              </div>
              <Link href="/book-trial" className="btn-secondary">
                Book Trial
              </Link>
            </div>
            <video
              controls
              playsInline
              preload="none"
              className="w-full bg-black"
              poster="/vasu/vasu-hero-stage.svg"
            >
              <source src={lesson.videoUrl} />
            </video>
          </div>

          <div className="card-strong p-6">
            <h2 className="text-xl font-semibold text-ink">Lesson Notes</h2>
            <p className="mt-3 text-sm text-ink-muted">{lesson.notes}</p>
            {theory ? (
              <>
                <h3 className="mt-5 text-sm font-semibold text-ink">
                  Theory
                </h3>
                <p className="mt-2 text-sm text-ink-muted">{theory}</p>
              </>
            ) : null}
          </div>

          <div className="card-strong p-6">
            <h2 className="text-xl font-semibold text-ink">Practice Exercises</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              {(practiceExercises && practiceExercises.length > 0
                ? practiceExercises
                : [
                    "Warmup: Sargam with tanpura support",
                    "Technique: Meend and gamak drills",
                    "Repertoire: Bandish phrases with taal",
                  ]
              ).map((exercise) => (
                <li key={exercise}>- {exercise}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card-strong p-6">
            <h3 className="text-lg font-semibold text-ink">Assignment</h3>
            <p className="mt-3 text-sm text-ink-muted">{lesson.assignment}</p>
            <Link href="/dashboard/assignments" className="btn-secondary mt-4">
              Submit Assignment
            </Link>
          </div>
          <div className="card-strong p-6">
            <h3 className="text-lg font-semibold text-ink">Resources</h3>
            <p className="mt-3 text-sm text-ink-muted">
              Download the notation sheet and keep your practice tracker updated.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <SheetMusicDownloadButton title={lesson.title} />
              <Link href="/dashboard/practice" className="btn-primary">
                Open Practice Tracker
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
