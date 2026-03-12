export type GalleryCategory =
  | "Instructor Performances"
  | "Student Performances"
  | "Practice Clips"
  | "Behind the Scenes";

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
    id: "inst-1",
    title: "Concert hall recital",
    category: "Instructor Performances",
    kind: "image",
    src: "/piano/piano-performance.svg",
    caption: "Replace with an instructor performance photo.",
  },
  {
    id: "inst-2",
    title: "Studio performance",
    category: "Instructor Performances",
    kind: "image",
    src: "/piano/piano-studio.svg",
    caption: "Swap with a studio recording shot.",
  },
  {
    id: "stud-1",
    title: "Student recital",
    category: "Student Performances",
    kind: "image",
    src: "/piano/piano-students.svg",
    caption: "Showcase a student performance moment.",
  },
  {
    id: "stud-2",
    title: "Graduation showcase",
    category: "Student Performances",
    kind: "image",
    src: "/piano/piano-class.svg",
    caption: "Highlight a cohort recital or showcase.",
  },
  {
    id: "prac-1",
    title: "Daily practice clip",
    category: "Practice Clips",
    kind: "image",
    src: "/piano/piano-practice.svg",
    caption: "Replace with a short practice clip still.",
  },
  {
    id: "bts-1",
    title: "Behind the scenes",
    category: "Behind the Scenes",
    kind: "image",
    src: "/piano/piano-foundations.svg",
    caption: "Share a coaching or prep session photo.",
  },
  {
    id: "video-1",
    title: "Instructor recital clip",
    category: "Instructor Performances",
    kind: "video",
    poster: "/piano/piano-performance.svg",
    caption: "Add a performance video file here.",
  },
];

export const galleryCategories: GalleryCategory[] = [
  "Instructor Performances",
  "Student Performances",
  "Practice Clips",
  "Behind the Scenes",
];
