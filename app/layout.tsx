// Root layout — editorial aesthetic, Inter + Playfair via Google Fonts in CSS

import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/lib/toast-context";

export const metadata: Metadata = {
  title: {
    default: "ClarityAI — Turn chaos into clarity",
    template: "%s | ClarityAI",
  },
  description:
    "Paste meeting notes, brain dumps, or raw thoughts. Get structure, decisions, and actions in seconds.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "ClarityAI — Turn chaos into clarity",
    description:
      "Paste meeting notes, brain dumps, or raw thoughts. Get structure, decisions, and actions in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
