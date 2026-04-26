"use client";
import { useReveal } from "./hooks/useReveal";

interface Props {
  num: string;
  label: string;
  title: string;
  desc: string;
  even?: boolean;
}

export function ProcessStep({ num, label, title, desc, even }: Props) {
  const [ref, on] = useReveal(0.18);
  return (
    <div className={`step${even ? " step-even" : ""}`} ref={ref}>
      <div className="step-bg-num">{num}</div>
      <div
        className="step-content"
        style={{
          opacity: on ? 1 : 0,
          transform: on ? "none" : "translateX(-36px)",
          transition: "opacity .75s ease,transform .75s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div className="step-eye">
          <span />
          {label}
        </div>
        <div className="step-title">{title}</div>
        <div className="step-desc">{desc}</div>
      </div>
    </div>
  );
}
