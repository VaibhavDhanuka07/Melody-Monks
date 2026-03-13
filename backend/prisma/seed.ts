import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const curriculum = [
  {
    title: "Foundations",
    description: "Posture, hand shape, and first patterns.",
    lessons: [
      "Posture and bench setup",
      "Finger numbers and hand shape",
      "Five-finger patterns",
      "Dynamics and tone control",
    ],
  },
  {
    title: "Reading Music",
    description: "Notes, rests, and intervals.",
    lessons: [
      "The grand staff and clefs",
      "Note values and rests",
      "Simple melodies and counting",
      "Intervals and ledger lines",
    ],
  },
  {
    title: "Hand Coordination",
    description: "Hands together with confidence.",
    lessons: [
      "Hands together basics",
      "Coordination drills",
      "Left-hand accompaniment",
      "Pedal introduction",
    ],
  },
  {
    title: "Rhythm Mastery",
    description: "Timing, groove, and metronome control.",
    lessons: [
      "Counting with the metronome",
      "Syncopation essentials",
      "Rhythmic patterns",
      "Groove in repertoire",
    ],
  },
  {
    title: "Scales & Strength",
    description: "Finger strength and agility.",
    lessons: [
      "Major scales: C, G, F",
      "Minor scales: A, E, D",
      "Hanon warmups",
      "Arpeggio foundations",
    ],
  },
  {
    title: "Musical Expression",
    description: "Dynamics, phrasing, and articulation.",
    lessons: [
      "Phrasing and breathing",
      "Legato vs staccato",
      "Dynamic balance",
      "Rubato and musicality",
    ],
  },
  {
    title: "Harmony",
    description: "Chords and progressions.",
    lessons: [
      "Triads and inversions",
      "Chord progressions",
      "Left-hand patterns",
      "Harmonizing melodies",
    ],
  },
  {
    title: "Technique",
    description: "Accuracy, speed, and control.",
    lessons: [
      "Finger independence",
      "Octaves and chord voicing",
      "Speed and accuracy drills",
      "Pedal technique",
    ],
  },
  {
    title: "Musical Styles",
    description: "Classical, pop, and jazz textures.",
    lessons: [
      "Classical excerpts",
      "Pop accompaniment",
      "Jazz voicings",
      "Film music textures",
    ],
  },
  {
    title: "Improvisation",
    description: "Create your own sound.",
    lessons: [
      "Pentatonic improvisation",
      "Blues scale",
      "Improvising with chords",
      "Motif creation",
    ],
  },
  {
    title: "Advanced Piano",
    description: "Complex rhythm and repertoire.",
    lessons: [
      "Complex rhythmic patterns",
      "Extended arpeggios",
      "Advanced pedaling",
      "Repertoire development",
    ],
  },
  {
    title: "Performance Mastery",
    description: "Stage-ready preparation.",
    lessons: [
      "Stage presence",
      "Memorization strategies",
      "Performance practice",
      "Final recital preparation",
    ],
  },
];

