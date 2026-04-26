"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useReveal } from "./hooks/useReveal";

const RAW = `Had a long team sync today. Sarah said we need to finalize the Q2 roadmap by Friday. John raised concerns about the API rate limits affecting our enterprise customers — this is blocking two deals. We decided to deprioritize the dark mode feature and focus on stability. Still unclear who owns the migration docs. Budget for the new design tool was approved. Next step: engineering to assess the rate limit fix by Wednesday, and marketing to update the deck before Thursday's investor call.`;

export function BeforeAfter() {
  const [split, setSplit] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [revealRef, on] = useReveal(0.1);

  const updateSplit = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setSplit(Math.max(5, Math.min(95, ((e.clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const onMv = (e: MouseEvent) => { if (dragging.current) updateSplit(e); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMv);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMv);
      window.removeEventListener("mouseup", onUp);
    };
  }, [updateSplit]);

  return (
    <section className="baf">
      <div className="baf-hd">
        <div className="baf-eye">// The transformation</div>
        <div className="baf-title">BEFORE.<br />AFTER.<br />DRAG TO SEE.</div>
      </div>
      <div
        ref={(el) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className="baf-wrap"
        style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: "opacity .7s,transform .7s" }}
        onMouseDown={(e) => { dragging.current = true; updateSplit(e.nativeEvent); }}
      >
        <div className="baf-panel baf-l" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <div className="baf-plabel">// BEFORE — raw input</div>
          <div className="baf-text">{RAW}</div>
        </div>
        <div className="baf-panel baf-r" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
          <div className="baf-plabel">// AFTER — clarity extracted</div>
          <div className="baf-out">
            <div className="baf-out-section">
              <div className="baf-out-label">TL;DR</div>
              Team synced on Q2 roadmap (Fri). API rate limit blocking 2 deals. Dark mode cut for stability.
            </div>
            <div className="baf-out-section">
              <div className="baf-out-label">Actions</div>
              {["> [eng] Rate limit patch → Wed", "> [mktg] Investor deck → Thu", "> [pm]  Lock roadmap → Fri"].map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
            <div className="baf-out-section">
              <div className="baf-out-label">Open Questions</div>
              {["? Who owns migration docs?", "? Enterprise API fix timeline?"].map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="baf-divider-line" style={{ left: `${split}%` }}>
          <div className="baf-handle">⟷</div>
        </div>
      </div>
    </section>
  );
}
