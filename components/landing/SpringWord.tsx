"use client";
import { useRef, useEffect } from "react";

interface Props {
  word: string;
  color: string;
}

export function SpringWord({ word, color }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const springs = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);

  useEffect(() => {
    springs.current = word.split("").map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
  }, [word]);

  useEffect(() => {
    const onMv = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      const spans = wrapRef.current.querySelectorAll<HTMLSpanElement>(".s-letter");
      spans.forEach((span, i) => {
        const r = span.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          const f = (130 - d) / 130;
          springs.current[i].vx += (dx / d) * f * 5;
          springs.current[i].vy += (dy / d) * f * 5;
        }
      });
    };
    window.addEventListener("mousemove", onMv);

    let raf: number;
    const loop = () => {
      if (wrapRef.current) {
        const spans = wrapRef.current.querySelectorAll<HTMLSpanElement>(".s-letter");
        springs.current.forEach((s, i) => {
          s.vx += -s.x * 0.12;
          s.vy += -s.y * 0.12;
          s.vx *= 0.8;
          s.vy *= 0.8;
          s.x += s.vx;
          s.y += s.vy;
          if (spans[i]) spans[i].style.transform = `translate(${s.x}px,${s.y}px)`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMv);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="spring-word">
      {word.split("").map((c, i) => (
        <span key={i} className="s-letter" style={{ color }}>
          {c}
        </span>
      ))}
    </div>
  );
}
