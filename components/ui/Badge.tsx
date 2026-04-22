// Badge — outlined editorial tag, uppercase micro-text, no fill

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "blue" | "brand" | "subtle" | "outline";
}

function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border border-warm-border px-2 py-0.5",
        "font-sans text-2xs font-medium uppercase tracking-editorial text-ink-muted",
        className
      )}
      style={{ borderRadius: "2px" }}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps };
