// Reusable Card container with consistent surface styling

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

function Card({ elevated = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border shadow-card",
        elevated ? "bg-surface-elevated" : "bg-surface",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-4 border-b border-border-subtle", className)} {...props}>
      {children}
    </div>
  );
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardContent };
export type { CardProps };
