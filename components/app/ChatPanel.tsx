// Chat panel — editorial style, ink bubbles, Playfair header, typing dots

"use client";

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
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
    if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
      className="border-t border-warm-border mt-4"
    >
      {/* Header */}
      <div className="py-4">
        <h2 className="font-serif text-lg italic text-ink">Ask a follow-up</h2>
      </div>

      {/* Messages */}
      <div className="h-[300px] overflow-y-auto space-y-3 scrollbar-thin pb-2">
        {messages.length === 0 && !isLoading && (
          <p className="font-sans text-sm text-ink-faint italic pt-4">
            Ask anything about the content above…
          </p>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              {msg.role === "user" ? (
                <div
                  className="max-w-[78%] bg-ink text-white px-4 py-2.5 font-sans text-sm leading-relaxed"
                  style={{ borderRadius: "2px" }}
                >
                  {msg.content}
                </div>
              ) : (
                <div
                  className="max-w-[84%] bg-surface-white border border-warm-border px-4 py-2.5 font-sans text-sm text-ink leading-relaxed shadow-card"
                  style={{ borderRadius: "2px" }}
                >
                  {msg.content}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div
              className="bg-surface-white border border-warm-border px-4 py-3 shadow-card flex items-center gap-1"
              style={{ borderRadius: "2px" }}
            >
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </motion.div>
        )}

        {error && (
          <p className="font-sans text-xs text-red-600 pt-1">{error}</p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center pt-3 border-t border-warm-border mt-3"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a follow-up…"
          disabled={isLoading}
          className="flex-1 bg-cream border border-warm-border px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors duration-150 disabled:opacity-50"
          style={{ borderRadius: "2px" }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="shrink-0 bg-ink text-white font-sans text-sm font-semibold px-5 py-2.5 hover:bg-ink-blue transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-ink-blue focus-visible:outline-offset-2"
          style={{ borderRadius: "2px" }}
        >
          Send →
        </button>
      </form>
    </motion.div>
  );
}
