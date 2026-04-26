"use client";
import { useRouter } from "next/navigation";

export function LandingFooter() {
  const router = useRouter();
  return (
    <footer className="footer">
      <div className="footer-logo">CLARITY<em>AI</em></div>
      <div className="footer-nav">
        <a href="#" onClick={(e) => { e.preventDefault(); router.push("/login"); }}>Sign in</a>
        <a href="#" onClick={(e) => { e.preventDefault(); router.push("/signup"); }}>Sign up</a>
        <a href="#">Privacy</a>
      </div>
      <div className="footer-copy">© 2026 · Nothing stored · Free forever</div>
    </footer>
  );
}
