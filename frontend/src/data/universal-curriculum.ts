import {
  getClassImagesForCourse,
  getCourseArt,
  getModuleImage,
} from "@/data/media";

export type CurriculumLesson = {
  id: string;
  slug: string;
  title: string;
  duration: string;
  videoUrl: string;
  notes: string;
  theory: string;
  practiceExercises: string[];
  assignment: string;
};

export type CurriculumModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: string;
  lessonCount: number;
  image: string;
  lessons: CurriculumLesson[];
};

export type CurriculumCourse = {
  id: string;
  slug: string;
  name: string;
  description: string;
  level: string;
  image: string;
  classImages: string[];
  modules: CurriculumModule[];
};

const lessonVideo = "/videos/lesson-sample.mp4";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const buildPracticeExercises = (instrument: string, focus: string) => [
  `Warmup drill for ${instrument.toLowerCase()} focus`,
  `${focus} technique repetitions`,
  "Performance-ready repetition with metronome",
];

const buildLesson = (
  instrument: string,
  moduleTitle: string,
  week: number,
  lessonIndex: number,
  title: string
): CurriculumLesson => {
  const slug = `${instrument.toLowerCase().replace(/\s+/g, "-")}-week-${week}-lesson-${lessonIndex}-${slugify(title)}`;
  return {
    id: `W${week}-L${lessonIndex}`,
    slug,
    title,
    duration: "45 min",
    videoUrl: lessonVideo,
    notes: `Focus on ${title.toLowerCase()} and apply it to a short practice clip.`,
    theory: `${moduleTitle} theory for ${instrument} with clear step-by-step explanations.`,
    practiceExercises: buildPracticeExercises(instrument, moduleTitle),
    assignment: `Record a 60-second ${instrument.toLowerCase()} exercise covering ${title.toLowerCase()}.`,
  };
};

const buildModule = (
  instrument: string,
  moduleTitle: string,
  description: string,
  week: number,
  lessonTitles?: string[]
): CurriculumModule => {
  const titles =
    lessonTitles ??
    [
      `${moduleTitle} fundamentals`,
      `${moduleTitle} technique`,
      `${moduleTitle} practice routine`,
      `${moduleTitle} performance task`,
    ];

  const lessons = titles.map((title, index) =>
    buildLesson(instrument, moduleTitle, week, index + 1, title)
  );

  return {
    id: `module-${week}-${instrument.toLowerCase().replace(/\s+/g, "-")}`,
    title: moduleTitle,
    description,
    order: week,
    duration: "45 min",
    lessonCount: lessons.length,
    image: getModuleImage(moduleTitle),
    lessons,
  };
};

const singingModules = [
  {
    title: "Voice Foundations",
    description: "Build posture, breath, and first vocal patterns.",
    lessons: [
      "Posture and breathing",
      "Voice warmups",
      "Sa Re Ga practice",
      "First vocal melody",
    ],
  },
  {
    title: "Pitch Control",
    description: "Stabilize pitch and train the ear.",
    lessons: [
      "Pitch training",
      "Ear training",
      "Basic alankar practice",
      "Simple song",
    ],
  },
  {
    title: "Voice Strength",
    description: "Increase breath control and vocal range.",
    lessons: [
      "Breath control",
      "Scale exercises",
      "Range development",
      "Song practice",
    ],
  },
  {
    title: "Rhythm in Singing",
    description: "Align vocals with taal and rhythm exercises.",
    lessons: [
      "Taal introduction",
      "Metronome singing",
      "Rhythm exercises",
      "Rhythm-based song",
    ],
  },
  {
    title: "Classical Techniques",
    description: "Introduce raag work and classical articulation.",
    lessons: [
      "Alankar patterns",
      "Raag introduction",
      "Voice control",
      "Raag practice",
    ],
  },
  {
    title: "Expression",
    description: "Develop dynamics and emotional delivery.",
    lessons: [
      "Dynamics",
      "Emotion in singing",
      "Bollywood expression",
      "Song performance",
    ],
  },
  {
    title: "Harmony",
    description: "Understand chords and blend with other voices.",
    lessons: [
      "Chord understanding",
      "Harmony practice",
      "Duet singing",
      "Song with chords",
    ],
  },
  {
    title: "Intermediate Vocal Skills",
    description: "Advance scales, improvisation, and stage singing.",
    lessons: [
      "Advanced scales",
      "Improvisation basics",
      "Song practice",
      "Stage singing",
    ],
  },
  {
    title: "Bollywood Singing",
    description: "Develop playback delivery and mic technique.",
    lessons: [
      "Playback techniques",
      "Microphone use",
      "Bollywood song",
      "Expression practice",
    ],
  },
  {
    title: "Improvisation",
    description: "Expand alaap and raag improvisation skills.",
    lessons: [
      "Alaap practice",
      "Melody improvisation",
      "Raag improvisation",
      "Free singing",
    ],
  },
  {
    title: "Performance Skills",
    description: "Build stage confidence and recording routines.",
    lessons: [
      "Stage confidence",
      "Audience engagement",
      "Song performance",
      "Recording practice",
    ],
  },
  {
    title: "Final Performance",
    description: "Prepare and deliver a final showcase.",
    lessons: [
      "Song preparation",
      "Recording",
      "Final performance",
      "Feedback",
    ],
  },
];

