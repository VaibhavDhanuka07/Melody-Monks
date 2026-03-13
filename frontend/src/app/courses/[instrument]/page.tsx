import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { curriculumCourses, getCourseBySlug } from "@/data/universal-curriculum";
import { site } from "@/data/site";

type InstrumentPageProps = {
  params: { instrument: string };
};

export const generateStaticParams = async () =>
  curriculumCourses.map((course) => ({ instrument: course.slug }));

export const generateMetadata = ({ params }: InstrumentPageProps): Metadata => {
  const course = getCourseBySlug(params.instrument);
  if (!course) {
    return {
      title: "Course",
      description: "Explore the 12-week music curriculum.",
    };
  }

  return {
    title: `${course.name} Course`,
    description: course.description,
  };
};

const courseFeatures = [
  "HD video lessons",
  "Practice worksheets",
  "Backing tracks",
  "Assignments",
  "Performance upload",
  "Certification",
];

export default function CourseInstrumentPage({ params }: InstrumentPageProps) {
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
              {course.name} Course
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">
              {course.name} Curriculum (12 Weeks | 48 Lessons)
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
                45 min per lesson
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                Live on {site.liveClassPlatforms}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/courses/${course.slug}/curriculum`}
                className="btn-primary"
              >
                View Full Curriculum
              </Link>
              <Link href="/book-trial" className="btn-secondary">
                Book Free Trial
              </Link>
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
                    alt={`${course.name} class scene`}
                    fill
                    sizes="(max-width: 768px) 33vw, 15vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-3 text-sm text-ink-muted">
              {courseFeatures.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Modules</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Structured weekly progression
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Each module includes 4 lessons, practice exercises, and assignments.
            </p>
          </div>
          <Link
            href={`/courses/${course.slug}/curriculum`}
            className="btn-secondary px-4 py-2 text-xs"
          >
            Explore Curriculum
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {course.modules.slice(0, 6).map((module) => (
            <div key={module.id} className="card-strong overflow-hidden">
              <div className="relative h-44 border-b border-white/10">
                <Image
                  src={module.image}
                  alt={module.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                    Week {module.order}
                  </p>
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-ink-muted">
                    {module.lessonCount} lessons | {module.duration}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">
                  Module Focus
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {module.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                  {module.lessons.slice(0, 2).map((lesson) => (
                    <li key={lesson.id}>- {lesson.title}</li>
                  ))}
                  <li className="text-xs text-ink-muted">
                    +{module.lessonCount - 2} more lessons
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="card-strong p-10 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
            Ready to start?
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-ink">
            Start your {course.name.toLowerCase()} journey today
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            Live classes on {site.liveClassPlatforms}, recorded lessons, and
            performance feedback in one plan.
          </p>
          <Link href="/book-trial" className="btn-primary mt-6">
            Book Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
