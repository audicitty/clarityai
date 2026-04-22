// Textarea — Playfair Display font, cream bg, warm border, paper-like feel

"use client";

import { useRef, useEffect, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER =
  "Paste your meeting notes, brain dump, or raw thoughts here...";

const MAX_CHARS = 10_000;

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TextInput({ value, onChange, disabled = false }: TextInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 300)}px`;
  }, [value]);

  const isOverLimit = value.length > MAX_CHARS;
  const charColor =
    isOverLimit ? "text-red-600" : value.length > MAX_CHARS * 0.9 ? "text-amber-600" : "text-ink-faint";

  return (
    <div className="relative w-full">
      <textarea
        ref={ref}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={PLACEHOLDER}
        rows={10}
        className={cn(
          "w-full resize-none bg-cream border px-5 py-4 pb-8",
          "font-serif text-[15px] text-ink placeholder:text-ink-faint placeholder:font-serif placeholder:italic",
          "leading-[1.8] tracking-normal",
          "focus:outline-none focus:ring-0 transition-colors duration-150",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "scrollbar-thin min-h-[300px]",
          isOverLimit
            ? "border-red-400"
            : "border-warm-border focus:border-ink"
        )}
        style={{ borderRadius: "2px" }}
      />
      <span
        className={cn(
          "absolute bottom-3 right-4 font-sans text-[11px] tabular-nums select-none",
          charColor
        )}
      >
        {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
      </span>
    </div>
  );
}
