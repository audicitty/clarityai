"use client";
import { useReveal } from "./hooks/useReveal";

const ITEMS = [
  { n: "2.4s", l: "Average time\nto structured output" },
  { n: "0%",   l: "Data stored\nor retained — ever" },
  { n: "∞",    l: "Free clarifications\nno account needed" },
];

export function Stats() {
  const [ref, on] = useReveal(0.15);
  return (
    <section className="stats">
      <div ref={ref} className="stats-grid">
        {ITEMS.map((it, i) => (
          <div key={i} className={`stat${on ? " on" : ""}`} style={{ transitionDelay: `${i * 0.18}s` }}>
            <div className="stat-n">{it.n}</div>
            <div className="stat-l" style={{ whiteSpace: "pre-line" }}>{it.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
