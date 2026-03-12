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
    title: "Foundations",
    description: "Posture, hand shape, and the first patterns.",
    lessons: [
      "Posture and bench setup",
      "Finger numbers and hand shape",
      "Five-finger patterns",
      "Dynamics and tone control",
    ],
  },
  {
    title: "Reading Music",
    description: "Build fluency with notes, rests, and intervals.",
    lessons: [
      "The grand staff and clefs",
      "Note values and rests",
      "Simple melodies and counting",
      "Intervals and ledger lines",
    ],
  },
  {
    title: "Hand Coordination",
    description: "Bring both hands together with confidence.",
    lessons: [
      "Hands together basics",
      "Coordination drills",
      "Left-hand accompaniment",
      "Pedal introduction",
    ],
  },
  {
    title: "Rhythm Mastery",
    description: "Lock in timing with metronome-driven practice.",
    lessons: [
      "Counting with the metronome",
      "Syncopation essentials",
      "Rhythmic patterns",
      "Groove in repertoire",
    ],
  },
  {
    title: "Scales & Strength",
    description: "Develop finger strength and agility.",
    lessons: [
      "Major scales: C, G, F",
      "Minor scales: A, E, D",
      "Hanon warmups",
      "Arpeggio foundations",
    ],
  },
  {
    title: "Musical Expression",
    description: "Shape phrases with dynamics and articulation.",
    lessons: [
      "Phrasing and breathing",
      "Legato vs staccato",
      "Dynamic balance",
      "Rubato and musicality",
    ],
  },
  {
    title: "Harmony",
    description: "Understand chords and progressions.",
    lessons: [
      "Triads and inversions",
      "Chord progressions",
      "Left-hand patterns",
      "Harmonizing melodies",
    ],
  },
  {
    title: "Technique",
    description: "Advance accuracy, speed, and control.",
    lessons: [
      "Finger independence",
      "Octaves and chord voicing",
      "Speed and accuracy drills",
      "Pedal technique",
    ],
  },
  {
    title: "Musical Styles",
    description: "Play across classical, pop, and jazz textures.",
    lessons: [
      "Classical excerpts",
      "Pop accompaniment",
      "Jazz voicings",
      "Film music textures",
    ],
  },
  {
    title: "Improvisation",
    description: "Create your own sound with improvisation.",
    lessons: [
      "Pentatonic improvisation",
      "Blues scale",
      "Improvising with chords",
      "Motif creation",
    ],
  },
  {
    title: "Advanced Piano",
    description: "Tackle complex rhythms and repertoire.",
    lessons: [
      "Complex rhythmic patterns",
      "Extended arpeggios",
      "Advanced pedaling",
      "Repertoire development",
    ],
  },
  {
    title: "Performance Mastery",
    description: "Prepare for confident stage-ready performances.",
    lessons: [
      "Stage presence",
      "Memorization strategies",
      "Performance practice",
      "Final recital preparation",
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
          "Key concepts, fingerings, and practice drills for this lesson.",
        sheetMusic,
        assignment:
          "Practice the warmup and record a 60-second clip for feedback.",
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