const instrumentModuleMap: Record<string, string[]> = {
  Piano: [
    "Foundations",
    "Technique",
    "Scales",
    "Rhythm",
    "Harmony",
    "Expression",
    "Sight Reading",
    "Chord Progressions",
    "Accompaniment",
    "Improvisation",
    "Performance",
    "Final Performance",
  ],
  Guitar: [
    "Guitar Basics",
    "Chords",
    "Strumming",
    "Rhythm",
    "Scales",
    "Fingerstyle",
    "Chord Progressions",
    "Lead Guitar",
    "Bollywood Songs",
    "Improvisation",
    "Performance",
    "Final Performance",
  ],
  Drums: [
    "Drum Setup",
    "Basic Beats",
    "Rhythm Counting",
    "Groove Practice",
    "Drum Rudiments",
    "Coordination",
    "Fill Techniques",
    "Intermediate Grooves",
    "Style Playing",
    "Improvisation",
    "Performance",
    "Final Recording",
  ],
  Violin: [
    "Instrument Basics",
    "Bow Control",
    "Scale Training",
    "Finger Position",
    "Rhythm Practice",
    "Expression",
    "Harmony",
    "Intermediate Playing",
    "Style Playing",
    "Improvisation",
    "Performance",
    "Mastery",
  ],
  Flute: [
    "Breathing Control",
    "Fingering Basics",
    "Scale Training",
    "Tone Development",
    "Rhythm Practice",
    "Musical Expression",
    "Harmony",
    "Intermediate Playing",
    "Song Performance",
    "Improvisation",
    "Stage Playing",
    "Mastery",
  ],
  Trumpet: [
    "Breathing & Embouchure",
    "Tone Production",
    "Scale Training",
    "Rhythm Control",
    "Note Range",
    "Articulation",
    "Harmony",
    "Intermediate Techniques",
    "Style Playing",
    "Improvisation",
    "Performance",
    "Mastery",
  ],
  Harmonium: [
    "Harmonium Basics",
    "Sargam & Swaras",
    "Scale Training",
    "Rhythm Support",
    "Chord Practice",
    "Accompaniment",
    "Raag Practice",
    "Song Performance",
    "Harmonium Techniques",
    "Improvisation",
    "Stage Performance",
    "Final Performance",
  ],
  Tabla: [
    "Tabla Basics",
    "Teentaal",
    "Keharwa",
    "Bol Patterns",
    "Layakari",
    "Kayda Practice",
    "Tihai Drills",
    "Accompaniment",
    "Solo Development",
    "Improvisation",
    "Performance",
    "Final Performance",
  ],
};

