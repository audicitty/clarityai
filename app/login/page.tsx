"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cursor } from "@/components/landing/Cursor";

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (!email) errs.email = "// email required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "// invalid email format";
    if (!password) errs.password = "// password required";
    else if (password.length < 8) errs.password = "// min 8 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push("/app"), 1200);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ general: data.error || "// invalid credentials" });
      }
    } catch {
      setErrors({ general: "// connection error, please try again" });
    }
    setLoading(false);
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
      <div style={{ position: "fixed", top: 34, right: 48, fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--muted)", zIndex: 10 }}>
        <span style={{ color: "var(--acid)" }}>●</span> SECURE SESSION
      </div>

      {done ? (
        <div style={{ textAlign: "center", animation: "fadeUp .5s ease" }}>
          <div className="success-title" style={{ fontSize: 64, marginBottom: 16 }}>
            ACCESS<br />GRANTED
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".1em", marginBottom: 32 }}>
            // Redirecting to workspace…
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "inline-block", width: 5, height: 5, borderRadius: "50%",
                  background: "var(--acid)", animation: `blink 1.2s ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="auth-box" style={{ animation: "fadeUp .4s ease" }}>
          <div className="auth-chrome">
            <div className="auth-chrome-bar">
              {["var(--err)", "oklch(76% 0.18 55)", "var(--acid)"].map((c, i) => (
                <div key={i} className="auth-chrome-dot" style={{ background: c }} />
              ))}
              <span className="auth-chrome-title">clarity-auth — sign-in</span>
            </div>
            <div className="auth-chrome-cmd">
              <span>$ clarity-auth </span>
              <em>--mode login</em>
              <span className="auth-chrome-cursor" />
            </div>
          </div>

          <form onSubmit={submit} className="auth-form">
            <div style={{ marginBottom: 32 }}>
              <div className="auth-title">SIGN IN</div>
              <div className="auth-sub">
                No account?{" "}
                <a href="/signup">Create one →</a>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
              {[{ l: "Continue with Google", i: "G" }, { l: "Continue with GitHub", i: "⌥" }].map((o) => (
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
                <div className="field-label">Email address</div>
              </div>
              <div className="field-inner">
                <span className="field-prompt">&gt;</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={`field-input${errors.email ? " err" : ""}`}
                />
              </div>
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="field-wrap">
              <div className="field-label-row">
                <div className="field-label">Password</div>
                <button type="button" className="field-action" onClick={() => setShowPass((v) => !v)}>
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
              <div className="field-inner">
                <span className="field-prompt">&gt;</span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`field-input${errors.password ? " err" : ""}`}
                />
              </div>
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
              <a href="#" style={{ fontSize: 10, letterSpacing: ".06em", color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: 3, cursor: "none" }}>
                Forgot password?
              </a>
            </div>

            {errors.general && (
              <div className="field-error" style={{ marginBottom: 16 }}>{errors.general}</div>
            )}

            <button type="submit" disabled={loading} className="btn-auth">
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
                "Authenticate →"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <span>© 2026 CLARITYAI</span>
            <span>NOTHING STORED</span>
          </div>
        </div>
      )}
    </div>
  );
}
