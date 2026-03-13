const raags = [
  {
    name: "Raag Yaman",
    notes: "Aroh: N R G M D N S | Avaroh: S N D P M G R S",
    mood: "Serene, devotional, evening",
  },
  {
    name: "Raag Bhairav",
    notes: "Aroh: S R G M P D N S | Avaroh: S N D P M G R S",
    mood: "Meditative, early morning",
  },
  {
    name: "Raag Bageshri",
    notes: "Aroh: S G M D N S | Avaroh: S N D M G R S",
    mood: "Romantic, late night",
  },
  {
    name: "Raag Kafi",
    notes: "Aroh: S R g M P D n S | Avaroh: S n D P M g R S",
    mood: "Folk-inspired, spring",
  },
];

export const metadata = {
  title: "Raag Reference Guide",
  description: "Aroh-avaroh and mood reference for common raags.",
};

export default function RaagGuidePage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Raag Guide</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Raag reference guide
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Use this quick reference for aroh-avaroh patterns and performance mood.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {raags.map((raag) => (
          <div key={raag.name} className="card-strong p-6 space-y-3">
            <p className="text-lg font-semibold text-ink">{raag.name}</p>
            <p className="text-sm text-ink-muted">{raag.notes}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
              Mood
            </p>
            <p className="text-sm text-ink">{raag.mood}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
