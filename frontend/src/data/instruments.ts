import { instrumentArt } from "@/data/media";

export type Instrument = {
  id: string;
  name: string;
  description: string;
  href: string;
  highlight?: string;
  image: string;
};

export const instruments: Instrument[] = [
  {
    id: "instrument-piano",
    name: "Piano",
    description: "Virtual piano, chords, and scale practice routines.",
    href: "/tools/piano",
    highlight: "Virtual Piano",
    image: instrumentArt.piano,
  },
  {
    id: "instrument-guitar",
    name: "Guitar",
    description: "Chord finder, tuner, and strumming trainer.",
    href: "/tools/guitar",
    highlight: "Tuner + Strumming",
    image: instrumentArt.guitar,
  },
  {
    id: "instrument-violin",
    name: "Violin",
    description: "Pitch training, tuner, and scale drills.",
    href: "/tools/violin",
    highlight: "Pitch Trainer",
    image: instrumentArt.violin,
  },
  {
    id: "instrument-drums",
    name: "Drums",
    description: "Rhythm trainer, beat generator, and timers.",
    href: "/tools/drums",
    highlight: "Beat Generator",
    image: instrumentArt.drums,
  },
  {
    id: "instrument-flute",
    name: "Flute",
    description: "Breathing trainer, pitch focus, and scales.",
    href: "/tools/flute",
    highlight: "Breathing",
    image: instrumentArt.flute,
  },
  {
    id: "instrument-harmonium",
    name: "Harmonium",
    description: "Scale practice and raag support.",
    href: "/tools/harmonium",
    highlight: "Raag Guide",
    image: instrumentArt.harmonium,
  },
  {
    id: "instrument-tabla",
    name: "Tabla",
    description: "Rhythm cycles and practice timers.",
    href: "/tools/tabla",
    highlight: "Rhythm Trainer",
    image: instrumentArt.tabla,
  },
  {
    id: "instrument-vocal",
    name: "Vocal Practice",
    description: "Pitch trainer, warmups, and raag practice.",
    href: "/tools/vocal-practice",
    highlight: "Pitch + Warmups",
    image: instrumentArt.vocal,
  },
];
