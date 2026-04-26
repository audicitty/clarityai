"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BootSequence } from "./BootSequence";
import { Cursor } from "./Cursor";
import { LandingNav } from "./LandingNav";
import { ScrollHero } from "./ScrollHero";
import { Ticker } from "./Ticker";
import { ProcessStep } from "./ProcessStep";
import { BeforeAfter } from "./BeforeAfter";
import { Outputs } from "./Outputs";
import { Stats } from "./Stats";
import { Demo } from "./Demo";
import { Pricing } from "./Pricing";
import { FinalCTA } from "./FinalCTA";
import { LandingFooter } from "./LandingFooter";

export function LandingPage() {
  const [booted, setBooted] = useState(false);
  const [wiping, setWiping] = useState(false);
  const router = useRouter();

  const navigate = useCallback((url: string) => {
    setWiping(true);
    setTimeout(() => router.push(url), 420);
  }, [router]);

  return (
    <>
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      <div className={`page-wipe${wiping ? " in out" : ""}`} />
      <Cursor />

      <svg className="svg-filter-defs" aria-hidden="true">
        <defs>
          <filter id="displace" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence id="turbulence" type="turbulence" baseFrequency="0.018" numOctaves="3" result="noise" seed="5" />
            <feDisplacementMap id="displace-map" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <LandingNav />
      <ScrollHero onNavigate={navigate} />
      <Ticker />

      <section id="process">
        <ProcessStep num="01" label="Step 01 — Input"   title="PASTE ANYTHING"     desc="Drop in meeting notes, long emails, dense documents, or tangled thoughts. No formatting required — the messier, the better." />
        <ProcessStep num="02" label="Step 02 — Process" title="AI EXTRACTS SIGNAL" desc="The model reads context, identifies structure, separates signal from noise. Deterministic output, no hallucinations, sub-three-second turnaround." even />
        <ProcessStep num="03" label="Step 03 — Output"  title="ACT ON CLARITY"     desc="TL;DR, action items, key decisions, open questions — all separated, scannable, and ready to ship into Notion, Slack, or your inbox." />
      </section>

      <BeforeAfter />
      <Outputs />
      <Stats />
      <Demo />
      <Pricing />
      <FinalCTA />
      <LandingFooter />
    </>
  );
}
