"use client";
import { useRouter } from "next/navigation";
import { MagLink } from "./MagLink";

export function LandingNav() {
  const router = useRouter();
  return (
    <nav className="nav">
      <a href="/" className="nav-logo">CLARITY<em>AI</em></a>
      <div className="nav-links">
        <MagLink href="#process">Process</MagLink>
        <MagLink href="#outputs">Outputs</MagLink>
        <MagLink href="#demo-live">Demo</MagLink>
        <MagLink href="#pricing">Pricing</MagLink>
        <MagLink isBtn>
          <button className="btn-nav-cta" onClick={() => router.push("/signup")}>
            Get started
          </button>
        </MagLink>
      </div>
    </nav>
  );
}
