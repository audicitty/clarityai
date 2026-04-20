// Tailwind configuration with ClarityAI custom design tokens

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
        background: "#0A0A0F",
        surface: "#13131A",
        "surface-elevated": "#1C1C26",
        border: "#2A2A3A",
        "border-subtle": "#1E1E2E",
        "text-primary": "#F0F0FF",
        "text-secondary": "#9090B0",
        "text-muted": "#5A5A78",
        "brand-purple": "#7C3AED",
        "brand-blue": "#3B82F6",
        "brand-indigo": "#4F46E5",
        "brand-purple-light": "#A78BFA",
        "brand-blue-light": "#93C5FD",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
        "gradient-brand-subtle":
          "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.15) 100%)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "glow-purple": "0 0 24px rgba(124, 58, 237, 0.4)",
        "glow-blue": "0 0 24px rgba(59, 130, 246, 0.4)",
        "glow-brand": "0 0 40px rgba(124, 58, 237, 0.3), 0 0 80px rgba(59, 130, 246, 0.2)",
        card: "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(42,42,58,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
