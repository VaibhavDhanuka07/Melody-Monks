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
        },
      });

  const lessonCount = await prisma.lesson.count({
    where: { courseId: course.id },
  });

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
        sheetMusic: "/sheet-music/sample.pdf",
        assignment: "Practice the drills and submit a 60-second clip.",
        order: order++,
        courseId: course.id,
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
        instrument: "Piano",
        mode: "Online",
        preferredTime: "Evenings",
        status: "new",
      },
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
