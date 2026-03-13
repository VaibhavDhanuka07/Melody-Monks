const warmups = [
  {
    title: "Breath activation",
    detail: "4 counts inhale, 6 counts exhale. Repeat 6 times.",
  },
  {
    title: "Humming resonance",
    detail: "Hum softly on Sa- Re- Ga, focusing on facial resonance.",
  },
  {
    title: "Lip trills",
    detail: "Lip trills on a 5-note scale to relax the vocal folds.",
  },
  {
    title: "Sargam glide",
    detail: "Glide between Sa and Pa slowly to build smooth transitions.",
  },
  {
    title: "Taan builder",
    detail: "Short, controlled taans on Raag Yaman patterns.",
  },
];

export const metadata = {
  title: "Voice Warm-up Exercises",
  description: "Daily vocal warmups for stamina and clarity.",
};

export default function VoiceWarmupsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Warm-ups</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Voice warm-up exercises
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Use this short routine before riyaz or performance practice.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {warmups.map((warmup) => (
          <div key={warmup.title} className="card-strong p-6 space-y-3">
            <p className="text-lg font-semibold text-ink">{warmup.title}</p>
            <p className="text-sm text-ink-muted">{warmup.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
