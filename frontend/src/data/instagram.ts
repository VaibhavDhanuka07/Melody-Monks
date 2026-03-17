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
    id: "reel-DVjtw2ajy3a",
    title: "Featured reel 1",
    type: "Reel",
    thumbnail: "/vasu/vasu-hero-stage.svg",
    url: "https://www.instagram.com/reel/DVjtw2ajy3a/",
  },
  {
    id: "reel-DU-hM2qDtTP",
    title: "Featured reel 2",
    type: "Reel",
    thumbnail: "/vasu/vasu-mentor-portrait.svg",
    url: "https://www.instagram.com/reel/DU-hM2qDtTP/",
  },
  {
    id: "reel-DU08oztCIDV",
    title: "Featured reel 3",
    type: "Reel",
    thumbnail: "/vasu/vasu-studio-session.svg",
    url: "https://www.instagram.com/reel/DU08oztCIDV/",
  },
  {
    id: "reel-DUWS-HDE7ni",
    title: "Featured reel 4",
    type: "Reel",
    thumbnail: "/vasu/vasu-masterclass.svg",
    url: "https://www.instagram.com/reel/DUWS-HDE7ni/",
  },
  {
    id: "reel-DT3Qt_BlHnF",
    title: "Featured reel 5",
    type: "Reel",
    thumbnail: "/vasu/vasu-live-class.svg",
    url: "https://www.instagram.com/reel/DT3Qt_BlHnF/",
  },
  {
    id: "reel-DTfX-3AjEz3",
    title: "Featured reel 6",
    type: "Reel",
    thumbnail: "/vasu/vasu-practice-room.svg",
    url: "https://www.instagram.com/reel/DTfX-3AjEz3/",
  },
];
