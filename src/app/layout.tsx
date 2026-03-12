import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const display = Poppins({
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
    default: "Melody Monks Music Academy",
    template: "%s | Melody Monks Music Academy",
  },
  description:
    "Global music academy for piano, guitar, vocals, and more. Live classes, interactive practice tools, and AI feedback.",
  openGraph: {
    title: "Melody Monks Music Academy",
    description:
      "Learn music online with live classes, interactive tools, and personalized coaching.",
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
          <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-80" />
          <div className="pointer-events-none absolute inset-0 bg-subtle-grid opacity-60" />
          <div className="pointer-events-none absolute -top-36 right-10 h-72 w-72 rounded-full bg-brand-indigo/30 blur-3xl" />
          <div className="pointer-events-none absolute top-44 -left-12 h-80 w-80 rounded-full bg-brand-purple/25 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-brand-amber/25 blur-[120px]" />

          <div className="relative z-10">
            <Navbar />
            <main className="relative">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

