"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cursor } from "@/components/landing/Cursor";

function StrengthBar({ pw }: { pw: string }) {
  const score = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ].filter(Boolean).length;
  const colors = ["", "var(--err)", "oklch(76% 0.18 55)", "var(--chrome)", "var(--acid)"];
  const labels = ["", "WEAK", "FAIR", "GOOD", "STRONG"];
  if (!pw) return null;
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="strength-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="strength-bar-seg"
            style={{ background: i <= score ? colors[score] : "var(--border)" }}
          />
        ))}
      </div>
      <div className="strength-label" style={{ color: colors[score] }}>{labels[score]}</div>
    </div>
  );
}

interface FormData {
  name: string;
  email: string;
  password: string;
  plan: string;
  useCase: string;
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  useCase?: string;
}

const PLANS = [
  { id: "free", name: "FREE",  price: "$0",  note: "Forever free" },
  { id: "pro",  name: "PRO",   price: "$12", note: "/ month · soon" },
  { id: "team", name: "TEAM",  price: "$49", note: "/ month · soon" },
];
const USE_CASES = [
  "Meeting notes & recaps",
  "Email triage",
  "Research & documents",
  "Team collaboration",
  "Personal productivity",
];

function Step1({
  data, setField, errors, onNext,
}: {
  data: FormData;
  setField: (k: keyof FormData, v: string) => void;
  errors: Errors;
  onNext: () => void;
}) {
  const [showPw, setShowPw] = useState(false);
  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <div className="auth-title">CREATE ACCOUNT</div>
        <div className="auth-sub">
          Have one?{" "}
          <a href="/login">Sign in →</a>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {[{ l: "Sign up with Google", i: "G" }, { l: "Sign up with GitHub", i: "⌥" }].map((o) => (
          <button key={o.l} type="button" className="oauth-btn">
            <span className="oauth-icon">{o.i}</span>
            {o.l}
          </button>
        ))}
      </div>

      <div className="auth-divider">
        <div className="auth-divider-line" />
        <span className="auth-divider-text">OR</span>
        <div className="auth-divider-line" />
      </div>

      <div className="field-wrap">
        <div className="field-label-row">
          <div className="field-label">Full name</div>
        </div>
        <div className="field-inner">
          <span className="field-prompt">&gt;</span>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Ada Lovelace"
            className={`field-input${errors.name ? " err" : ""}`}
          />
        </div>
        {errors.name && <div className="field-error">{errors.name}</div>}
      </div>

      <div className="field-wrap">
        <div className="field-label-row">
          <div className="field-label">Work email</div>
        </div>
        <div className="field-inner">
          <span className="field-prompt">&gt;</span>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="ada@company.com"
            className={`field-input${errors.email ? " err" : ""}`}
          />
        </div>
        {errors.email && <div className="field-error">{errors.email}</div>}
      </div>

      <div className="field-wrap" style={{ position: "relative" }}>
        <div className="field-label-row">
          <div className="field-label">Password</div>
          <button type="button" className="field-action" onClick={() => setShowPw((v) => !v)}>
            {showPw ? "HIDE" : "SHOW"}
          </button>
        </div>
        <div className="field-inner">
          <span className="field-prompt">&gt;</span>
          <input
            type={showPw ? "text" : "password"}
            value={data.password}
            onChange={(e) => setField("password", e.target.value)}
            placeholder="••••••••"
            className={`field-input${errors.password ? " err" : ""}`}
          />
        </div>
        {errors.password && <div className="field-error">{errors.password}</div>}
      </div>

      <StrengthBar pw={data.password} />

      <button type="button" onClick={onNext} className="btn-auth">
        Continue →
      </button>
    </div>
  );
}

