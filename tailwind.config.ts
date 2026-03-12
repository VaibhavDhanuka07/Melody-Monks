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
        base: "#F9FAFB",
        ink: "#111827",
        "ink-muted": "#6B7280",
        "brand-indigo": "#4F46E5",
        "brand-purple": "#7C3AED",
        "brand-amber": "#F59E0B",
        panel: "#FFFFFF",
        stroke: "#E5E7EB",
      },
      fontFamily: {
        display: ["var(--font-display)", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 14px 34px rgba(15, 23, 42, 0.12)",
        lift: "0 32px 60px rgba(15, 23, 42, 0.16)",
        glow: "0 16px 40px rgba(79, 70, 229, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.75" },
          "50%": { transform: "scale(1.04)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.8s ease-in-out infinite",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.16), transparent 48%), radial-gradient(circle at 80% 10%, rgba(124, 58, 237, 0.14), transparent 48%), radial-gradient(circle at 50% 80%, rgba(245, 158, 11, 0.12), transparent 46%)",
        "subtle-grid":
          "linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
