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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Melody Monks Indian Music Academy",
    template: "%s | Melody Monks Indian Music Academy",
  },
  description:
    "Premium Indian music academy with live classes on Google Meet or Zoom, recorded lessons, and certification.",
  openGraph: {
    title: "Melody Monks Indian Music Academy",
    description:
      "Learn Indian music with live Google Meet and Zoom classes, cinematic lessons, structured programs, and expert coaching.",
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
