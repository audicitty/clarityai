// Reusable Badge component for labels and status indicators

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "subtle" | "outline";
}

function Badge({ variant = "outline", className, children, ...props }: BadgeProps) {
  const variants = {
    brand:
      "bg-gradient-to-r from-brand-purple to-brand-blue text-white",
    subtle:
      "bg-gradient-brand-subtle text-brand-purple-light border border-brand-purple/30",
    outline:
      "border border-border text-text-secondary bg-surface",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps };
