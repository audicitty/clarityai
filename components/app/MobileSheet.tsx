// Mobile bottom sheet: shows output cards + chat in a slide-up overlay on small screens

"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { OutputCards } from "@/components/app/OutputCards";
import { ChatPanel } from "@/components/app/ChatPanel";
import type { ClarityOutput } from "@/lib/types";

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  output: ClarityOutput;
  originalText: string;
}

export function MobileSheet({ isOpen, onClose, output, originalText }: MobileSheetProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl border-t border-border max-h-[90dvh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Your clarity results"
          >
            {/* Drag handle + close */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
              <div className="w-10 h-1 rounded-full bg-border mx-auto absolute left-1/2 -translate-x-1/2 top-3" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Your Clarity
              </p>
              <button
                onClick={onClose}
                aria-label="Close results"
                className="size-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-5 pb-8 space-y-6 scrollbar-thin">
              <OutputCards output={output} />
              <ChatPanel clarityOutput={output} originalText={originalText} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
