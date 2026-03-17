import Image from "next/image";
import Link from "next/link";
import type { Tool } from "@/data/tools";

type ToolsGridProps = {
  tools: Tool[];
};

export default function ToolsGrid({ tools }: ToolsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {tools.map((tool) => (
        <Link
          key={tool.id}
          href={tool.href}
          className="group overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-soft transition hover:-translate-y-1"
        >
          {tool.image ? (
            <div
              className="relative h-36 overflow-hidden border-b border-white/10"
              style={{
                // Defensive sizing so `next/image` fill never escapes if utility CSS fails to load.
                position: "relative",
                height: "9rem",
                overflow: "hidden",
              }}
            >
              <Image
                src={tool.image}
                alt={tool.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            </div>
          ) : null}
          <div className="p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-semibold text-ink">{tool.name}</p>
              {tool.badge ? (
                <span className="rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-gold">
                  {tool.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm text-ink-muted">{tool.description}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-ink-muted">
              {tool.toolType}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
