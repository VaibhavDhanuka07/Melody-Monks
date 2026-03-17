export type GalleryCategory =
  | "Instructor Performances"
  | "Student Performances"
  | "Live Classes"
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
    title: "Hindustani recital",
    category: "Instructor Performances",
    kind: "image",
    src: "/vasu/instructor-1.webp",
    caption: "Signature stage visual for Debojeet Lahiri's live recitals.",
  },
  {
    id: "inst-2",
    title: "Concert hall performance",
    category: "Instructor Performances",
    kind: "image",
    src: "/vasu/instructor-2.jpeg",
    caption: "Premium recital-style visual for stage and showcase pages.",
  },
  {
    id: "inst-3",
    title: "Studio vocal session",
    category: "Instructor Performances",
    kind: "image",
    src: "/vasu/instructor-3.webp",
    caption: "Recording-focused session visuals for performance highlights.",
  },
  {
    id: "stud-1",
    title: "Student recital highlight",
    category: "Student Performances",
    kind: "image",
    src: "/gallery/student-performances/student-performance-1.webp",
    caption: "Students move from practice rooms to recital-ready performances.",
  },
  {
    id: "stud-2",
    title: "Stage showcase moment",
    category: "Student Performances",
    kind: "image",
    src: "/gallery/student-performances/student-performance-2.webp",
    caption: "Stage-focused coaching moments that build confidence and presence.",
  },
  {
    id: "stud-3",
    title: "Student achievement spotlight",
    category: "Student Performances",
    kind: "image",
    src: "/gallery/student-performances/student-performance-3.webp",
    caption: "Celebrating student milestones across classes, recitals, and showcases.",
  },
  {
    id: "live-1",
    title: "Online class snapshot",
    category: "Live Classes",
    kind: "video",
    src: "/gallery/live-classes/live-class-1.mp4",
    poster: "/vasu/vasu-live-class.svg",
    caption: "A more premium frame for live classes and remote mentorship.",
  },
  {
    id: "live-2",
    title: "Recital prep session",
    category: "Live Classes",
    kind: "video",
    src: "/gallery/live-classes/live-class-2.mp4",
    poster: "/vasu/vasu-judge-panel.svg",
    caption: "Mock judging and performance review moments for advanced students.",
  },
  {
    id: "live-3",
    title: "Coaching floor",
    category: "Live Classes",
    kind: "video",
    src: "/gallery/live-classes/live-class-3.mp4",
    poster: "/vasu/vasu-mentor-portrait.svg",
    caption: "Instructor-centered branding visual for coaching and mentorship.",
  },
  {
    id: "bts-1",
    title: "Backstage prep",
    category: "Behind the Scenes",
    kind: "image",
    src: "/vasu/vasu-studio-session.svg",
    caption: "Recording checks, technical setup, and rehearsal flow.",
  },
  {
    id: "bts-2",
    title: "Stage lighting setup",
    category: "Behind the Scenes",
    kind: "image",
    src: "/vasu/vasu-concert-hall.svg",
    caption: "A branded visual for event pages and premium academy storytelling.",
  },
  {
    id: "bts-3",
    title: "Practice culture",
    category: "Behind the Scenes",
    kind: "image",
    src: "/vasu/vasu-practice-room.svg",
    caption: "Daily riyaz, repetition, and guided skill-building routines.",
  },
];

export const galleryCategories: GalleryCategory[] = [
  "Instructor Performances",
  "Student Performances",
  "Live Classes",
];
