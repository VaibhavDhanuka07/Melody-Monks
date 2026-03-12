import { site } from "@/data/site";

export default function FloatingWhatsApp() {
  return (
    <a
      href={site.whatsappLink}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold text-black shadow-glow transition hover:-translate-y-1"
      aria-label="Chat on WhatsApp"
    >
      <span className="text-sm font-semibold">WA</span>
    </a>
  );
}
