// Navbar — cream background, Playfair logo, editorial nav links

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-warm-border">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl font-bold text-ink" aria-label="ClarityAI home">
          ClarityAI
        </Link>

        {/* Right nav */}
        <div className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="hidden sm:block font-sans text-sm text-ink-muted hover:text-ink transition-colors duration-150"
          >
            How it works
          </a>
          <Link
            href="/app"
            className="font-sans text-sm font-semibold bg-ink text-white px-4 py-2 hover:bg-ink-blue transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ink-blue focus-visible:outline-offset-2"
            style={{ borderRadius: "2px" }}
          >
            Try it free
          </Link>
        </div>
      </div>
    </nav>
  );
}