async function main() {
  const existingCourse = await prisma.course.findFirst({
    where: { title: "Piano Mastery Program" },
  });

  const course = existingCourse
    ? existingCourse
      : await prisma.course.create({
        data: {
          title: "Piano Mastery Program",
          description: "12-week curriculum with 48 lessons.",
          level: "Beginner to Advanced",
          price: 4500,
          instrument: "Piano",
        },
      });

  const lessonCount = await prisma.lesson.count({
    where: { courseId: course.id },
  });

  const moduleMap = new Map<string, string>();
  for (const [index, moduleDef] of curriculum.entries()) {
    const existingModule = await prisma.module.findFirst({
      where: { courseId: course.id, order: index + 1 },
    });
    const moduleRecord =
      existingModule ??
      (await prisma.module.create({
        data: {
          title: moduleDef.title,
          description: moduleDef.description,
          order: index + 1,
          lessonCount: moduleDef.lessons.length,
          duration: "25 min",
          courseId: course.id,
        },
      }));
    moduleMap.set(moduleDef.title, moduleRecord.id);
  }

  if (lessonCount === 0) {
    let order = 1;
    const lessonData = curriculum.flatMap((module, moduleIndex) =>
      module.lessons.map((title) => ({
        title,
        module: module.title,
        week: moduleIndex + 1,
        duration: "25 min",
        videoUrl: "/videos/lesson-sample.mp4",
        notes: "Key techniques and practice guidance.",
        theory: `Core theory for ${module.title}.`,
        sheetMusic: "/sheet-music/sample.pdf",
        assignment: "Practice the drills and submit a 60-second clip.",
        order: order++,
        courseId: course.id,
        moduleId: moduleMap.get(module.title),
      }))
    );

    await prisma.lesson.createMany({ data: lessonData });
  }

  const leadExists = await prisma.trialLead.findFirst({
    where: { phone: "9990001111" },
  });

  if (!leadExists) {
    await prisma.trialLead.create({
      data: {
        name: "Demo Student",
        phone: "9990001111",
        instrument: "Hindustani Classical Vocal",
        mode: "Online",
        preferredTime: "Evenings",
        status: "new",
      },
    });
  }

  const blogExists = await prisma.blogPost.findFirst();
  if (!blogExists) {
    await prisma.blogPost.createMany({
      data: [
        {
          title: "Daily Riyaz Habits for Sur Accuracy",
          slug: "daily-riyaz-habits-sur-accuracy",
          content: "Short daily sessions improve sur, breath, and confidence.",
          image: "/piano/piano-practice.svg",
          author: "Debojeet Lahiri",
          category: "Music Learning Tips",
        },
        {
          title: "Breath Control for Bollywood Singing",
          slug: "breath-control-bollywood-singing",
          content: "Learn diaphragmatic support and phrase mapping.",
          image: "/piano/piano-performance.svg",
          author: "Debojeet Lahiri",
          category: "Vocal Training",
        },
      ],
    });
  }

  const reviewExists = await prisma.review.findFirst();
  if (!reviewExists) {
    await prisma.review.createMany({
      data: [
        {
          studentName: "Riya Sharma",
          photo: "/piano/piano-students.svg",
          rating: 5,
          reviewText: "My sur accuracy improved dramatically.",
        },
        {
          studentName: "Aman Verma",
          photo: "/piano/piano-performance.svg",
          rating: 4.9,
          reviewText: "Breath control and coaching were a game-changer.",
        },
      ],
    });
  }

  const toolExists = await prisma.tool.findFirst();
  if (!toolExists) {
    await prisma.tool.createMany({
      data: [
        {
          instrument: "General",
          toolName: "Metronome",
          description: "Adjustable BPM with visual beats.",
          toolType: "Practice",
        },
        {
          instrument: "General",
          toolName: "Raag Reference Guide",
          description: "Aroh-avaroh and mood references.",
          toolType: "Theory",
        },
      ],
    });
  }

  const assignmentExists = await prisma.assignment.findFirst();
  if (!assignmentExists) {
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: "asc" },
      take: 6,
    });

    if (lessons.length > 0) {
      await prisma.assignment.createMany({
        data: lessons.map((lesson, index) => ({
          lessonId: lesson.id,
          title: `Assignment ${index + 1}`,
          instructions: `Submit a 60-second performance for ${lesson.title}.`,
          dueDays: 7,
        })),
      });
    }
  }

  const exerciseExists = await prisma.practiceExercise.findFirst();
  if (!exerciseExists) {
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: "asc" },
      take: 6,
    });

    if (lessons.length > 0) {
      await prisma.practiceExercise.createMany({
        data: lessons.flatMap((lesson) => [
          {
            lessonId: lesson.id,
            title: "Warmup drill",
            description: `Warmup exercise for ${lesson.title}.`,
            duration: "10 min",
          },
          {
            lessonId: lesson.id,
            title: "Technique drill",
            description: `Technique focus for ${lesson.title}.`,
            duration: "15 min",
          },
        ]),
      });
    }
  }

  const practiceSessionExists = await prisma.practiceSession.findFirst();
  if (!practiceSessionExists) {
    await prisma.practiceSession.createMany({
      data: [
        {
          practiceType: "Vocal",
          duration: 30,
          date: new Date("2026-02-20"),
        },
        {
          practiceType: "Tabla",
          duration: 25,
          date: new Date("2026-02-21"),
        },
      ],
    });
  }

  const practiceFeedbackExists = await prisma.practiceFeedback.findFirst();
  if (!practiceFeedbackExists) {
    await prisma.practiceFeedback.createMany({
      data: [
        {
          feedback: "Focus on maintaining sur stability in the mid-range.",
          score: 88,
        },
        {
          feedback: "Strong layakari. Increase tempo gradually.",
          score: 92,
        },
      ],
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
