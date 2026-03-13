import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata = {
  title: "About",
  description: "About the Melody Monks Indian Music Academy.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-16">
      <div>
        <p className="text-sm font-semibold text-brand-gold">About</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          A cinematic Indian music learning experience
        </h1>
        <p className="mt-3 text-ink-muted">
          Melody Monks Indian Music Academy delivers structured programs with
          live classes on {site.liveClassPlatforms}, performance coaching,
          practice tracking, and certification.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <p className="text-lg font-semibold text-ink">Our Mission</p>
          <p className="mt-3 text-sm text-ink-muted">
            Help students become confident Indian music performers with a clear,
            premium learning path and expert feedback.
          </p>
        </div>
        <div className="card p-6">
          <p className="text-lg font-semibold text-ink">Our Promise</p>
          <p className="mt-3 text-sm text-ink-muted">
            Consistent coaching, cinematic lessons, and measurable progress every
            week.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          "/vasu/vasu-hero-stage.svg",
          "/vasu/vasu-masterclass.svg",
          "/vasu/vasu-student-recital.svg",
        ].map((src) => (
          <div
            key={src}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={src}
              alt="Melody Monks academy visual"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="card-strong p-8">
        <p className="text-sm font-semibold text-brand-gold">Instructor</p>
        <h2 className="mt-3 text-3xl font-semibold text-ink">
          {site.instructor.fullName}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">{site.instructor.role}</p>
        <p className="mt-4 text-sm text-ink-muted">{site.instructor.bio}</p>
        <ul className="mt-6 space-y-2 text-sm text-ink-muted">
          <li>- 52 years old with {site.instructor.experience}</li>
          <li>- Trained 2000+ students across India and abroad</li>
          <li>- 300-350 students earning through music</li>
          <li>- Teaches underprivileged students for free</li>
          <li>- Worked with Bollywood artists and composers</li>
          <li>- Invited to 15-20 reality shows as chief guest / judge</li>
        </ul>
      </div>

      <Link href="/book-trial" className="btn-primary">
        Book a Free Trial
      </Link>
    </div>
  );
}
