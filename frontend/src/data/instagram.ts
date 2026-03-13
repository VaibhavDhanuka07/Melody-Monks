export type InstagramPost = {
  id: string;
  title: string;
  type: "Reel" | "Photo" | "Video";
  thumbnail: string;
  url: string;
  embedUrl?: string;
};

export const instagramProfileUrl = "https://www.instagram.com/musicianvasu";

export const instagramPosts: InstagramPost[] = [
  {
    id: "vasu-1",
    title: "Hindustani recital highlight",
    type: "Reel",
    thumbnail: "/vasu/vasu-hero-stage.svg",
    url: "https://www.instagram.com/musicianvasu",
  },
  {
    id: "vasu-2",
    title: "Mentor portrait session",
    type: "Photo",
    thumbnail: "/vasu/vasu-mentor-portrait.svg",
    url: "https://www.instagram.com/musicianvasu",
  },
  {
    id: "vasu-3",
    title: "Studio performance clip",
    type: "Video",
    thumbnail: "/vasu/vasu-studio-session.svg",
    url: "https://www.instagram.com/musicianvasu",
  },
  {
    id: "vasu-4",
    title: "Masterclass with students",
    type: "Reel",
    thumbnail: "/vasu/vasu-masterclass.svg",
    url: "https://www.instagram.com/musicianvasu",
  },
  {
    id: "vasu-5",
    title: "Live class snapshot",
    type: "Photo",
    thumbnail: "/vasu/vasu-live-class.svg",
    url: "https://www.instagram.com/musicianvasu",
  },
  {
    id: "vasu-6",
    title: "Student recital moment",
    type: "Video",
    thumbnail: "/vasu/vasu-student-recital.svg",
    url: "https://www.instagram.com/musicianvasu",
  },
  {
    id: "vasu-7",
    title: "Judge panel look",
    type: "Photo",
    thumbnail: "/vasu/vasu-judge-panel.svg",
    url: "https://www.instagram.com/musicianvasu",
  },
  {
    id: "vasu-8",
    title: "Practice room routine",
    type: "Reel",
    thumbnail: "/vasu/vasu-practice-room.svg",
    url: "https://www.instagram.com/musicianvasu",
  },
];
