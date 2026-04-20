// Chat panel: ask follow-up questions about the structured content
// Slides up on first render, maintains full conversation history

"use client";

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "@/actions/chat";
import type { ClarityOutput } from "@/lib/types";

interface ChatPanelProps {
  clarityOutput: ClarityOutput;
  originalText: string;
}

export function ChatPanel({ clarityOutput, originalText }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError(null);

    const result = await sendChatMessage(trimmed, messages, clarityOutput, originalText);

    if (result.success) {
      setMessages((prev) => [...prev, { role: "assistant", content: result.message }]);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-border bg-surface flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span
            className="size-2 rounded-full bg-brand-purple animate-pulse-glow shrink-0"
            aria-hidden="true"
          />
          <div>
            <h2 className="text-sm font-semibold text-text-primary leading-none">
              Chat with your content
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Ask anything about what you pasted
            </p>
          </div>
        </div>
      </div>

      {/* Message area — fixed 300px height */}
      <div className="h-[300px] overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin">
        {messages.length === 0 && !isLoading && (
          <p className="text-sm text-text-muted italic text-center mt-10">
            Ask a follow-up about the content above…
          </p>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  msg.role === "user"
                    ? "max-w-[78%] rounded-2xl rounded-br-sm bg-gradient-to-r from-brand-purple to-brand-blue px-4 py-2.5 text-sm text-white leading-relaxed"
                    : "max-w-[84%] rounded-2xl rounded-bl-sm bg-surface-elevated border border-border px-4 py-2.5 text-sm text-text-secondary leading-relaxed"
                }
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="rounded-2xl rounded-bl-sm bg-surface-elevated border border-border px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 rounded-full bg-text-muted animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-border-subtle flex gap-2 items-center"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a follow-up…"
          disabled={isLoading}
          className="flex-1 rounded-xl bg-surface-elevated border border-border px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple/50 transition-colors duration-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          className="shrink-0 size-9 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue flex items-center justify-center text-white transition-all duration-200 hover:shadow-glow-purple hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Send className="size-3.5" aria-hidden="true" />
        </button>
      </form>
    </motion.div>
  );
}
