"use client";
import { useState } from "react";
import { useReveal } from "./hooks/useReveal";

interface PlanProps {
  name: string;
  price: string;
  cadence: string;
  features: string[];
  badge?: string;
  ft?: boolean;
  cta: "start" | "waitlist";
  color: string;
  delay: number;
}

function Plan({ name, price, cadence, features, badge, ft, cta, color, delay }: PlanProps) {
  const [ref, on] = useReveal(0.1);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const scrollToDemo = () => {
    document.getElementById("demo-live")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={ref}
      className={`plan${ft ? " ft" : ""}${on ? " on" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {badge && <div className="plan-badge">{badge}</div>}
      <div className="plan-bar">
        <div className="plan-d" style={{ background: color }} />
        <div className="plan-d" style={{ background: "var(--border)" }} />
        <div className="plan-d" style={{ background: "var(--border)" }} />
        <span className="plan-name">{name}</span>
      </div>
      <div className="plan-price">
        {price === "0" ? "FREE" : <><sup>$</sup>{price}</>}
      </div>
      <div className="plan-cad">{cadence}</div>
      <div className="plan-div" />
      <div className="plan-feats">
        {features.map((f, i) => (
          <div key={i} className="plan-feat">
            <span className="plan-arr">&gt;</span>
            <span>{f}</span>
          </div>
        ))}
      </div>
      {cta === "start" && (
        <button className="btn-plan btn-pg" onClick={scrollToDemo}>Start now →</button>
      )}
      {cta === "waitlist" && (
        joined ? (
          <div style={{ fontSize: 10, color: "var(--acid)", letterSpacing: ".08em", padding: "12px 0" }}>
            // You&apos;re on the list.
          </div>
        ) : (
          <div className="plan-wl">
            <input
              className="plan-em"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="plan-ws" onClick={() => email && setJoined(true)}>
              Join →
            </button>
          </div>
        )
      )}
    </div>
  );
}

export function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="pr-hd">
        <div className="pr-eye">// Pricing</div>
        <div className="pr-title">SIMPLE,<br />HONEST PRICING.</div>
      </div>
      <div className="pr-grid">
        <Plan
          name="FREE" price="0" cadence="forever — no card"
          color="var(--muted)" ft={false} cta="start" delay={0}
          features={["Unlimited clarifications","TL;DR + action items","Key decisions extracted","Open questions flagged","Nothing stored, ever"]}
        />
        <Plan
          name="PRO" price="12" cadence="per month, billed annually"
          color="var(--acid)" badge="COMING SOON" ft={true} cta="waitlist" delay={0.1}
          features={["Everything in Free","Export to Notion / MD / PDF","Custom output templates","30-day history + search","Priority processing speed"]}
        />
        <Plan
          name="TEAM" price="49" cadence="per month, up to 10 seats"
          color="var(--chrome)" ft={false} cta="waitlist" delay={0.2}
          features={["Everything in Pro","Shared workspace + history","Slack & Linear integration","Admin controls + audit log","Dedicated support channel"]}
        />
      </div>
    </section>
  );
}
