import { getCatalogCourseImage } from "@/data/media";

export { getCatalogCourseImage };

export type CoursePath = {
  title: string;
  description: string;
  topics: string[];
  image: string;
  modules: number;
  lessons: number;
  format: string;
  level?: string;
  duration?: string;
  slug?: string;
};

export type PerformanceVideo = {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  poster: string;
  category: "Instructor" | "Student" | "Practice";
};

export type Testimonial = {
  name: string;
  title: string;
  rating: string;
  quote: string;
  image: string;
};

export type PricingPlan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export type InstructorStat = {
  label: string;
  value: string;
};

const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";
const whatsappMessage =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
  "Hi, I want to book a free Indian music trial class.";

export const site = {
  name: "Melody Monks Indian Music Academy",
  programName: "Indian Music Mastery Program",
  instagramUrl: "https://www.instagram.com/musicianvasu",
  liveClassPlatforms: "Google Meet or Zoom",
  liveClassDelivery: "Live classes on Google Meet or Zoom, plus recordings",
  instructor: {
    name: "Debojeet Lahiri",
    fullName: "Debojeet Lahiri",
    role: "Indian music educator, performer, composer",
    bio: "Debojeet Lahiri (Musician Vasu) is a veteran music educator known for transforming beginners into confident performers. He brings 37 years of teaching experience, a deep Hindustani classical foundation, and real-world performance coaching tailored to Indian music.",
    experience: "37 years teaching experience",
    achievements: [
      "Trained 2000+ students across classical, Bollywood, and light music",
      "300-350 students earning through music and performances",
      "Mentors underprivileged students with free training",
      "Collaborated with leading Bollywood artists",
      "Invited to 15-20 reality shows as chief guest and judge",
    ],
    stats: [
      { label: "Age", value: "52 years" },
      { label: "Teaching", value: "37 years" },
      { label: "Students Trained", value: "2000+" },
      { label: "Earning Through Music", value: "300-350" },
    ] as InstructorStat[],
  },
  whatsappNumber,
  whatsappMessage,
  whatsappLink: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`,
  whatsappLabel: whatsappNumber === "91XXXXXXXXXX" ? "91XXXXXXXXXX" : whatsappNumber,
};

export const coursePaths: CoursePath[] = [
  {
    title: "Hindustani Classical Vocal",
    description: "Riyaz-first training rooted in raag, taal, and sur accuracy.",
    topics: ["Sargam & swaras", "Raag foundations", "Taal practice"],
    modules: 6,
    lessons: 24,
    format: "Google Meet / Zoom Live",
    level: "Beginner to Advanced",
    duration: "12 weeks",
    slug: "singing",
    image:
      "/academy/course-posters/photography/hindustani-classical-vocal.png",
  },
  {
    title: "Bollywood Singing",
    description: "Song interpretation, mic technique, and stage presence.",
    topics: ["Breath control", "Phrase shaping", "Performance delivery"],
    modules: 5,
    lessons: 20,
    format: "Google Meet / Zoom + Studio",
    level: "Beginner to Advanced",
    duration: "10 weeks",
    slug: "singing",
    image: "/academy/course-posters/photography/bollywood-singing.png",
  },
  {
    title: "Light Classical Music",
    description: "Thumri, bhajan, and semi-classical expression coaching.",
    topics: ["Ornamentation", "Emotive phrasing", "Classical light styles"],
    modules: 5,
    lessons: 18,
    format: "Google Meet / Zoom Live",
    level: "Intermediate",
    duration: "8 weeks",
    image: "/academy/course-posters/photography/light-classical-music.png",
  },
  {
    title: "Playback Singing",
    description: "Studio discipline and playback-ready vocal delivery.",
    topics: ["Recording workflow", "Pitch accuracy", "Professional takes"],
    modules: 4,
    lessons: 16,
    format: "Studio coaching + Recorded",
    level: "Intermediate",
    duration: "8 weeks",
    image: "/academy/course-posters/photography/playback-singing.png",
  },
  {
    title: "Piano / Keyboard",
    description: "Keyboard skills for Bollywood accompaniment and scoring.",
    topics: ["Chords & harmony", "Rhythm patterns", "Performance setup"],
    modules: 5,
    lessons: 20,
    format: "Google Meet / Zoom Live",
    level: "Beginner to Advanced",
    duration: "10 weeks",
    slug: "piano",
    image: "/academy/instruments/photography/piano.png",
  },
  {
    title: "Guitar",
    description: "Acoustic and electric foundations for stage and studio.",
    topics: ["Chords & strumming", "Lead basics", "Song arrangement"],
    modules: 5,
    lessons: 20,
    format: "Google Meet / Zoom Live",
    level: "Beginner to Advanced",
    duration: "10 weeks",
    slug: "guitar",
    image: "/academy/instruments/photography/guitar.png",
  },
  {
    title: "Harmonium",
    description: "Harmonium playing for accompaniment and solo pieces.",
    topics: ["Sargam on harmonium", "Taal support", "Song accompaniment"],
    modules: 4,
    lessons: 16,
    format: "Google Meet / Zoom Live",
    level: "Beginner to Intermediate",
    duration: "8 weeks",
    slug: "harmonium",
    image: "/academy/instruments/photography/harmonium.png",
  },
  {
    title: "Tabla",
    description: "Taal vocabulary, bols, and accompaniment practice.",
    topics: ["Teentaal basics", "Bols & kayda", "Layakari drills"],
    modules: 5,
    lessons: 20,
    format: "Google Meet / Zoom Live",
    level: "Beginner to Intermediate",
    duration: "10 weeks",
    slug: "tabla",
    image: "/academy/instruments/photography/tabla.png",
  },
  {
    title: "Music Theory",
    description: "Notation, harmony, composition basics, and ear training.",
    topics: ["Notation", "Harmony basics", "Ear training"],
    modules: 4,
    lessons: 16,
    format: "Recorded + Assignments",
    level: "Beginner",
    duration: "6 weeks",
    image: "/academy/course-posters/photography/music-theory.png",
  },
  {
    title: "Music Composition",
    description: "Melody writing, arrangements, and production concepts.",
    topics: ["Melody writing", "Arrangements", "Song structure"],
    modules: 4,
    lessons: 16,
    format: "Recorded + Projects",
    level: "Intermediate",
    duration: "8 weeks",
    image: "/academy/course-posters/photography/music-composition.png",
  },
  {
    title: "Stage Performance",
    description: "Confidence, mic control, and audience engagement.",
    topics: ["Stage presence", "Mic technique", "Performance practice"],
    modules: 3,
    lessons: 12,
    format: "Google Meet / Zoom Coaching",
    level: "All levels",
    duration: "4 weeks",
    image: "/academy/course-posters/photography/stage-performance.png",
  },
  {
    title: "Recording Techniques",
    description: "Home studio setup, tracking, and vocal capture.",
    topics: ["Mic placement", "Session workflow", "Editing basics"],
    modules: 3,
    lessons: 12,
    format: "Studio + Recorded",
    level: "Intermediate",
    duration: "4 weeks",
    image: "/academy/course-posters/photography/recording-techniques.png",
  },
];

export const performanceVideos: PerformanceVideo[] = [
  {
    id: "perf-instructor",
    title: "Hindustani recital",
    subtitle: "Live stage highlight with classical vocals",
    src: "/videos/piano-instructor.mp4",
    poster: "/vasu/vasu-hero-stage.svg",
    category: "Instructor",
  },
  {
    id: "perf-student",
    title: "Student showcase",
    subtitle: "Bollywood medley performance",
    src: "/videos/piano-student.mp4",
    poster: "/vasu/vasu-student-recital.svg",
    category: "Student",
  },
  {
    id: "perf-practice",
    title: "Riyaz routine",
    subtitle: "Daily practice essentials",
    src: "/videos/piano-practice.mp4",
    poster: "/vasu/vasu-practice-room.svg",
    category: "Practice",
  },
  {
    id: "perf-session",
    title: "Live class session",
    subtitle: "Behind-the-scenes coaching",
    src: "/videos/piano-session.mp4",
    poster: "/vasu/vasu-live-class.svg",
    category: "Instructor",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Riya S.",
    title: "Hindustani Classical Student",
    rating: "5.0",
    quote:
      "Sur accuracy and taal practice changed everything. I can finally sing full raags confidently.",
    image: "/vasu/vasu-student-recital.svg",
  },
  {
    name: "Arjun K.",
    title: "Playback Singing Student",
    rating: "4.9",
    quote:
      "The recording feedback helped me polish my takes and perform in the studio with confidence.",
    image: "/vasu/vasu-hero-stage.svg",
  },
  {
    name: "Sneha M.",
    title: "Bollywood Singing Student",
    rating: "5.0",
    quote:
      "I learned breath control, phrasing, and stage presence. My live performances feel professional now.",
    image: "/vasu/vasu-studio-session.svg",
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Foundation Program",
    price: "INR 4,500",
    cadence: "one-time",
    description: "Core Indian music curriculum with guided assignments.",
    features: [
      "Module-based lessons",
      "Weekly practice tracker",
      "Instructor feedback",
      "Certificate eligibility",
    ],
  },
  {
    name: "All-Access Membership",
    price: "INR 2,500",
    cadence: "per month",
    description: "Live classes, recordings, and multi-genre access.",
    features: [
      "Live group sessions on Google Meet or Zoom",
      "Recorded class library",
      "Performance feedback",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Private Mentorship",
    price: "INR 9,000",
    cadence: "per month",
    description: "1:1 mentoring with Debojeet Lahiri.",
    features: [
      "Weekly private lessons on Google Meet or Zoom",
      "Custom practice plan",
      "Performance review",
      "Flexible scheduling",
    ],
  },
];

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
