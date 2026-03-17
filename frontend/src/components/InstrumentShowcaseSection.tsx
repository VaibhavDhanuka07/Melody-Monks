import Image from "next/image";
import Link from "next/link";
import { instrumentArt, instrumentPhotoMap } from "@/data/media";

type InstrumentCard = {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
};

const instrumentCards: InstrumentCard[] = [
  {
    id: "instrument-singing",
    name: "Singing",
    description: "Vocal strength, sur accuracy, and performance skills.",
    image: instrumentPhotoMap.singing ?? instrumentArt.singing,
    slug: "singing",
  },
  {
    id: "instrument-piano",
    name: "Piano",
    description: "Technique drills, chords, and expressive performance.",
    image: instrumentPhotoMap.piano ?? instrumentArt.piano,
    slug: "piano",
  },
  {
    id: "instrument-guitar",
    name: "Guitar",
    description: "Chords, fingerstyle, and Bollywood arrangements.",
    image: instrumentPhotoMap.guitar ?? instrumentArt.guitar,
    slug: "guitar",
  },
  {
    id: "instrument-drums",
    name: "Drums",
    description: "Groove control, fills, and rhythm precision.",
    image: instrumentPhotoMap.drums ?? instrumentArt.drums,
    slug: "drums",
  },
  {
    id: "instrument-violin",
    name: "Violin",
    description: "Bow control, pitch accuracy, and musical expression.",
    image: instrumentPhotoMap.violin ?? instrumentArt.violin,
    slug: "violin",
  },
  {
    id: "instrument-flute",
    name: "Flute",
    description: "Breathing, fingering, and tone development.",
    image: instrumentPhotoMap.flute ?? instrumentArt.flute,
    slug: "flute",
  },
  {
    id: "instrument-harmonium",
    name: "Harmonium",
    description: "Raag practice, chords, and accompaniment skills.",
    image: instrumentPhotoMap.harmonium ?? instrumentArt.harmonium,
    slug: "harmonium",
  },
  {
    id: "instrument-tabla",
    name: "Tabla",
    description: "Taal clarity, bols, and stage-ready rhythm.",
    image: instrumentPhotoMap.tabla ?? instrumentArt.tabla,
    slug: "tabla",
  },
  {
    id: "instrument-trumpet",
    name: "Trumpet",
    description: "Embouchure, range, and live performance focus.",
    image: instrumentPhotoMap.trumpet ?? instrumentArt.trumpet,
    slug: "trumpet",
  },
];

export default function InstrumentShowcaseSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6" id="instrument-showcase">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">
            Instrument Showcase
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">
            Pick an instrument and start learning today
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Each learning path is built with live coaching, practice tools, and
            certifications.
          </p>
        </div>
        <Link href="/courses" className="btn-secondary px-4 py-2 text-xs">
          View All Courses
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {instrumentCards.map((instrument) => (
          <Link
            key={instrument.id}
            href={`/courses/${instrument.slug}`}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-soft"
          >
            <div className="relative h-48 w-full sm:h-56 lg:h-60">
              <div
                // Defensive sizing so `next/image` fill never escapes if utility CSS fails to load.
                style={{
                  position: "relative",
                  minHeight: "12rem",
                  height: "100%",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={instrument.image}
                  alt={instrument.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h3 className="text-xl font-semibold text-ink">
                {instrument.name}
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                {instrument.description}
              </p>
              <span className="mt-4 inline-flex w-max translate-y-2 items-center justify-center rounded-full border border-brand-gold/40 bg-black/40 px-4 py-2 text-xs font-semibold text-brand-gold opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                Start Learning
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
