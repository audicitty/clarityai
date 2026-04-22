// Landing page — editorial newspaper aesthetic

import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "ClarityAI — Turn chaos into clarity",
  description:
    "Paste meeting notes, brain dumps, or raw thoughts. Get TL;DR, action items, key decisions, and open questions in seconds.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Footer />
    </div>
  );
}
