import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  curriculumCourses,
  getCourseBySlug,
} from "@/data/universal-curriculum";

type LessonPlayerPageProps = {
  params: { instrument: string; lessonId: string };
};

const instrumentImages: Record<string, string> = {
  singing: "/academy/instruments/singing.svg",
  piano: "/academy/instruments/piano.svg",
  guitar: "/academy/instruments/guitar.svg",
  drums: "/academy/instruments/drums.svg",
  violin: "/academy/instruments/violin.svg",
  flute: "/academy/instruments/flute.svg",
  harmonium: "/academy/instruments/harmonium.svg",
  tabla: "/academy/instruments/tabla.svg",
  trumpet: "/academy/instruments/trumpet.svg",
};

const downloads = [
  {
    id: "worksheet",
    title: "Practice Worksheet",
    description: "Warmup checklist and practice tracker.",
    href: "/resources/practice-worksheet.pdf",
  },
  {
    id: "sheet-music",
    title: "Sheet Music",
    description: "Lesson notation and reference patterns.",
    href: "/resources/sheet-music.pdf",
  },
  {
    id: "backing-track",
    title: "Backing Track",
    description: "Accompaniment track for practice.",
    href: "/resources/backing-track.mp3",
  },
];

export const generateStaticParams = async () =>
  curriculumCourses.flatMap((course) =>
    course.modules.flatMap((moduleItem) =>
      moduleItem.lessons.map((lesson) => ({
        instrument: course.slug,
        lessonId: lesson.slug,
      }))
    )
  );

export const generateMetadata = ({
  params,
}: LessonPlayerPageProps): Metadata => {
  const course = getCourseBySlug(params.instrument);
  if (!course) {
    return {
      title: "Lesson Player",
      description: "Stream lessons and track your progress.",
    };
  }

  return {
    title: `${course.name} Lesson Player`,
    description: `Watch ${course.name} lessons with notes, exercises, and downloads.`,
  };
};

const resolveLesson = (courseSlug: string, lessonId: string) => {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  const flattened = course.modules.flatMap((moduleItem) =>
    moduleItem.lessons.map((lesson) => ({
      lesson,
      moduleItem,
    }))
  );

  const directMatch = flattened.find(
    (entry) =>
      entry.lesson.slug === lessonId ||
      entry.lesson.id.toLowerCase() === lessonId.toLowerCase()
  );

  if (directMatch) {
    return {
      course,
      ...directMatch,
      lessonIndex: flattened.indexOf(directMatch) + 1,
      totalLessons: flattened.length,
    };
  }

  if (/^\d+$/.test(lessonId)) {
    const index = Number(lessonId) - 1;
    const entry = flattened[index];
    if (entry) {
      return {
        course,
        ...entry,
        lessonIndex: index + 1,
        totalLessons: flattened.length,
      };
    }
  }

  return null;
};

const LessonPlayer = dynamic(() => import("@/components/LessonPlayer"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="card-strong p-6 text-sm text-ink-muted">
        Loading lesson player...
      </div>
    </div>
  ),
});

export default function LessonPlayerPage({ params }: LessonPlayerPageProps) {
  const resolved = resolveLesson(params.instrument, params.lessonId);
  if (!resolved) {
    return notFound();
  }

  const { course, lesson, moduleItem, lessonIndex, totalLessons } = resolved;
  const modules = course.modules.map((moduleGroup) => ({
    id: moduleGroup.id,
    title: moduleGroup.title,
    order: moduleGroup.order,
    lessons: moduleGroup.lessons.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      moduleTitle: moduleGroup.title,
      moduleOrder: moduleGroup.order,
    })),
  }));

  return (
    <LessonPlayer
      instrument={course.slug}
      courseName={course.name}
      moduleTitle={moduleItem.title}
      lessonId={lesson.id}
      lessonSlug={lesson.slug}
      lessonTitle={lesson.title}
      lessonVideoUrl={lesson.videoUrl}
      lessonNotes={lesson.notes}
      lessonTheory={lesson.theory}
      practiceExercises={lesson.practiceExercises}
      assignment={lesson.assignment}
      modules={modules}
      lessonIndex={lessonIndex}
      totalLessons={totalLessons}
      downloads={downloads}
      coverImage={
        instrumentImages[course.slug] ?? "/vasu/vasu-hero-stage.svg"
      }
    />
  );
}
