"use client";

const ITEMS = [
  "TL;DR in seconds","Action items extracted","Decisions surfaced",
  "Open questions flagged","Nothing stored, ever","No account required",
  "Any text — any length","Spring letter physics",
];

export function Ticker() {
  const all = [...ITEMS, ...ITEMS];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {all.map((t, i) => (
          <div key={i} className="ticker-item">
            <div className="ticker-gem" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