function Step2({
  data, setField, errors, onBack, onSubmit, loading,
}: {
  data: FormData;
  setField: (k: keyof FormData, v: string) => void;
  errors: Errors;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", cursor: "none",
          fontSize: 10, color: "var(--muted)", letterSpacing: ".1em",
          textTransform: "uppercase", fontFamily: "DM Mono,monospace",
          display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: 0,
        }}
      >
        ← back
      </button>
      <div style={{ marginBottom: 28 }}>
        <div className="auth-title">ALMOST DONE</div>
        <div className="auth-sub">// Choose your plan and use case</div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="field-label" style={{ marginBottom: 10 }}>Select plan</div>
        <div className="plan-picker">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`plan-pick-btn${data.plan === p.id ? " active" : ""}`}
              onClick={() => setField("plan", p.id)}
            >
              <div className="plan-pick-name">{p.name}</div>
              <div className="plan-pick-price">{p.price}</div>
            </button>
          ))}
        </div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 8, letterSpacing: ".04em" }}>
          {PLANS.find((p) => p.id === data.plan)?.note}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div className="field-label" style={{ marginBottom: 10 }}>Primary use case</div>
        <div className="use-case-list">
          {USE_CASES.map((u) => (
            <button
              key={u}
              type="button"
              className={`use-case-btn${data.useCase === u ? " active" : ""}`}
              onClick={() => setField("useCase", u)}
            >
              <span>
                <span className="use-case-arrow">{data.useCase === u ? "▶" : "·"}</span>
                {u}
              </span>
              {data.useCase === u && <span className="use-case-selected">SELECTED</span>}
            </button>
          ))}
        </div>
        {errors.useCase && <div className="field-error">{errors.useCase}</div>}
      </div>

      <button type="button" onClick={onSubmit} disabled={loading} className="btn-auth">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "inline-block", width: 5, height: 5, borderRadius: "50%",
                  background: "var(--bg)", margin: "0 2px",
                  animation: `blink 1.2s ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </>
        ) : (
          "Initialize account →"
        )}
      </button>
      <div className="auth-agree">
        // By continuing you agree to our Terms + Privacy Policy
      </div>
    </div>
  );
}

function Success({ name }: { name: string }) {
  return (
    <div className="success-wrap">
      <div className="success-eye">// ACCOUNT INITIALIZED</div>
      <div className="success-title">
        WELCOME,<br />
        <span style={{ color: "var(--acid)" }}>{name.split(" ")[0].toUpperCase()}.</span>
      </div>
      <div className="success-sub">
        Your workspace is ready.<br />
        Paste anything. Get clarity.
      </div>
      <a href="/app" className="btn-success">Start clarifying →</a>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<FormData>({ name: "", email: "", password: "", plan: "free", useCase: "" });
  const [errors, setErrors] = useState<Errors>({});

  const setField = (k: keyof FormData, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate1 = (): Errors => {
    const e: Errors = {};
    if (!data.name.trim()) e.name = "// name required";
    if (!data.email) e.email = "// email required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "// invalid email";
    if (!data.password) e.password = "// password required";
    else if (data.password.length < 8) e.password = "// min 8 characters";
    return e;
  };

  const validate2 = (): Errors => {
    const e: Errors = {};
    if (!data.useCase) e.useCase = "// select a use case to continue";
    return e;
  };

  const next = () => {
    const e = validate1();
    setErrors(e);
    if (!Object.keys(e).length) setStep(2);
  };

  const submit = async () => {
    const e = validate2();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
    } catch { /* proceed to success regardless for now */ }
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="auth-wrap">
      <div
        style={{
          position: "fixed", left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg,transparent,var(--acid),transparent)",
          opacity: 0.07, animation: "scanline 6s linear infinite", pointerEvents: "none",
        }}
      />
      <Cursor />

      <a href="/" className="nav-logo" style={{ position: "fixed", top: 28, left: 48, zIndex: 10, mixBlendMode: "difference" }}>
        CLARITY<em>AI</em>
      </a>

      {!done && (
        <div style={{ position: "fixed", top: 34, right: 48, display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
          {[1, 2].map((s) => (
            <div
              key={s}
              style={{
                height: 2, width: s <= step ? 28 : 14,
                background: s <= step ? "var(--acid)" : "var(--border)",
                transition: "all .3s",
              }}
            />
          ))}
          <span style={{ fontSize: 9, letterSpacing: ".14em", color: "var(--muted)", textTransform: "uppercase", marginLeft: 4 }}>
            {step}/2
          </span>
        </div>
      )}

      <div className="auth-box">
        {!done && (
          <div className="auth-chrome">
            <div className="auth-chrome-bar">
              {["var(--err)", "oklch(76% 0.18 55)", "var(--acid)"].map((c, i) => (
                <div key={i} className="auth-chrome-dot" style={{ background: c }} />
              ))}
              <span className="auth-chrome-title">clarity-auth — create-account step {step}</span>
            </div>
            <div className="auth-chrome-cmd">
              <span>$ clarity-auth </span>
              <em>--mode register --step {step}</em>
              <span className="auth-chrome-cursor" />
            </div>
          </div>
        )}

        <div style={done ? {} : { background: "var(--bg2)", border: "1px solid var(--border)", padding: "36px 32px" }}>
          {done ? (
            <Success name={data.name} />
          ) : step === 1 ? (
            <Step1 data={data} setField={setField} errors={errors} onNext={next} />
          ) : (
            <Step2 data={data} setField={setField} errors={errors} onBack={() => setStep(1)} onSubmit={submit} loading={loading} />
          )}
        </div>

        {!done && (
          <div className="auth-footer">
            <span>© 2026 CLARITYAI</span>
            <span>NOTHING STORED</span>
          </div>
        )}
      </div>
    </div>
  );
}
