export type GalleryCategory =
  | "Performances"
  | "Teaching sessions"
  | "Student achievements"
  | "Events";

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  kind: "image" | "video" | "instagram";
  src?: string;
  poster?: string;
  instagramUrl?: string;
  caption?: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "perf-1",
    title: "Live performance spotlight",
    category: "Performances",
    kind: "image",
    src: "/gallery/performance-1.svg",
    caption: "Replace with a live stage photo of Debojeet.",
  },
  {
    id: "perf-2",
    title: "Studio performance set",
    category: "Performances",
    kind: "image",
    src: "/gallery/performance-2.svg",
    caption: "Add a concert or studio performance shot.",
  },
  {
    id: "teach-1",
    title: "Piano coaching session",
    category: "Teaching sessions",
    kind: "image",
    src: "/gallery/teaching-1.svg",
    caption: "Swap with a teaching session photo.",
  },
  {
    id: "teach-2",
    title: "Mentor portrait",
    category: "Teaching sessions",
    kind: "image",
    src: "/gallery/mentor-1.svg",
    caption: "Replace with an instructor portrait.",
  },
  {
    id: "student-1",
    title: "Student milestone",
    category: "Student achievements",
    kind: "image",
    src: "/gallery/students-1.svg",
    caption: "Showcase student achievements or recitals.",
  },
  {
    id: "event-1",
    title: "Community event",
    category: "Events",
    kind: "image",
    src: "/gallery/events-1.svg",
    caption: "Replace with workshop or event photos.",
  },
  {
    id: "video-1",
    title: "Performance reel",
    category: "Performances",
    kind: "video",
    poster: "/gallery/performance-1.svg",
    caption: "Add a short performance video file here.",
  },
];

export const instagramItems = [
  {
    id: "ig-1",
    title: "Musician Vasu on Instagram",
    url: "https://www.instagram.com/musicianvasu?igsh=MW15bWd0dDJoZWJkeQ==",
  },
  {
    id: "ig-2",
    title: "Add Instagram post URL",
    url: "https://www.instagram.com/p/POST_ID",
  },
  {
    id: "ig-3",
    title: "Add Instagram reel URL",
    url: "https://www.instagram.com/reel/POST_ID",
  },
];

export const galleryCategories: GalleryCategory[] = [
  "Performances",
  "Teaching sessions",
  "Student achievements",
  "Events",
];

