import Link from "next/link";

export const metadata = {
  title: "About",
  description: "Meet the Melody Monks global music academy team and mission.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold text-brand-purple">About Us</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">
            Building a global classroom for modern musicians
          </h1>
          <p className="mt-4 text-ink-muted">
            Melody Monks connects students with world-class instructors, structured
            curricula, and interactive practice tools. Our mission is to make
            premium music education accessible anywhere.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "18+ countries",
                description: "Instructors and students spanning multiple time zones.",
              },
              {
                title: "AI feedback",
                description: "Smart tools for pitch, rhythm, and chord accuracy.",
              },
              {
                title: "Live coaching",
                description: "Weekly group classes and 1:1 feedback sessions.",
              },
              {
                title: "Performance-ready",
                description: "Build repertoire and confidence for recitals.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card p-4"
              >
                <p className="text-base font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm text-ink-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8">
          <p className="text-sm font-semibold text-brand-indigo">Our Promise</p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">
            Structured learning with creative freedom
          </h2>
          <p className="mt-4 text-sm text-ink-muted">
            Our curriculum is built by active performers and educators. Each
            program balances theory, practice, and performance to keep learning
            joyful and measurable.
          </p>
          <div className="mt-6 space-y-3 text-sm text-ink-muted">
            <p>- Weekly progress milestones</p>
            <p>- Instructor performance feedback</p>
            <p>- Practice analytics dashboard</p>
          </div>
          <Link
            href="/book-trial"
            className="btn-accent mt-6"
          >
            Book a Trial
          </Link>
        </div>
      </div>

      <div className="mt-12 card p-8">
        <p className="text-sm font-semibold text-brand-purple">
          Instructor Profile
        </p>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-semibold text-ink">
              Debojeet Lahiri (Musician Vasu)
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Music educator, performer, composer.
            </p>
            <p className="mt-4 text-sm text-ink-muted">
              Debojeet combines performance experience with structured coaching
              to help students grow in technique, confidence, and musical
              expression.
            </p>
          </div>
          <a
            href="https://www.instagram.com/musicianvasu?igsh=MW15bWd0dDJoZWJkeQ=="
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </div>
  );
}


