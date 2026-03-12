export type CoursePath = {
  title: string;
  description: string;
  topics: string[];
  image: string;
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

const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";
const whatsappMessage =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
  "Hi, I want to book a free piano trial class.";

export const site = {
  name: "Melody Monks Piano Academy",
  programName: "Piano Mastery Program",
  instructor: {
    name: "Ariya Sen",
    fullName: "Ariya Sen",
    role: "Concert pianist, educator, curriculum designer",
    bio: "Ariya blends classical precision with modern coaching to guide students from first notes to confident performances.",
    experience: "10+ years teaching globally",
    achievements: [
      "Performed in international recitals and festivals",
      "Trained 500+ students from beginner to advanced",
      "Specialist in technique, musicality, and performance psychology",
    ],
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
    title: "Beginner",
    description: "Build strong foundations with posture, rhythm, and note reading.",
    topics: ["Piano basics", "Reading music", "Hand coordination"],
    image: "/piano/piano-foundations.svg",
  },
  {
    title: "Intermediate",
    description: "Strengthen technique, harmony, and musical expression.",
    topics: ["Scales & arpeggios", "Chord harmony", "Stylistic fluency"],
    image: "/piano/piano-studio.svg",
  },
  {
    title: "Advanced",
    description: "Master performance, improvisation, and advanced repertoire.",
    topics: ["Improvisation", "Advanced technique", "Performance mastery"],
    image: "/piano/piano-performance.svg",
  },
];

export const performanceVideos: PerformanceVideo[] = [
  {
    id: "perf-instructor",
    title: "Instructor performance",
    subtitle: "Concert hall recital highlight",
    src: "/videos/piano-instructor.mp4",
    poster: "/piano/piano-performance.svg",
    category: "Instructor",
  },
  {
    id: "perf-student",
    title: "Student showcase",
    subtitle: "Graduation performance clip",
    src: "/videos/piano-student.mp4",
    poster: "/piano/piano-students.svg",
    category: "Student",
  },
  {
    id: "perf-practice",
    title: "Practice clip",
    subtitle: "Daily technique routine",
    src: "/videos/piano-practice.mp4",
    poster: "/piano/piano-practice.svg",
    category: "Practice",
  },
  {
    id: "perf-session",
    title: "Live session",
    subtitle: "Behind-the-scenes coaching",
    src: "/videos/piano-session.mp4",
    poster: "/piano/piano-class.svg",
    category: "Instructor",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Meera D.",
    title: "Beginner Student",
    rating: "5.0",
    quote:
      "The 12-week structure kept me consistent. I can finally read music and play full pieces.",
    image: "/piano/piano-students.svg",
  },
  {
    name: "Lucas P.",
    title: "Intermediate Student",
    rating: "4.9",
    quote:
      "Technique drills plus performance coaching made a huge difference in my confidence.",
    image: "/piano/piano-performance.svg",
  },
  {
    name: "Sanya R.",
    title: "Advanced Student",
    rating: "5.0",
    quote:
      "The musicality lessons feel like a conservatory experience online.",
    image: "/piano/piano-studio.svg",
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Beginner Program",
    price: "INR 4,500",
    cadence: "one-time",
    description: "Full 12-week curriculum with guided assignments.",
    features: [
      "48 video lessons",
      "Practice tracker",
      "Weekly feedback",
      "Certificate eligibility",
    ],
  },
  {
    name: "Monthly Piano Membership",
    price: "INR 2,500",
    cadence: "per month",
    description: "Ongoing lessons, live sessions, and updated repertoire.",
    features: [
      "New lessons every month",
      "Live group classes",
      "Performance reviews",
      "Member-only resources",
    ],
    highlighted: true,
  },
  {
    name: "Private Coaching",
    price: "INR 9,000",
    cadence: "per month",
    description: "1:1 mentorship with Ariya Sen.",
    features: [
      "Weekly private lessons",
      "Custom practice plan",
      "Performance feedback",
      "Priority scheduling",
    ],
  },
];

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
