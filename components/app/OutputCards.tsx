// Output cards — editorial style, staggered entrance, mobile accordion

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ClarityOutput } from "@/lib/types";
import { useToast } from "@/lib/toast-context";
import { cn } from "@/lib/utils";

interface OutputCardsProps {
  output: ClarityOutput;
}

interface CardConfig {
  key: keyof ClarityOutput;
  label: string;
  emptyMessage: string;
}

const CARD_CONFIGS: CardConfig[] = [
  { key: "tldr",         label: "TL;DR",           emptyMessage: "No summary available." },
  { key: "actionItems",  label: "Action Items",     emptyMessage: "No action items identified." },
  { key: "keyDecisions", label: "Key Decisions",    emptyMessage: "No key decisions identified." },
  { key: "openQuestions",label: "Open Questions",   emptyMessage: "No open questions identified." },
];

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = useCallback(async () => {
    if (!text || copied) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  }, [text, copied, showToast]);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : `${label} to clipboard`}
      className="font-sans text-[11px] uppercase tracking-editorial text-ink-muted hover:text-ink transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ink-blue focus-visible:outline-offset-2"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Single output card ───────────────────────────────────────────────────────

interface OutputCardProps {
  config: CardConfig;
  content: string | string[];
  delay: number;
}

function OutputCard({ config, content, delay }: OutputCardProps) {
  const [open, setOpen] = useState(true);
  const isList = Array.isArray(content);
  const isEmpty = isList ? (content as string[]).length === 0 : !content;

  const copyText = isList
    ? (content as string[]).map((x, i) => `${i + 1}. ${x}`).join("\n")
    : (content as string);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: "easeOut" }}
      className="bg-surface-white border border-warm-border shadow-card"
      style={{ borderRadius: "4px" }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-warm-border">
        {/* Mobile: clickable to accordion toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-left flex-1 focus-visible:outline-none"
          aria-expanded={open}
        >
          <span className="font-sans text-[10px] font-semibold uppercase tracking-editorial text-ink-subtle">
            {config.label}
          </span>
          {isList && (content as string[]).length > 0 && (
            <span className="font-sans text-[10px] text-ink-faint tabular-nums">
              ({(content as string[]).length})
            </span>
          )}
          {/* Chevron — only visible on mobile */}
          <ChevronDown
            className={cn(
              "size-3.5 text-ink-faint ml-auto transition-transform duration-200 sm:hidden",
              open ? "rotate-180" : "rotate-0"
            )}
            aria-hidden="true"
          />
        </button>

        {/* Copy button — desktop always visible, mobile only when open */}
        {!isEmpty && (
          <div className={cn("ml-4 shrink-0", open ? "block" : "hidden sm:block")}>
            <CopyBtn text={copyText} />
          </div>
        )}
      </div>

      {/* Content — accordion on mobile, always open on desktop */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4">
              {isEmpty ? (
                <p className="font-sans text-sm text-ink-faint italic">{config.emptyMessage}</p>
              ) : isList ? (
                <ul className="space-y-2.5">
                  {(content as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-[14px] text-ink leading-[1.8]">
                      <span className="mt-[0.55em] w-1 h-1 rounded-full bg-ink-muted shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-sans text-[14px] text-ink leading-[1.8]">{content as string}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

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
    <div className="space-y-3">
      {CARD_CONFIGS.map((config, index) => (
        <OutputCard
          key={config.key}
          config={config}
          content={output[config.key]}
          delay={index * 0.08}
        />
      ))}

      {/* Copy all */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="flex justify-end pt-1"
      >
        <CopyBtn text={allText} label="Copy all" />
      </motion.div>
    </div>
  );
}
