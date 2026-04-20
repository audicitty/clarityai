// Hero section of the landing page with animated headline and CTA

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BRAND, TRUST_PILLS, HERO_BADGE, NAV } from "@/lib/constants";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 text-center">
      {/* Badge */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="mb-8"
      >
        <Badge variant="subtle" className="animate-pulse-glow">
          <span aria-hidden="true">✦</span>
          {HERO_BADGE}
        </Badge>
      </motion.div>

      {/* Headline */}
      <motion.h1
        custom={0.1}
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-[72px] max-w-3xl"
      >
        <span className="text-text-primary block">{BRAND.taglinePrefix}</span>
        <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent block">
          {BRAND.taglineSuffix}
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        custom={0.2}
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="mt-6 text-lg text-text-secondary max-w-xl leading-relaxed"
      >
        {BRAND.description}
      </motion.p>

      {/* CTA Button */}
      <motion.div
        custom={0.3}
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="mt-10"
      >
        <Link href={NAV.ctaHref}>
          <Button
            variant="primary"
            size="lg"
            className="relative overflow-hidden group"
          >
            <span className="relative z-10">Try ClarityAI free →</span>
            {/* Shimmer overlay */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
              aria-hidden="true"
            />
          </Button>
        </Link>
      </motion.div>

      {/* Trust Pills */}
      <motion.div
        custom={0.4}
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
      >
        {TRUST_PILLS.map((pill, index) => (
          <span
            key={index}
            className="flex items-center gap-1.5 text-sm text-text-muted"
          >
            <span aria-hidden="true">{pill.icon}</span>
            {pill.label}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
