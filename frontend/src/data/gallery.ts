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
    src: "/vasu/vasu-hero-stage.svg",
    caption: "Signature stage visual for Debojeet Lahiri's live recitals.",
  },
  {
    id: "inst-2",
    title: "Concert hall performance",
    category: "Instructor Performances",
    kind: "image",
    src: "/vasu/vasu-concert-hall.svg",
    caption: "Premium recital-style visual for stage and showcase pages.",
  },
  {
    id: "inst-3",
    title: "Studio vocal session",
    category: "Instructor Performances",
    kind: "image",
    src: "/vasu/vasu-studio-session.svg",
    caption: "Recording-focused session visuals for performance highlights.",
  },
  {
    id: "stud-1",
    title: "Student showcase",
    category: "Student Performances",
    kind: "image",
    src: "/vasu/vasu-student-recital.svg",
    caption: "Student showcase moments built for recitals and transformations.",
  },
  {
    id: "stud-2",
    title: "Mentor with students",
    category: "Student Performances",
    kind: "image",
    src: "/vasu/vasu-masterclass.svg",
    caption: "Instructor-led class moments and cohort coaching visuals.",
  },
  {
    id: "stud-3",
    title: "Practice room breakthrough",
    category: "Student Performances",
    kind: "image",
    src: "/vasu/vasu-practice-room.svg",
    caption: "Practice-focused visual for weekly progress and review stories.",
  },
  {
    id: "live-1",
    title: "Online class snapshot",
    category: "Live Classes",
    kind: "image",
    src: "/vasu/vasu-live-class.svg",
    caption: "A more premium frame for live classes and remote mentorship.",
  },
  {
    id: "live-2",
    title: "Recital prep session",
    category: "Live Classes",
    kind: "image",
    src: "/vasu/vasu-judge-panel.svg",
    caption: "Mock judging and performance review moments for advanced students.",
  },
  {
    id: "live-3",
    title: "Coaching floor",
    category: "Live Classes",
    kind: "image",
    src: "/vasu/vasu-mentor-portrait.svg",
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
  "Behind the Scenes",
];
