// Hero — editorial headline with cycling word-swap animation (Framer Motion)

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const CYCLING_WORDS = ["chaos", "noise", "meetings", "thoughts", "complexity"];
const WORD_DURATION = 2000;
const TRANSITION_MS = 300;

// Fixed width wide enough for the longest word so layout never shifts
const WORD_WIDTH = "w-[220px] sm:w-[280px] md:w-[340px]";

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % CYCLING_WORDS.length);
    }, WORD_DURATION + TRANSITION_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-20">
      {/* Eyebrow */}
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted mb-8">
        AI-Powered Intelligence
      </p>

      {/* Main headline */}
      <h1 className="font-serif font-bold text-ink leading-[1.08] text-[42px] sm:text-[56px] md:text-[72px]">
        <span className="block">Turn</span>

        {/* Animated word — fixed width container to prevent layout shift */}
        <span className={`relative inline-flex justify-center overflow-hidden ${WORD_WIDTH} h-[1.1em]`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={CYCLING_WORDS[index]}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: TRANSITION_MS / 1000, ease: "easeInOut" }}
              className="absolute font-serif font-bold italic text-ink-blue underline decoration-ink-blue decoration-2 underline-offset-4"
            >
              {CYCLING_WORDS[index]}
            </motion.span>
          </AnimatePresence>
        </span>

        <span className="block">into clarity.</span>
      </h1>

      {/* Subtext */}
      <p className="font-sans text-[17px] sm:text-lg text-ink-muted mt-8 max-w-[480px] leading-relaxed">
        Paste anything. Get structure, decisions, and actions in seconds.
      </p>

      {/* CTA */}
      <Link
        href="/app"
        className="mt-10 inline-block font-sans text-sm font-semibold bg-ink text-white px-8 py-4 hover:bg-ink-blue transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ink-blue focus-visible:outline-offset-2"
        style={{ borderRadius: "2px" }}
      >
        Start clarifying →
      </Link>

      {/* Trust line */}
      <p className="font-sans text-sm text-ink-faint mt-5 tracking-wide">
        Instant results · Nothing stored · Free to use
      </p>
    </section>
  );
}
