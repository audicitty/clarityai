// Chat panel for asking follow-up questions about the structured content

"use client";

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { sendChatMessage, type ChatMessage } from "@/actions/chat";
import type { ClarityOutput } from "@/lib/types";
import { CHAT_PLACEHOLDER, CHAT_SEND_LABEL } from "@/lib/constants";

interface ChatPanelProps {
  clarityOutput: ClarityOutput;
  originalText: string;
}

const messageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function ChatPanel({ clarityOutput, originalText }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
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
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <Card className="flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-subtle flex items-center gap-2">
        <span className="size-2 rounded-full bg-brand-purple animate-pulse-glow" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-text-primary">Ask a follow-up</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <p className="text-sm text-text-muted italic text-center mt-8">
            Ask anything about the content above…
          </p>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  msg.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-r from-brand-purple to-brand-blue px-4 py-3 text-sm text-white"
                    : "max-w-[85%] rounded-2xl rounded-bl-sm bg-surface-elevated border border-border px-4 py-3 text-sm text-text-secondary"
                }
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-start"
          >
            <div className="rounded-2xl rounded-bl-sm bg-surface-elevated border border-border px-4 py-3">
              <div className="flex gap-1 items-center">
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

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-5 py-4 border-t border-border-subtle flex gap-3 items-end"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={CHAT_PLACEHOLDER}
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple/50 transition-colors duration-200 disabled:opacity-50 max-h-32 overflow-y-auto"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isLoading}
          disabled={!input.trim()}
          aria-label="Send message"
        >
          {CHAT_SEND_LABEL}
        </Button>
      </form>
    </Card>
  );
}
