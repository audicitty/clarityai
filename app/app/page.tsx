// Main clarify page: two-column layout with input panel and output panel

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, XCircle, LayoutTemplate } from "lucide-react";
import { TextInput } from "@/components/app/TextInput";
import { OutputCards } from "@/components/app/OutputCards";
import { ChatPanel } from "@/components/app/ChatPanel";
import { Button } from "@/components/ui/Button";
import { clarifyText } from "@/actions/clarify";
import type { ClarityOutput } from "@/lib/types";

type AppPhase = "idle" | "loading" | "done";

const ERROR_CLEAR_MS = 4000;

export default function AppPage() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [output, setOutput] = useState<ClarityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-clear errors after 4 seconds
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

  function handleReset() {
    setText("");
    setOutput(null);
    setError(null);
    setPhase("idle");
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

      {/* Main two-column layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── Left: Input Panel ────────────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <label className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Your Input
            </label>

            <TextInput
              value={text}
              onChange={setText}
              disabled={phase === "loading"}
            />

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

            {/* Clarify button */}
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
              Powered by Claude
            </p>
          </section>

          {/* ── Right: Output Panel ───────────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {phase !== "done" || !output ? (
                /* Empty state */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border border-dashed border-border text-center px-8 gap-4"
                >
                  <LayoutTemplate
                    className="size-10 text-text-muted opacity-40"
                    aria-hidden="true"
                    strokeWidth={1.25}
                  />
                  <p className="text-sm text-text-muted">
                    Your clarity will appear here
                  </p>
                </motion.div>
              ) : (
                /* Output cards */
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-6"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
                      Your Clarity
                    </p>
                    <OutputCards output={output} />
                  </div>

                  <ChatPanel clarityOutput={output} originalText={text} />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}
