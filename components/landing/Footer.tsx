// Minimal footer for the landing page

import { FOOTER_CREDIT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative z-10 py-8 text-center">
      <p className="text-text-muted text-sm">{FOOTER_CREDIT}</p>
    </footer>
  );
}
