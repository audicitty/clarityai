// Auto-growing textarea where users paste raw, unstructured content

"use client";

import { useRef, useEffect, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER =
  "Paste anything — meeting notes, a brain dump, a problem, raw thoughts...";

const MAX_CHARS = 10_000;

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TextInput({ value, onChange, disabled = false }: TextInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-grow: reset height to auto then set to scrollHeight
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
  }

  const isOverLimit = value.length > MAX_CHARS;
  const charColor = isOverLimit
    ? "text-red-400"
    : value.length > MAX_CHARS * 0.9
      ? "text-amber-400"
      : "text-text-muted";

  return (
    <div className="relative w-full">
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={PLACEHOLDER}
        rows={8}
        className={cn(
          "w-full resize-none rounded-2xl bg-surface border px-5 py-4 pb-8",
          "font-mono text-sm text-text-primary placeholder:text-text-muted",
          "leading-relaxed tracking-tight",
          "focus:outline-none focus:ring-2 transition-colors duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "scrollbar-thin min-h-[200px]",
          isOverLimit
            ? "border-red-500/60 focus:ring-red-500/30 focus:border-red-500/60"
            : "border-border focus:ring-brand-purple/40 focus:border-brand-purple/50"
        )}
      />
      {/* Character counter — always visible */}
      <span
        className={cn(
          "absolute bottom-3 right-4 text-xs tabular-nums select-none",
          charColor
        )}
      >
        {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
      </span>
    </div>
  );
}
