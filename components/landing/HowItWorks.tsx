// "How it works" section on the landing page — 3 steps with icons

"use client";

import { motion } from "framer-motion";
import { ClipboardList, Cpu, CheckSquare } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Paste",
    description:
      "Drop in any messy text — meeting notes, Slack threads, brain dumps, or raw thoughts. No formatting needed.",
    iconColor: "text-brand-purple-light",
    borderColor: "border-brand-purple/30",
    bgColor: "bg-brand-purple/10",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Analyze",
    description:
      "Gemini AI reads your content and extracts the signal — summarizing, categorizing, and surfacing what matters.",
    iconColor: "text-brand-blue-light",
    borderColor: "border-brand-blue/30",
    bgColor: "bg-brand-blue/10",
  },
  {
    icon: CheckSquare,
    step: "03",
    title: "Act",
    description:
      "Get a TL;DR, action items, key decisions, and open questions — then chat to dig deeper into anything.",
    iconColor: "text-indigo-300",
    borderColor: "border-brand-indigo/30",
    bgColor: "bg-brand-indigo/10",
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export function HowItWorks() {
  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
            How it works
          </p>
          <h2 className="text-3xl font-bold text-text-primary">
            Three steps to clarity
          </h2>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              className={`relative rounded-2xl border ${step.borderColor} bg-surface p-6 flex flex-col gap-4`}
            >
              {/* Step number */}
              <span className="text-xs font-bold text-text-muted tracking-widest absolute top-5 right-5">
                {step.step}
              </span>

              {/* Icon */}
              <div className={`size-10 rounded-xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center`}>
                <step.icon className={`size-5 ${step.iconColor}`} aria-hidden="true" />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
