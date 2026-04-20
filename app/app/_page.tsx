// App page client component — two-column on desktop, bottom sheet on mobile

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, XCircle } from "lucide-react";
import { TextInput } from "@/components/app/TextInput";
import { OutputCards } from "@/components/app/OutputCards";
import { ChatPanel } from "@/components/app/ChatPanel";
import { MobileSheet } from "@/components/app/MobileSheet";
import { Button } from "@/components/ui/Button";
import { clarifyText } from "@/actions/clarify";
import type { ClarityOutput } from "@/lib/types";

type AppPhase = "idle" | "loading" | "done";

const ERROR_CLEAR_MS = 4000;

// ─── Empty state illustration ─────────────────────────────────────────────────

function EmptyStateIllustration() {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-32 h-24 opacity-30"
      aria-hidden="true"
    >
      {/* Card outline */}
      <rect x="8" y="8" width="144" height="104" rx="10" stroke="#2A2A3A" strokeWidth="1.5" />
      {/* Section divider */}
      <line x1="8" y1="36" x2="152" y2="36" stroke="#2A2A3A" strokeWidth="1" />
      {/* Header dot + bar */}
      <circle cx="22" cy="22" r="4" fill="#3A2A5E" />
      <rect x="32" y="18" width="48" height="8" rx="4" fill="#2A2A3A" />
      {/* Body lines */}
      <rect x="20" y="48" width="88" height="6" rx="3" fill="#2A2A3A" />
      <rect x="20" y="60" width="64" height="6" rx="3" fill="#2A2A3A" />
      <rect x="20" y="72" width="76" height="6" rx="3" fill="#2A2A3A" />
      <rect x="20" y="84" width="52" height="6" rx="3" fill="#2A2A3A" />
      {/* Sparkle accent */}
      <circle cx="130" cy="22" r="3" fill="#4F46E5" opacity="0.6" />
      <circle cx="140" cy="16" r="2" fill="#7C3AED" opacity="0.4" />
    </svg>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function AppPage() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [output, setOutput] = useState<ClarityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Auto-clear errors after 4 s
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), ERROR_CLEAR_MS);
    return () => clearTimeout(t);
  }, [error]);

  const handleClarify = useCallback(async () => {
    if (phase === "loading") return;
    setError(null);
    setPhase("loading");

    const result = await clarifyText(text);

    if (result.success) {
      setOutput(result.data);
      setPhase("done");
    } else {
      setError(result.error);
      setPhase("idle");
    }
  }, [text, phase]);

  // Cmd/Ctrl+Enter global shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleClarify();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClarify]);

  function handleReset() {
    setText("");
    setOutput(null);
    setError(null);
    setPhase("idle");
    setSheetOpen(false);
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Top bar */}
      <header className="shrink-0 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold" aria-label="ClarityAI home">
            <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              C
            </span>
            <span className="text-text-primary">larityAI</span>
          </Link>
          {phase === "done" && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              ← New input
            </Button>
          )}
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Left: Input Panel ──────────────────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Your Input
            </label>

            <TextInput value={text} onChange={setText} disabled={phase === "loading"} />

            {/* Inline error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 text-sm text-red-400"
                  role="alert"
                >
                  <XCircle className="size-4 shrink-0" aria-hidden="true" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="primary"
              size="lg"
              onClick={handleClarify}
              isLoading={phase === "loading"}
              disabled={!text.trim() || phase === "loading"}
              className="w-full"
            >
              {phase === "loading" ? "Analyzing…" : "Clarify →"}
            </Button>

            <p className="text-xs text-text-muted text-center flex items-center justify-center gap-1.5">
              <Sparkles className="size-3" aria-hidden="true" />
              Powered by Gemini
              <span className="text-text-muted/50">·</span>
              <kbd className="font-sans text-[10px] px-1 py-0.5 rounded border border-border bg-surface-elevated text-text-muted">
                ⌘ Enter
              </kbd>
            </p>
          </section>

          {/* ── Right: Output Panel (desktop only) ────────────────────────── */}
          <section className="hidden lg:flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {phase !== "done" || !output ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center justify-center min-h-[420px] rounded-2xl border border-dashed border-border text-center px-8 gap-4"
                >
                  <EmptyStateIllustration />
                  <p className="text-sm text-text-muted">
                    Your clarity will appear here
                  </p>
                  <p className="text-xs text-text-muted/60">
                    Paste something on the left and hit Clarify
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                    Your Clarity
                  </p>
                  <OutputCards output={output} />
                  <ChatPanel clarityOutput={output} originalText={text} />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* ── Mobile: "See Results" trigger button ─────────────────────────── */}
        <AnimatePresence>
          {phase === "done" && output && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30"
            >
              <button
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-glow-brand hover:shadow-glow-brand hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                See your clarity ↑
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Mobile bottom sheet ───────────────────────────────────────────── */}
      {output && (
        <MobileSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          output={output}
          originalText={text}
        />
      )}
    </div>
  );
}
