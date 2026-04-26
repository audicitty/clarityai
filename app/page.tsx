import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "ClarityAI — Turn chaos into clarity",
  description: "Paste meeting notes, brain dumps, or raw thoughts. Get TL;DR, action items, key decisions, and open questions in seconds.",
};

export default function Home() {
  return <LandingPage />;
}
