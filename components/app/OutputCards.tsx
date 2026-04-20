// Structured output display: TL;DR, Action Items, Key Decisions, Open Questions
// Each card has a copy button; a "Copy All" button is shown below the grid.

"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Lightbulb, HelpCircle, Copy, Check } from "lucide-react";
import type { ClarityOutput } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OutputCardsProps {
  output: ClarityOutput;
}

// ─── Card config ──────────────────────────────────────────────────────────────

interface CardConfig {
  key: keyof ClarityOutput;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  borderClass: string;
  iconClass: string;
  emptyMessage: string;
}

const CARD_CONFIGS: CardConfig[] = [
  {
    key: "tldr",
    label: "TL;DR",
    Icon: Target,
    borderClass: "border-brand-purple/40 hover:border-brand-purple/70",
    iconClass: "text-brand-purple-light",
    emptyMessage: "No summary available.",
  },
  {
    key: "actionItems",
    label: "Action Items",
    Icon: CheckCircle2,
    borderClass: "border-brand-blue/40 hover:border-brand-blue/70",
    iconClass: "text-brand-blue-light",
    emptyMessage: "No action items identified.",
  },
  {
    key: "keyDecisions",
    label: "Key Decisions",
    Icon: Lightbulb,
    borderClass: "border-brand-indigo/40 hover:border-brand-indigo/70",
    iconClass: "text-indigo-300",
    emptyMessage: "No key decisions identified.",
  },
  {
    key: "openQuestions",
    label: "Open Questions",
    Icon: HelpCircle,
    borderClass: "border-violet-500/40 hover:border-violet-500/70",
    iconClass: "text-violet-300",
    emptyMessage: "No open questions identified.",
  },
];

// ─── Copy hook ────────────────────────────────────────────────────────────────

function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  }, [timeout]);

  return { copied, copy };
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ text, className }: { text: string; className?: string }) {
  const { copied, copy } = useCopy();

  return (
    <button
      onClick={() => copy(text)}
      title={copied ? "Copied!" : "Copy"}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      className={cn(
        "flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all duration-150",
        "text-text-muted hover:text-text-primary hover:bg-surface-elevated",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-purple",
        className
      )}
    >
      {copied ? (
        <Check className="size-3 text-green-400" aria-hidden="true" />
      ) : (
        <Copy className="size-3" aria-hidden="true" />
      )}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

// ─── Individual card ──────────────────────────────────────────────────────────

interface OutputCardProps {
  config: CardConfig;
  content: string | string[];
  delay: number;
}

function OutputCard({ config, content, delay }: OutputCardProps) {
  const { Icon, label, borderClass, iconClass, emptyMessage } = config;
  const isList = Array.isArray(content);
  const isEmpty = isList ? content.length === 0 : !content;

  const copyText = isList
    ? content.map((item, i) => `${i + 1}. ${item}`).join("\n")
    : (content as string);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      className={cn(
        "group rounded-2xl bg-surface border transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-card",
        borderClass
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Icon className={cn("size-4 shrink-0", iconClass)} aria-hidden="true" />
          <span className="text-sm font-semibold text-text-primary">{label}</span>
          {isList && content.length > 0 && (
            <span className="text-xs text-text-muted tabular-nums">({content.length})</span>
          )}
        </div>
        {!isEmpty && <CopyButton text={copyText} />}
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {isEmpty ? (
          <p className="text-sm text-text-muted italic">{emptyMessage}</p>
        ) : isList ? (
          <ul className="space-y-2.5">
            {(content as string[]).map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
                <span
                  className={cn("mt-2 size-1.5 rounded-full shrink-0", iconClass, "opacity-70")}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-secondary leading-relaxed">{content as string}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function OutputCards({ output }: OutputCardsProps) {
  const allText = [
    `TL;DR:\n${output.tldr}`,
    output.actionItems.length
      ? `Action Items:\n${output.actionItems.map((x, i) => `${i + 1}. ${x}`).join("\n")}`
      : null,
    output.keyDecisions.length
      ? `Key Decisions:\n${output.keyDecisions.map((x, i) => `${i + 1}. ${x}`).join("\n")}`
      : null,
    output.openQuestions.length
      ? `Open Questions:\n${output.openQuestions.map((x, i) => `${i + 1}. ${x}`).join("\n")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {CARD_CONFIGS.map((config, index) => (
          <OutputCard
            key={config.key}
            config={config}
            content={output[config.key]}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Copy All */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="flex justify-end"
      >
        <CopyButton
          text={allText}
          className="px-3 py-1.5 text-sm border border-border rounded-xl hover:border-brand-purple/40"
        />
      </motion.div>
    </div>
  );
}
