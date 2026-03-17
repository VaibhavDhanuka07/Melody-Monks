export type Tool = {
  id: string;
  name: string;
  description: string;
  toolType: string;
  href: string;
  badge?: string;
  instrument?: string;
  image?: string;
};

export const tools: Tool[] = [
  {
    id: "tool-metronome",
    name: "Metronome",
    description: "Stay in time with adjustable BPM and visual beats.",
    toolType: "Practice",
    href: "/practice/metronome",
    badge: "Live Tool",
    instrument: "General",
    image: "/academy/tools/metronome.svg",
  },
  {
    id: "tool-scale",
    name: "Scale Practice Generator",
    description: "Warm up with structured scales and progressions.",
    toolType: "Practice",
    href: "/practice/scale-trainer",
    instrument: "General",
    image: "/academy/tools/scale-practice.svg",
  },
  {
    id: "tool-chord",
    name: "Chord Finder",
    description: "Find chord shapes and progressions quickly.",
    toolType: "Reference",
    href: "/piano-chord-finder",
    instrument: "Piano",
    image: "/academy/tools/chord-finder.svg",
  },
  {
    id: "tool-timer",
    name: "Practice Timer",
    description: "Track focused riyaz sessions with interval timers.",
    toolType: "Routine",
    href: "/tools/practice-timer",
    instrument: "General",
    image: "/academy/tools/practice-timer.svg",
  },
  {
    id: "tool-raag",
    name: "Raag Reference Guide",
    description: "Explore raag aroh-avaroh, pakad, and mood.",
    toolType: "Theory",
    href: "/tools/raag-guide",
    instrument: "General",
    image: "/academy/tools/raag-guide.svg",
  },
  {
    id: "tool-warmup",
    name: "Voice Warm-up Exercises",
    description: "Daily vocal warmups for stamina and clarity.",
    toolType: "Vocal",
    href: "/tools/voice-warmups",
    instrument: "Vocal",
    image: "/academy/tools/voice-warmups.svg",
  },
  {
    id: "tool-pitch",
    name: "Pitch Training",
    description: "Train pitch accuracy with real-time note detection.",
    toolType: "AI Tool",
    href: "/tools/pitch-training",
    badge: "AI",
    instrument: "General",
    image: "/academy/tools/pitch-training.svg",
  },
];
