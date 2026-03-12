import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import FloatingWhatsApp from "@/components/site/FloatingWhatsApp";

const display = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vasu Guitar Academy | Melody Monks",
    template: "%s | Vasu Guitar Academy",
  },
  description:
    "Premium guitar academy by professional musician Vasu. Cinematic lessons, live classes, and performance coaching.",
  openGraph: {
    title: "Vasu Guitar Academy | Melody Monks",
    description:
      "Learn guitar with structured paths, live coaching, and premium performance training.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} bg-base text-ink antialiased`}
      >
        <div className="relative min-h-screen overflow-hidden bg-base">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" />
          <div className="pointer-events-none absolute inset-0 bg-subtle-grid opacity-40" />
          <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-brand-gold/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/5 blur-[140px]" />

          <div className="relative z-10">
            <Navbar />
            <main className="relative">{children}</main>
            <Footer />
          </div>
          <FloatingWhatsApp />
        </div>
      </body>
    </html>
  );
}
