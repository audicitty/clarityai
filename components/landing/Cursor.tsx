"use client";
import { useRef, useEffect } from "react";

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const lag = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const mv = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const ov = (e: MouseEvent) => {
      if ((e.target as Element).closest("button,a,input,textarea")) {
        if (ringRef.current) {
          ringRef.current.style.width = "52px";
          ringRef.current.style.height = "52px";
          ringRef.current.style.background = "oklch(88% 0.28 128 / 0.1)";
        }
      }
    };
    const ou = (e: MouseEvent) => {
      if ((e.target as Element).closest("button,a,input,textarea")) {
        if (ringRef.current) {
          ringRef.current.style.width = "34px";
          ringRef.current.style.height = "34px";
          ringRef.current.style.background = "transparent";
        }
      }
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseover", ov);
    window.addEventListener("mouseout", ou);

    let raf: number;
    const loop = () => {
      lag.current.x += (mouse.current.x - lag.current.x) * 0.1;
      lag.current.y += (mouse.current.y - lag.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = lag.current.x + "px";
        ringRef.current.style.top = lag.current.y + "px";
      }
      if (dotRef.current) {
        dotRef.current.style.left = mouse.current.x + "px";
        dotRef.current.style.top = mouse.current.y + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseover", ov);
      window.removeEventListener("mouseout", ou);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="c-ring"
        style={{ width: 34, height: 34, border: "1px solid var(--acid)", background: "transparent" }}
      />
      <div ref={dotRef} className="c-dot" />
    </>
  );
}
