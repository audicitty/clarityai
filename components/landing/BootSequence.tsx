"use client";
import { useState, useEffect } from "react";

function BootLine({ label }: { label: string }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        if (p >= 100) { clearInterval(id); return 100; }
        return Math.min(100, p + Math.random() * 20 + 8);
      });
    }, 32);
    return () => clearInterval(id);
  }, []);
  const filled = Math.floor((pct / 100) * 14);
  return (
    <div className="boot-line">
      <span className="boot-prompt">&gt;</span>
      <span className="boot-label">{label}...</span>
      <span
        className="boot-bar"
        style={{ color: pct >= 100 ? "var(--acid)" : "oklch(38% 0.08 128)" }}
      >
        [{"█".repeat(filled)}{"░".repeat(14 - filled)}] {Math.floor(pct)}%
      </span>
    </div>
  );
}

interface Props {
  onDone: () => void;
}

export function BootSequence({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("cai_booted")) {
      onDone();
      return;
    }
    const ts: [number, number][] = [[0,1],[250,2],[620,3],[980,4],[1340,5],[1700,6],[2300,7]];
    const timers = ts.map(([d, s]) => setTimeout(() => setStep(s), d));
    const exit = setTimeout(() => {
      setExiting(true);
      if (typeof window !== "undefined") sessionStorage.setItem("cai_booted", "1");
    }, 2900);
    const done = setTimeout(() => onDone(), 3600);
    return () => { [...timers, exit, done].forEach(clearTimeout); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => { setExiting(true); setTimeout(onDone, 700); };

  return (
    <div className={`boot${exiting ? " exit" : ""}`}>
      <div className="boot-inner">
        {step >= 1 && <div className="boot-title">CLARITY/AI v3.0</div>}
        {step >= 1 && <div className="boot-rule" />}
        {step >= 2 && <BootLine label="INITIALIZING CORE SYSTEM" />}
        {step >= 3 && <BootLine label="LOADING LANGUAGE INTELLIGENCE" />}
        {step >= 4 && <BootLine label="MOUNTING SIGNAL EXTRACTOR" />}
        {step >= 5 && <BootLine label="ENCRYPTING SESSION" />}
        {step >= 6 && (
          <div className="boot-ready">
            ● ALL SYSTEMS NOMINAL. CLARITY/AI READY.
            <span
              style={{
                display: "inline-block", width: 8, height: 14,
                background: "var(--acid)", verticalAlign: "text-bottom",
                marginLeft: 4, animation: "blink 1s step-end infinite",
              }}
            />
          </div>
        )}
      </div>
      {step >= 1 && (
        <button className="boot-skip" onClick={skip}>
          Skip intro
        </button>
      )}
    </div>
  );
}
