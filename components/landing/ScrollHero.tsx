"use client";
import { useRef, useState, useEffect } from "react";
import { Particles } from "./Particles";
import { SpringWord } from "./SpringWord";

const PHASES = [
  { word: "CHAOS",   color: "oklch(62% 0.22 25)",  clh: [62, 0.22, 25]  as [number,number,number], eye: "// This is what you start with",  sub: "Messy notes. Dense emails. Tangled thoughts." },
  { word: "NOISE",   color: "oklch(76% 0.18 55)",  clh: [76, 0.18, 55]  as [number,number,number], eye: "// Overwhelming. Unusable.",        sub: "Too much signal, not enough structure to act on." },
  { word: "SIGNAL",  color: "oklch(70% 0.18 195)", clh: [70, 0.18, 195] as [number,number,number], eye: "// Patterns are emerging.",         sub: "Something useful is hiding in there — we find it." },
  { word: "CLARITY", color: "oklch(88% 0.28 128)", clh: [88, 0.28, 128] as [number,number,number], eye: "// This is where you end up.",      sub: "Structured. Scannable. Ready to act on." },
];

interface Props {
  onNavigate: (url: string) => void;
}

export function ScrollHero({ onNavigate }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const prog = Math.max(0, Math.min(1, window.scrollY / total));
      setPhase(Math.min(3, Math.floor(prog * 4.1)));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const dispMap = document.getElementById("displace-map");
    if (!dispMap) return;
    const onMv = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top > 0) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = Math.min(28, dist * 0.06);
      dispMap.setAttribute("scale", String(scale));
    };
    window.addEventListener("mousemove", onMv);
    return () => window.removeEventListener("mousemove", onMv);
  }, []);

  const p = PHASES[phase];

  const scrollToDemo = () => {
    document.getElementById("demo-live")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToProcess = () => {
    document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
  };
  const skipToEnd = () => {
    const el = wrapRef.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetHeight - window.innerHeight + 10, behavior: "smooth" });
  };

  return (
    <div ref={wrapRef} className="sh-wrap" style={{ height: "350vh" }}>
      <div className="sh-sticky">
        <Particles colorLCH={p.clh} />
        <div className="sh-scan" style={{ color: p.color }} />
        <div className="crosshair" style={{ top: 80, left: 48 }} />
        <div className="crosshair" style={{ top: 80, right: 48 }} />

        <div className="sh-eyebrow" style={{ color: p.color }}>{p.eye}</div>

        <div style={{ filter: "url(#displace)" }}>
          <SpringWord key={phase} word={p.word} color={p.color} />
        </div>

        <div className="sh-line2" style={{ marginTop: 12 }}>INTO CLARITY</div>
        <p className="sh-sub">{p.sub}</p>

        {phase === 3 && (
          <div className="sh-actions" style={{ animation: "fadeUp .5s ease" }}>
            <button className="btn-hero" onClick={scrollToDemo}>Try it free →</button>
            <button className="btn-ghost" onClick={scrollToProcess}>How it works</button>
          </div>
        )}

        <div className="sh-phases">
          {PHASES.map((_, i) => (
            <div
              key={i}
              className={`sh-dot${phase === i ? " active" : ""}`}
              style={{ background: phase === i ? p.color : "var(--border)" }}
            />
          ))}
        </div>

        <div className="sh-meta">
          <div className="sh-meta-line">CLARITY/AI v3.0</div>
          <div className="sh-meta-line" style={{ color: p.color, marginTop: 6 }}>
            ● {["CHAOS", "NOISE", "SIGNAL", "CLARITY"][phase]}
          </div>
        </div>

        <button className="sh-skip" onClick={skipToEnd}>scroll to skip</button>
      </div>
    </div>
  );
}
