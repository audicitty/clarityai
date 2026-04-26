"use client";
import { useReveal } from "./hooks/useReveal";

const CARDS = [
  {
    color: "var(--acid)", label: "TL;DR",
    lines: [
      { p: "> summarize --mode terse" },
      { o: "Team aligned on Q2 deadline (Fri)." },
      { o: "API rate limit blocking 2 deals." },
      { o: "Dark mode cut; stability first." },
    ],
  },
  {
    color: "var(--chrome)", label: "Action Items",
    lines: [
      { p: "> extract --type actions" },
      { o: "[eng]  Rate limit patch → Wed" },
      { o: "[mktg] Investor deck → Thu" },
      { o: "[pm]   Roadmap lock → Fri" },
    ],
  },
  {
    color: "var(--violet)", label: "Key Decisions",
    lines: [
      { p: "> extract --type decisions" },
      { o: "✓ Dark mode — deprioritized Q2" },
      { o: "✓ Design tool budget — approved" },
      { o: "✓ Roadmap deadline — confirmed" },
    ],
  },
  {
    color: "var(--amber)", label: "Open Questions",
    lines: [
      { p: "> extract --type questions" },
      { o: "? Who owns migration docs?" },
      { o: "? Enterprise API fix timeline?" },
      { cursor: true },
    ],
  },
];

export function Outputs() {
  const [ref, on] = useReveal(0.08);
  return (
    <section className="outputs" id="outputs">
      <div className="out-hd">
        <div className="out-eye">// Output format</div>
        <div className="out-title">FOUR OUTPUTS.<br />ZERO NOISE.</div>
      </div>
      <div ref={ref} className="out-grid">
        {CARDS.map((c, i) => (
          <div key={i} className={`term${on ? " on" : ""}`} style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="term-bar">
              <div className="term-dot" style={{ background: c.color }} />
              <div className="term-dot" style={{ background: "var(--border)" }} />
              <div className="term-dot" style={{ background: "var(--border)" }} />
              <span className="term-name">{c.label}</span>
            </div>
            <div className="term-body">
              {c.lines.map((l, j) => (
                <div key={j}>
                  {"p" in l && l.p && <span className="term-prompt">{l.p}</span>}
                  {"o" in l && l.o && <span className="term-out">{l.o}</span>}
                  {"cursor" in l && l.cursor && (
                    <span className="term-prompt">_ <span className="term-blink" /></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
