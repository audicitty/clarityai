// How it works — editorial section with large numerals and scroll-triggered animations

"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Paste anything",
    description:
      "Drop in meeting notes, Slack threads, a brain dump, or raw thoughts. No formatting required.",
  },
  {
    num: "02",
    title: "AI structures it",
    description:
      "Gemini reads your content and extracts the signal — TL;DR, actions, decisions, and open questions.",
  },
  {
    num: "03",
    title: "Act on it",
    description:
      "Copy the structured output, share it with your team, or chat with your content to dig deeper.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top rule */}
        <hr className="rule" />

        {/* Section title */}
        <div className="py-8 text-center">
          <h2 className="font-serif text-4xl font-bold text-ink">How it works</h2>
        </div>

        {/* Bottom rule */}
        <hr className="rule" />

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
              className={`py-10 px-8 ${i < 2 ? "md:border-r border-warm-border" : ""}`}
            >
              {/* Big editorial number */}
              <p className="font-serif text-[64px] font-bold text-warm-border leading-none mb-4 select-none">
                {step.num}
              </p>
              <h3 className="font-serif text-xl font-semibold text-ink mb-3">
                {step.title}
              </h3>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom rule */}
        <hr className="rule" />
      </div>
    </section>
  );
}
