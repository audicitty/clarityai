"use client";
import { useState, useEffect } from "react";

const SAMPLE = `Had a long team sync today. Sarah said we need to finalize the Q2 roadmap by Friday. John raised concerns about the API rate limits affecting our enterprise customers — this is blocking two deals. We decided to deprioritize the dark mode feature and focus on stability. Still unclear who owns the migration docs. Budget for the new design tool was approved. Engineering to assess the rate limit fix by Wednesday; marketing to update the investor deck before Thursday's call.`;

interface DemoResult {
  tldr: string;
  actions: string[];
  decisions: string[];
  questions: string[];
}

function Typewriter({ text, speed = 18 }: { text: string; speed?: number }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      if (i >= text.length) { clearInterval(id); return; }
      setOut(text.slice(0, ++i));
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span>
      {out}
      {out.length < text.length && (
        <span className="term-blink" style={{ width: 5, height: 11 }} />
      )}
    </span>
  );
}

function TwItem({ text, delay = 0, speed = 18 }: { text: string; delay?: number; speed?: number }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGo(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return go ? <Typewriter text={text} speed={speed} /> : null;
}

export function Demo() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<DemoResult | null>(null);
  const [err, setErr] = useState("");

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setRes(null);
    setErr("");
    try {
      const r = await fetch("/api/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await r.json();
      if (data.error) { setErr(data.error); }
      else { setRes(data); }
    } catch {
      setErr("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section className="demo" id="demo-live">
      <div className="demo-inner">
        <div className="demo-eye">// Live demo — no account needed</div>
        <div className="demo-title">PASTE ANYTHING.<br />GET CLARITY NOW.</div>
        <textarea
          className="demo-ta"
          placeholder="Drop in meeting notes, emails, or any wall of text…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="demo-bar">
          <span className="demo-hint">
            {text.length === 0 ? (
              <span className="demo-link" onClick={() => setText(SAMPLE)} style={{ cursor: "none" }}>
                → load sample text
              </span>
            ) : (
              `${text.length} chars`
            )}
          </span>
          <button className="btn-clarify" onClick={run} disabled={loading || !text.trim()}>
            {loading ? (
              <>
                <span className="l-dot" />
                <span className="l-dot" style={{ animationDelay: ".2s" }} />
                <span className="l-dot" style={{ animationDelay: ".4s" }} />
              </>
            ) : (
              "Clarify →"
            )}
          </button>
        </div>

        {err && (
          <div style={{ fontSize: 11, color: "var(--err)", marginBottom: 16, letterSpacing: ".04em" }}>
            // {err}
          </div>
        )}

        <div className={`demo-res${res ? " on" : ""}`}>
          {res && (
            <>
              <div className="demo-rc" style={{ gridColumn: "1/-1", borderBottom: "1px solid var(--border)" }}>
                <div className="demo-rl">TL;DR</div>
                <div className="demo-rb"><Typewriter text={res.tldr} /></div>
              </div>
              <div className="demo-rc" style={{ borderRight: "1px solid var(--border)" }}>
                <div className="demo-rl">Actions</div>
                <div className="demo-rb">
                  {(res.actions || []).map((a, i) => (
                    <div key={i} className="demo-ri">
                      <div className="demo-rbt" />
                      <TwItem text={a} delay={i * 320} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="demo-rc">
                <div className="demo-rl">Decisions</div>
                <div className="demo-rb">
                  {(res.decisions || []).map((d, i) => (
                    <div key={i} className="demo-ri">
                      <div className="demo-rbt" />
                      <TwItem text={d} delay={i * 320 + 160} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="demo-rc" style={{ gridColumn: "1/-1", borderTop: "1px solid var(--border)" }}>
                <div className="demo-rl">Open Questions</div>
                <div className="demo-rb">
                  {(res.questions || []).map((q, i) => (
                    <div key={i} className="demo-ri">
                      <div className="demo-rbt" style={{ background: "var(--muted)" }} />
                      <TwItem text={q} delay={i * 400 + 800} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