const buildGenericCourse = (
  name: string,
  slug: string,
  description: string,
  level: string,
  modules: string[]
): CurriculumCourse => {
  const moduleData = modules.map((title, index) =>
    buildModule(
      name,
      title,
      `Develop ${title.toLowerCase()} skills for ${name.toLowerCase()} performance.`,
      index + 1
    )
  );

  return {
    id: `course-${slug}`,
    slug,
    name,
    description,
    level,
    image: getCourseArt(slug, name),
    classImages: getClassImagesForCourse(slug),
    modules: moduleData,
  };
};

const singingCourse: CurriculumCourse = {
  id: "course-singing",
  slug: "singing",
  name: "Singing",
  description:
    "12-week vocal training pathway covering pitch, rhythm, expression, and performance.",
  level: "Beginner to Advanced",
  image: getCourseArt("singing", "Singing"),
  classImages: getClassImagesForCourse("singing"),
  modules: singingModules.map((module, index) =>
    buildModule("Singing", module.title, module.description, index + 1, module.lessons)
  ),
};

export const curriculumCourses: CurriculumCourse[] = [
  singingCourse,
  buildGenericCourse(
    "Piano",
    "piano",
    "Master piano technique, harmony, and performance across 12 weeks.",
    "Beginner to Advanced",
    instrumentModuleMap.Piano
  ),
  buildGenericCourse(
    "Guitar",
    "guitar",
    "Learn chords, strumming, and lead guitar with structured weekly goals.",
    "Beginner to Advanced",
    instrumentModuleMap.Guitar
  ),
  buildGenericCourse(
    "Drums",
    "drums",
    "Build rhythmic control, grooves, and performance readiness.",
    "Beginner to Advanced",
    instrumentModuleMap.Drums
  ),
  buildGenericCourse(
    "Violin",
    "violin",
    "Develop bow control, intonation, and expressive performance skills.",
    "Beginner to Advanced",
    instrumentModuleMap.Violin
  ),
  buildGenericCourse(
    "Flute",
    "flute",
    "Strengthen breath control, tone, and melodic phrasing.",
    "Beginner to Advanced",
    instrumentModuleMap.Flute
  ),
  buildGenericCourse(
    "Trumpet",
    "trumpet",
    "Build embouchure strength, range, and stage performance.",
    "Beginner to Advanced",
    instrumentModuleMap.Trumpet
  ),
  buildGenericCourse(
    "Harmonium",
    "harmonium",
    "Learn accompaniment, raag practice, and harmonium technique.",
    "Beginner to Intermediate",
    instrumentModuleMap.Harmonium
  ),
  buildGenericCourse(
    "Tabla",
    "tabla",
    "Master taal cycles, bols, and performance-ready theka.",
    "Beginner to Intermediate",
    instrumentModuleMap.Tabla
  ),
];

export const completeMusicProgram = {
  title: "Complete Musician Program",
  description:
    "A 3-year pathway to become a versatile professional musician.",
  years: [
    {
      title: "Year 1 - Foundations",
      focus: [
        "Singing",
        "Piano",
        "Guitar",
        "Violin",
        "Drums",
        "Flute",
        "Music Theory",
        "Performance",
      ],
    },
    {
      title: "Year 2 - Intermediate Musician",
      focus: [
        "Advanced technique",
        "Harmony & arrangement",
        "Stage performance",
        "Recording basics",
      ],
    },
    {
      title: "Year 3 - Advanced Performer",
      focus: [
        "Performance mastery",
        "Professional recordings",
        "Live showcases",
        "Certification projects",
      ],
    },
  ],
};

export const getCourseBySlug = (slug: string) =>
  curriculumCourses.find((course) => course.slug === slug);

export const instrumentSlugs = curriculumCourses.map((course) => course.slug);

export const curriculumLessons = curriculumCourses.flatMap((course) =>
  course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      course,
      module,
      lesson,
    }))
  )
);

export const getLessonBySlug = (slug: string) =>
  curriculumLessons.find((item) => item.lesson.slug === slug);
