import Image from "next/image";
import Link from "next/link";
import { coursePaths } from "@/data/site";

export default function CoursesPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong grid gap-8 p-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Courses</p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">
              Guitar mastery from first chord to stage performance
            </h1>
            <p className="mt-4 text-sm text-ink-muted">
              Choose a path designed by Vasu for rapid progress, cinematic
              confidence, and long-term artistry.
            </p>
            <Link href="/book-trial" className="btn-primary mt-6">
              Book Free Trial
            </Link>
          </div>
          <div className="grid gap-3 text-sm text-ink-muted">
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
              Weekly live sessions and feedback
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
              Fingerstyle, improvisation, and stagecraft
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
              Performance reviews and growth tracking
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {coursePaths.map((path) => (
            <div key={path.title} className="card-strong flex flex-col gap-6 p-6">
              <div className="relative h-44 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={path.image}
                  alt={path.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-ink">{path.title}</h2>
                <p className="mt-2 text-sm text-ink-muted">{path.description}</p>
              </div>
              <ul className="space-y-2 text-sm text-ink-muted">
                {path.topics.map((topic) => (
                  <li key={topic}>- {topic}</li>
                ))}
              </ul>
              <Link href="/book-trial" className="btn-secondary mt-auto">
                Enroll Now
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
