// Reusable Button primitive with multiple variants and sizes

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
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none rounded-xl";

    const variants = {
      primary:
        "bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-glow-purple hover:shadow-glow-brand hover:scale-[1.02] active:scale-[0.98]",
      secondary:
        "bg-surface-elevated border border-border text-text-primary hover:border-brand-purple hover:bg-surface",
      ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-elevated",
    };

    const sizes = {
      sm: "text-sm px-4 py-2 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-8 py-4 gap-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            <span>Processing…</span>
          </>
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
