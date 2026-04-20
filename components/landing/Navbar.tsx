// Top navigation bar for the landing page with logo and CTA

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NAV, BRAND } from "@/lib/constants";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border-subtle" />
      <div className="relative flex w-full items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-1 group" aria-label="ClarityAI home">
          <span className="text-xl font-bold">
            <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              C
            </span>
            <span className="text-text-primary">larityAI</span>
          </span>
        </Link>

        <Link href={NAV.ctaHref}>
          <Button variant="secondary" size="sm">
            {NAV.cta}
          </Button>
        </Link>
      </div>
    </nav>
  );
}
