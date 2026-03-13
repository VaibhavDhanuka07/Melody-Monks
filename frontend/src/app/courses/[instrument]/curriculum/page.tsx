import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  curriculumCourses,
  getCourseBySlug,
} from "@/data/universal-curriculum";

type InstrumentCurriculumPageProps = {
  params: { instrument: string };
};

export const generateStaticParams = async () =>
  curriculumCourses.map((course) => ({ instrument: course.slug }));

export const generateMetadata = ({
  params,
}: InstrumentCurriculumPageProps): Metadata => {
  const course = getCourseBySlug(params.instrument);
  if (!course) {
    return {
      title: "Curriculum",
      description: "Explore the 12-week curriculum.",
    };
  }

  return {
    title: `${course.name} Curriculum`,
    description: `${course.name} curriculum with 12 modules and 48 lessons.`,
  };
};

export default function InstrumentCurriculumPage({
  params,
}: InstrumentCurriculumPageProps) {
  const course = getCourseBySlug(params.instrument);

  if (!course) {
    return notFound();
  }

  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong grid gap-8 p-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold text-brand-gold">
              {course.name} Curriculum
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">
              12-week learning path with 48 lessons
            </h1>
            <p className="mt-4 text-sm text-ink-muted">{course.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-ink-muted">
              <span className="rounded-full border border-white/10 px-3 py-1">
                {course.level}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                4 lessons/week
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                Practice + Assignments
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative h-60 overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={course.image}
                alt={course.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {course.classImages.map((src) => (
                <div
                  key={src}
                  className="relative h-28 overflow-hidden rounded-2xl border border-white/10"
                >
                  <Image
                    src={src}
                    alt={`${course.name} curriculum scene`}
                    fill
                    sizes="(max-width: 768px) 33vw, 15vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="grid gap-3 text-sm text-ink-muted">
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                HD video lessons with notes
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                Weekly assignments and feedback
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                Performance upload and certification
              </div>
              <Link href="/book-trial" className="btn-primary mt-2">
                Book Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="space-y-6">
          {course.modules.map((module) => (
            <div key={module.id} className="card-strong overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
                <div className="relative min-h-[240px] border-b border-white/10 lg:border-b-0 lg:border-r">
                  <Image
                    src={module.image}
                    alt={module.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
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
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {module.lessonCount} lessons
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {module.duration}
                      </span>
                      <Link
                        href="/dashboard/lessons"
                        className="btn-secondary px-3 py-2 text-xs"
                      >
                        Start Module
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4"
                      >
                        <div className="flex items-center justify-between text-xs text-ink-muted">
                          <span>{lesson.id}</span>
                          <span>{lesson.duration}</span>
                        </div>
                        <p className="mt-2 text-sm font-semibold text-ink">
                          {lesson.title}
                        </p>
                        <p className="mt-2 text-xs text-ink-muted">
                          {lesson.theory}
                        </p>
                        <div className="mt-3 text-xs text-ink-muted">
                          <p className="uppercase tracking-[0.2em]">Practice</p>
                          <ul className="mt-2 space-y-1">
                            {lesson.practiceExercises.map((exercise) => (
                              <li key={exercise}>- {exercise}</li>
                            ))}
                          </ul>
                        </div>
                        <p className="mt-3 text-xs text-ink-muted">
                          Assignment: {lesson.assignment}
                        </p>
                        <Link
                          href={`/courses/${course.slug}/lesson/${lesson.slug}`}
                          className="btn-primary mt-4 w-full text-xs"
                        >
                          Watch Lesson
                        </Link>
                        <Link
                          href="/dashboard/assignments"
                          className="btn-secondary mt-3 w-full text-xs"
                        >
                          Submit Assignment
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
