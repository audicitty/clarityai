// App page — editorial layout, two-column desktop, bottom sheet mobile

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TextInput } from "@/components/app/TextInput";
import { OutputCards } from "@/components/app/OutputCards";
import { ChatPanel } from "@/components/app/ChatPanel";
import { MobileSheet } from "@/components/app/MobileSheet";
import { clarifyText } from "@/actions/clarify";
import type { ClarityOutput } from "@/lib/types";

type AppPhase = "idle" | "loading" | "done";

export default function AppPage() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [output, setOutput] = useState<ClarityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Auto-clear errors
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 4000);
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

  // Cmd/Ctrl + Enter shortcut
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
    setText(""); setOutput(null); setError(null);
    setPhase("idle"); setSheetOpen(false);
  }

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col">
      {/* Top bar */}
      <header className="shrink-0 border-b border-warm-border bg-cream">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold text-ink">
            ClarityAI
          </Link>
          {phase === "done" && (
            <button
              onClick={handleReset}
              className="font-sans text-sm text-ink-muted hover:text-ink transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ink-blue"
            >
              ← New input
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left: Input ───────────────────────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-editorial text-ink-muted">
              Your Input
            </p>

            <TextInput value={text} onChange={setText} disabled={phase === "loading"} />

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="err"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-sans text-sm text-red-600"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Clarify button */}
            <button
              onClick={handleClarify}
              disabled={!text.trim() || phase === "loading"}
              className="w-full bg-ink text-white font-sans text-sm font-semibold py-3.5 hover:bg-ink-blue transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-ink-blue focus-visible:outline-offset-2"
              style={{ borderRadius: "2px" }}
            >
              {phase === "loading" ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="flex gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                  Analysing…
                </span>
              ) : (
                "Clarify →"
              )}
            </button>

            <p className="font-sans text-[11px] text-ink-faint text-center">
              Powered by Gemini
              <span className="mx-2 opacity-40">·</span>
              <kbd className="font-sans text-[10px] px-1.5 py-0.5 border border-warm-border bg-surface-tinted text-ink-faint" style={{ borderRadius: "2px" }}>
                ⌘ Enter
              </kbd>
            </p>
          </section>

          {/* ── Right: Output (desktop) ───────────────────────────────────── */}
          <section className="hidden lg:flex flex-col gap-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-editorial text-ink-muted">
              Your Clarity
            </p>

            <AnimatePresence mode="wait">
              {phase !== "done" || !output ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center min-h-[420px] border border-dashed border-warm-border"
                  style={{ borderRadius: "4px" }}
                >
                  <p className="font-serif italic text-ink-faint text-base">
                    Your clarity will appear here.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <OutputCards output={output} />
                  <ChatPanel clarityOutput={output} originalText={text} />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* ── Mobile: "See results" floating button ───────────────────────── */}
        <AnimatePresence>
          {phase === "done" && output && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed bottom-6 left-0 right-0 flex justify-center z-30"
            >
              <button
                onClick={() => setSheetOpen(true)}
                className="bg-ink text-white font-sans text-sm font-semibold px-8 py-3 hover:bg-ink-blue transition-colors duration-150 shadow-card focus-visible:outline-2 focus-visible:outline-ink-blue"
                style={{ borderRadius: "2px" }}
              >
                See your clarity ↑
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile sheet */}
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
