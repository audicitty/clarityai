// Landing page: animated hero, "How it works" section, footer

import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "ClarityAI — Turn chaos into clarity",
  description:
    "Paste meeting notes, brain dumps, or raw thoughts. Get TL;DR, action items, key decisions, and open questions in seconds. Powered by Gemini AI.",
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" aria-hidden="true" />

      {/* Animated mesh background orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Navbar />
      <Hero />
      <HowItWorks />
      <Footer />
    </div>
  );
}
