// Button — ink-on-paper editorial style, sharp corners, no gradients

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", isLoading = false, className, children, disabled, ...props },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-sans font-semibold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-ink-blue focus-visible:outline-offset-2 disabled:opacity-40 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-ink text-white hover:bg-ink-blue active:opacity-80",
      secondary:
        "bg-transparent border border-warm-border text-ink hover:border-ink hover:bg-surface-tinted",
      ghost:
        "bg-transparent text-ink-muted hover:text-ink hover:bg-surface-tinted",
    };

    const sizes = {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-sm px-7 py-3.5 gap-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        style={{ borderRadius: "2px" }}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="flex gap-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </span>
            <span>Analysing…</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
