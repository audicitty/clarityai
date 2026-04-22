// Card — white surface, 1px warm border, sharp 4px radius, subtle shadow

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

function Card({ elevated = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-white border border-warm-border",
        elevated ? "shadow-card-hover" : "shadow-card",
        className
      )}
      style={{ borderRadius: "4px" }}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-3 border-b border-warm-border", className)} {...props}>
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
