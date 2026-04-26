"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { clarifyText } from "@/actions/clarify";
import { sendChatMessage, type ChatMessage } from "@/actions/chat";
import type { ClarityOutput } from "@/lib/types";
import { Cursor } from "@/components/landing/Cursor";

type Phase = "idle" | "loading" | "done";

const OUT_CARDS = [
  { key: "tldr",         label: "TL;DR",          color: "var(--acid)",   field: "tldr" as const },
  { key: "actionItems",  label: "Action Items",    color: "var(--chrome)", field: "actionItems" as const },
  { key: "keyDecisions", label: "Key Decisions",   color: "var(--violet)", field: "keyDecisions" as const },
  { key: "openQuestions",label: "Open Questions",  color: "var(--amber)",  field: "openQuestions" as const },
];

function OutputCard({
  label, color, content,
}: {
  label: string;
  color: string;
  content: string | string[];
}) {
  return (
    <div className="out-card">
      <div className="out-card-label" style={{ "--label-color": color } as React.CSSProperties}>
        <span style={{ color }}>{label}</span>
      </div>
      <div className="out-card-body">
        {typeof content === "string" ? (
          content
        ) : (
          content.map((item, i) => (
            <div key={i} className="out-item">
              <div className="out-item-dot" />
              <span>{item}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ChatPanel({
  clarityOutput,
  originalText,
}: {
  clarityOutput: ClarityOutput;
  originalText: string;
}) {
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [msgs]);

  const send = async () => {
    if (!input.trim() || sending) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    const result = await sendChatMessage(input.trim(), msgs, clarityOutput, originalText);
    if (result.success) {
      setMsgs((m) => [...m, { role: "assistant", content: result.message }]);
    } else {
      setMsgs((m) => [...m, { role: "assistant", content: `// Error: ${result.error}` }]);
    }
    setSending(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); send(); }
  };

  return (
    <div className="chat-wrap" style={{ gridColumn: "1 / -1", marginTop: 1 }}>
      <div className="chat-label">// Ask about this content</div>
      {msgs.length > 0 && (
        <div className="chat-msgs" ref={msgsRef}>
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "chat-msg-user" : "chat-msg-ai"}>
              {m.role === "assistant" && (
                <div style={{ fontSize: 9, color: "var(--acid)", letterSpacing: ".14em", marginBottom: 4 }}>
                  CLARITY/AI
                </div>
              )}
              {m.content}
            </div>
          ))}
          {sending && (
            <div className="chat-msg-ai">
              <div style={{ fontSize: 9, color: "var(--acid)", letterSpacing: ".14em", marginBottom: 4 }}>CLARITY/AI</div>
              <span style={{ display: "inline-block", width: 8, height: 14, background: "var(--acid)", verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
            </div>
          )}
        </div>
      )}
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Ask a follow-up question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={sending}
        />
        <button className="chat-send" onClick={send} disabled={sending || !input.trim()}>
          Send →
        </button>
      </div>
    </div>
  );
}

export default function AppPage() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [output, setOutput] = useState<ClarityOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); handleClarify(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClarify]);

  const handleReset = () => { setText(""); setOutput(null); setError(null); setPhase("idle"); };

  return (
    <div className="app-wrap">
      <Cursor />
      <header className="app-header">
        <a href="/" className="app-logo">CLARITY<em>AI</em></a>
        {phase === "done" && (
          <button className="app-reset" onClick={handleReset}>← New input</button>
        )}
      </header>

      <main style={{ flex: 1, padding: "48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        {/* Input panel */}
        <div className="app-panel">
          <div className="app-panel-label">// Your Input</div>
          <textarea
            className="app-ta"
            placeholder="Paste meeting notes, emails, or any wall of text…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={phase === "loading"}
          />
          <div className="app-ta-bar">
            <span className="app-ta-hint">
              {text.length === 0
                ? "Paste anything"
                : `${text.length} chars · ⌘ Enter to clarify`}
            </span>
          </div>
          {error && <div className="app-err">// {error}</div>}
          <button
            className="btn-app-clarify"
            onClick={handleClarify}
            disabled={!text.trim() || phase === "loading"}
          >
            {phase === "loading" ? (
              <>
                <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "var(--bg)", margin: "0 2px", animation: "blink 1.2s 0s infinite" }} />
                <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "var(--bg)", margin: "0 2px", animation: "blink 1.2s 0.2s infinite" }} />
                <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "var(--bg)", margin: "0 2px", animation: "blink 1.2s 0.4s infinite" }} />
              </>
            ) : (
              "Clarify →"
            )}
          </button>
        </div>

        {/* Output panel */}
        <div className="app-panel" style={{ padding: 0 }}>
          {phase !== "done" || !output ? (
            <div className="out-empty">
              <div className="out-empty-text">
                {phase === "loading" ? "// processing…" : "// your clarity will appear here"}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)" }}>
              {OUT_CARDS.map((card) => {
                const value = output[card.field];
                return (
                  <OutputCard
                    key={card.key}
                    label={card.label}
                    color={card.color}
                    content={value}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Chat panel — full width below */}
        {phase === "done" && output && (
          <ChatPanel clarityOutput={output} originalText={text} />
        )}
      </main>
    </div>
  );
}
