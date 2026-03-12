export type GalleryCategory =
  | "Performances"
  | "Teaching sessions"
  | "Student achievements"
  | "Events";

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  kind: "image" | "video";
  src?: string;
  poster?: string;
  caption?: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "perf-1",
    title: "Acoustic solo spotlight",
    category: "Performances",
    kind: "image",
    src: "/vasu/vasu-performance.svg",
    caption: "Replace with a live stage photo of Vasu.",
  },
  {
    id: "perf-2",
    title: "Studio performance set",
    category: "Performances",
    kind: "image",
    src: "/vasu/vasu-studio.svg",
    caption: "Add a concert or studio performance shot.",
  },
  {
    id: "teach-1",
    title: "Guitar coaching session",
    category: "Teaching sessions",
    kind: "image",
    src: "/vasu/vasu-teaching.svg",
    caption: "Swap with an in-class teaching moment.",
  },
  {
    id: "teach-2",
    title: "Instructor portrait",
    category: "Teaching sessions",
    kind: "image",
    src: "/vasu/vasu-portrait.svg",
    caption: "Replace with Vasu's hero portrait.",
  },
  {
    id: "student-1",
    title: "Student showcase",
    category: "Student achievements",
    kind: "image",
    src: "/vasu/vasu-students.svg",
    caption: "Showcase student achievements or recitals.",
  },
  {
    id: "event-1",
    title: "Community jam",
    category: "Events",
    kind: "image",
    src: "/vasu/vasu-live.svg",
    caption: "Replace with workshop or event photos.",
  },
  {
    id: "video-1",
    title: "Performance reel",
    category: "Performances",
    kind: "video",
    poster: "/vasu/vasu-performance.svg",
    caption: "Add a short performance video file here.",
  },
];

export const galleryCategories: GalleryCategory[] = [
  "Performances",
  "Teaching sessions",
  "Student achievements",
  "Events",
];
