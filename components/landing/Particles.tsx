"use client";
import { useRef, useEffect } from "react";

interface Props {
  colorLCH: [number, number, number];
}

export function Particles({ colorLCH }: Props) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const clr = useRef(colorLCH);
  clr.current = colorLCH;

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const onMv = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMv);

    const N = 68;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const [l, c, hue] = clr.current;
      pts.forEach((p) => {
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) { p.vx += (dx / d) * 0.02; p.vy += (dy / d) * 0.02; }
        p.vx *= 0.975; p.vy *= 0.975;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      });
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `oklch(${l}% ${c} ${hue} / ${(1 - d / 120) * 0.12})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(${l}% ${c} ${hue} / 0.3)`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMv);
    };
  }, []);

  return (
    <canvas
      ref={cvs}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
