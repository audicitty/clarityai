// Landing page: showcases ClarityAI with animated hero, trust signals, and CTA

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated mesh background orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
