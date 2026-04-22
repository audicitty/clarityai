// Tailwind configuration — Editorial Newspaper design system for ClarityAI

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        cream: "#F9F7F2",
        ink: "#111111",
        "ink-blue": "#1B3A6B",
        "ink-blue-hover": "#142D56",
        // Neutrals
        "warm-border": "#D4CFC4",
        "warm-border-light": "#E8E4DC",
        "ink-muted": "#666666",
        "ink-faint": "#999999",
        "ink-subtle": "#444444",
        // Surfaces
        "surface-white": "#FFFFFF",
        "surface-cream": "#F9F7F2",
        "surface-tinted": "#F3F0E8",
        // Legacy aliases (keeps server actions / non-UI files compiling)
        background: "#F9F7F2",
        surface: "#FFFFFF",
        "surface-elevated": "#F3F0E8",
        border: "#D4CFC4",
        "border-subtle": "#E8E4DC",
        "text-primary": "#111111",
        "text-secondary": "#444444",
        "text-muted": "#666666",
        // Keep old brand tokens so any stray reference doesn't break build
        "brand-purple": "#1B3A6B",
        "brand-blue": "#1B3A6B",
        "brand-indigo": "#1B3A6B",
        "brand-purple-light": "#1B3A6B",
        "brand-blue-light": "#1B3A6B",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        // Keep geist vars so layout.tsx still works
        geist: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        "geist-mono": ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "1.4", letterSpacing: "0.05em" }],
      },
      letterSpacing: {
        editorial: "0.18em",
      },
      borderRadius: {
        sharp: "2px",
        card: "4px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
        "card-hover": "0 2px 8px rgba(0,0,0,0.12)",
        // Legacy — keeps old code building
        "glow-purple": "none",
        "glow-blue": "none",
        "glow-brand": "none",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "pulse-dot": "pulseDot 1.2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 80%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "40%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
