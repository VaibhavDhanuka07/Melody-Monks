import ToolsGrid from "@/components/site/ToolsGrid";
import { instruments } from "@/data/instruments";

export const metadata = {
  title: "Music Tools",
  description: "Interactive tools for practice, pitch training, and riyaz.",
};

export default function ToolsPage() {
  const instrumentCards = instruments.map((instrument) => ({
    id: instrument.id,
    name: instrument.name,
    description: instrument.description,
    toolType: "Instrument",
    href: instrument.href,
    badge: instrument.highlight,
    image: instrument.image,
  }));

  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Tools</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Music tools by instrument
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Choose your instrument to open tailored tools and practice workflows.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ToolsGrid tools={instrumentCards} />
      </section>

    </div>
  );
}
