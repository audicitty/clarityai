"use client";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      {children}
    </div>
  );
}
