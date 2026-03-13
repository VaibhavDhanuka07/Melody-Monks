export type Lesson = {
  id: string;
  slug: string;
  title: string;
  module: string;
  week: number;
  duration: string;
  videoUrl: string;
  notes: string;
  sheetMusic: string;
  assignment: string;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

const lessonVideo = "/videos/lesson-sample.mp4";
const sheetMusic = "/sheet-music/sample.pdf";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const moduleDefinitions = [
  {
    title: "Foundations of Indian Music",
    description: "Build a strong base in sur, posture, and riyaz habits.",
    lessons: [
      "Sur and swar basics",
      "Breath & posture for singing",
      "Riyaz routine setup",
      "Shruti awareness drills",
    ],
  },
  {
    title: "Sargam & Swara Placement",
    description: "Master sargam patterns and accurate swara placement.",
    lessons: [
      "Shuddha and vikrit swaras",
      "Sargam patterns for accuracy",
      "Meend and gamak introduction",
      "Pitch correction drills",
    ],
  },
  {
    title: "Taal & Layakari",
    description: "Strengthen rhythm with taal cycles and layakari.",
    lessons: [
      "Teentaal fundamentals",
      "Keharwa and dadra practice",
      "Clap, khali, and bole",
      "Layakari warmups",
    ],
  },
  {
    title: "Raag Yaman",
    description: "Learn raag structure, pakad, and bandish.",
    lessons: [
      "Aroh and avaroh",
      "Pakad recognition",
      "Bandish practice",
      "Alaap development",
    ],
  },
  {
    title: "Raag Bhairav",
    description: "Develop emotional expression with Bhairav.",
    lessons: [
      "Raag Bhairav grammar",
      "Bandish with taal",
      "Taan practice basics",
      "Expression and mood",
    ],
  },
  {
    title: "Light Classical Styles",
    description: "Explore thumri, bhajan, and semi-classical forms.",
    lessons: [
      "Thumri phrasing",
      "Bhajan interpretation",
      "Ornamentation techniques",
      "Expressive delivery",
    ],
  },
  {
    title: "Bollywood Interpretation",
    description: "Polish diction, phrasing, and performance presence.",
    lessons: [
      "Breath control for songs",
      "Phrasing and emotion",
      "Mic technique basics",
      "Stage-ready delivery",
    ],
  },
  {
    title: "Stage Performance",
    description: "Build confidence and stagecraft.",
    lessons: [
      "Performance mindset",
      "Audience engagement",
      "Handling stage nerves",
      "Live practice set",
    ],
  },
  {
    title: "Accompaniment Skills",
    description: "Support vocals with harmonium or keyboard basics.",
    lessons: [
      "Chord foundations",
      "Rhythm patterns",
      "Harmonium/keyboard drills",
      "Song accompaniment",
    ],
  },
  {
    title: "Recording & Mic Technique",
    description: "Prepare for studio and recording sessions.",
    lessons: [
      "Recording workflow",
      "Mic placement",
      "Multiple take discipline",
      "Session etiquette",
    ],
  },
  {
    title: "Improvisation & Creativity",
    description: "Develop improvisation through alaap and taans.",
    lessons: [
      "Alaap expansion",
      "Taan building blocks",
      "Creative phrasing",
      "Improvisation drills",
    ],
  },
  {
    title: "Performance Mastery",
    description: "Finalize repertoire and stage-ready polish.",
    lessons: [
      "Repertoire refinement",
      "Performance rehearsal",
      "Recital preparation",
      "Final showcase",
    ],
  },
];

export const curriculumModules: Module[] = moduleDefinitions.map(
  (moduleDef, moduleIndex) => {
    const week = moduleIndex + 1;
    const lessons = moduleDef.lessons.map((lessonTitle, lessonIndex) => {
      const id = `W${week}-L${lessonIndex + 1}`;
      return {
        id,
        slug: `${week}-${lessonIndex + 1}-${slugify(lessonTitle)}`,
        title: lessonTitle,
        module: moduleDef.title,
        week,
        duration: "25 min",
        videoUrl: lessonVideo,
        notes:
          "Key concepts, riyaz drills, and guidance notes for this lesson.",
        sheetMusic,
        assignment:
          "Complete the riyaz routine and upload a 60-second practice clip.",
      };
    });

    return {
      id: `module-${week}`,
      title: moduleDef.title,
      description: moduleDef.description,
      lessons,
    };
  }
);

export const curriculumLessons = curriculumModules.flatMap(
  (module) => module.lessons
);

export const curriculumSummary = {
  weeks: curriculumModules.length,
  lessons: curriculumLessons.length,
  modules: curriculumModules.length,
};

export const findLessonBySlug = (slug: string) =>
  curriculumLessons.find((lesson) => lesson.slug === slug);
