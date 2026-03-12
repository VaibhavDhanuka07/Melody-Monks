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
};

export type Testimonial = {
  name: string;
  title: string;
  rating: string;
  quote: string;
  image: string;
};

const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX";
const whatsappMessage =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
  "Hi, I want to book a free guitar trial class.";

export const site = {
  name: "Melody Monks",
  instructor: {
    name: "Vasu",
    fullName: "Debojeet Lahiri (Musician Vasu)",
    role: "Professional guitarist, performer, composer",
    bio: "Vasu blends classical discipline with modern stagecraft to help students master guitar with confidence.",
    experience: "10+ years coaching students worldwide",
    achievements: [
      "Performed across major venues and festivals",
      "Mentored 500+ students to stage-ready performances",
      "Specialist in fingerstyle, improvisation, and live performance",
    ],
  },
  instagramUrl: "https://www.instagram.com/musicianvasu",
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
    description: "Build strong foundations with guided rhythm and chord training.",
    topics: ["Guitar basics", "Basic chords", "Rhythm training"],
    image: "/vasu/vasu-teaching.svg",
  },
  {
    title: "Intermediate",
    description: "Level up with barre chords, fingerstyle, and song practice.",
    topics: ["Barre chords", "Fingerstyle", "Song practice"],
    image: "/vasu/vasu-performance.svg",
  },
  {
    title: "Advanced",
    description: "Master solo techniques, improvisation, and live performance.",
    topics: ["Solo techniques", "Improvisation", "Live performance"],
    image: "/vasu/vasu-studio.svg",
  },
];

export const performanceVideos: PerformanceVideo[] = [
  {
    id: "perf-acoustic",
    title: "Acoustic solo",
    subtitle: "Signature fingerstyle arrangement",
    src: "/videos/vasu-acoustic.mp4",
    poster: "/vasu/vasu-performance.svg",
  },
  {
    id: "perf-electric",
    title: "Electric solo",
    subtitle: "Expressive lead performance",
    src: "/videos/vasu-electric.mp4",
    poster: "/vasu/vasu-studio.svg",
  },
  {
    id: "perf-live",
    title: "Live performance",
    subtitle: "Concert stage highlight",
    src: "/videos/vasu-live.mp4",
    poster: "/vasu/vasu-live.svg",
  },
  {
    id: "perf-reel",
    title: "Instagram reel",
    subtitle: "60-second showcase",
    src: "/videos/vasu-reel.mp4",
    poster: "/vasu/vasu-portrait.svg",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Aanya S.",
    title: "Beginner Student",
    rating: "5.0",
    quote:
      "Vasu made guitar feel attainable. The structure and performance tips are exceptional.",
    image: "/vasu/vasu-portrait.svg",
  },
  {
    name: "Rohit K.",
    title: "Intermediate Player",
    rating: "4.9",
    quote:
      "The fingerstyle modules and live feedback helped me perform confidently on stage.",
    image: "/vasu/vasu-performance.svg",
  },
  {
    name: "Maya P.",
    title: "Advanced Student",
    rating: "5.0",
    quote:
      "Every session feels premium. The performance coaching is on another level.",
    image: "/vasu/vasu-studio.svg",
  },
];

export const instagramFallback = [
  {
    id: "ig-1",
    title: "Behind the scenes studio session",
    image: "/vasu/vasu-studio.svg",
    url: "https://www.instagram.com/musicianvasu",
    type: "photo",
  },
  {
    id: "ig-2",
    title: "Fingerstyle performance reel",
    image: "/vasu/vasu-performance.svg",
    url: "https://www.instagram.com/musicianvasu",
    type: "reel",
  },
  {
    id: "ig-3",
    title: "Teaching highlight",
    image: "/vasu/vasu-teaching.svg",
    url: "https://www.instagram.com/musicianvasu",
    type: "photo",
  },
];

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
