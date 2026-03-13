import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0B0B0B",
        ink: "#FFFFFF",
        "ink-muted": "#B9B9B9",
        "brand-gold": "#C8A96A",
        "brand-gold-soft": "#E6D3A8",
        "brand-blue": "#2F80ED",
        "brand-dark": "#1F1F1F",
        panel: "rgba(31, 31, 31, 0.72)",
        stroke: "rgba(255, 255, 255, 0.14)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(0, 0, 0, 0.45)",
        lift: "0 30px 80px rgba(0, 0, 0, 0.6)",
        glow: "0 0 60px rgba(200, 169, 106, 0.3)",
        "glow-blue": "0 0 60px rgba(47, 128, 237, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.8s ease-out forwards",
        "slide-in": "slide-in 0.8s ease-out forwards",
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 36s linear infinite",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 20% 20%, rgba(200, 169, 106, 0.18), transparent 55%), radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.08), transparent 45%), radial-gradient(circle at 50% 80%, rgba(200, 169, 106, 0.12), transparent 55%)",
        "subtle-grid":
          "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
