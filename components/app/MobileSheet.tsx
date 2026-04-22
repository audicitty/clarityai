// Mobile bottom sheet — cream surface, editorial styling

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
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ink/30"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-cream border-t border-warm-border max-h-[90dvh] flex flex-col rounded-t-none"
            role="dialog"
            aria-modal="true"
            aria-label="Your clarity results"
          >
            {/* Handle + header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-warm-border shrink-0">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-editorial text-ink-muted">
                Your Clarity
              </p>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1 text-ink-muted hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-ink-blue"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-5 pb-10 pt-5 space-y-6 scrollbar-thin">
              <OutputCards output={output} />
              <ChatPanel clarityOutput={output} originalText={originalText} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
