import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export default function InstructorPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src="/piano/piano-portrait.svg"
              alt={site.instructor.fullName}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-brand-gold">Instructor</p>
              <h1 className="mt-3 text-4xl font-semibold text-ink">
                {site.instructor.fullName}
              </h1>
              <p className="mt-2 text-sm text-ink-muted">
                {site.instructor.role}
              </p>
            </div>
            <p className="text-sm text-ink-muted">{site.instructor.bio}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/50 px-5 py-4 text-sm text-ink-muted">
                {site.instructor.experience}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 px-5 py-4 text-sm text-ink-muted">
                Specializes in expressive performance coaching
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                Achievements
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                {site.instructor.achievements.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
            <Link href="/book-trial" className="btn-primary">
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="card-strong grid gap-6 p-8 md:grid-cols-3">
          {[
            {
              title: "Performance Coaching",
              detail: "Stage-ready presence, tone, and musicality.",
            },
            {
              title: "Technique Mastery",
              detail: "Detailed fingering and strength training.",
            },
            {
              title: "Artist Development",
              detail: "Build confidence and repertoire depth.",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-2">
              <p className="text-lg font-semibold text-ink">{item.title}</p>
              <p className="text-sm text-ink-muted">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
