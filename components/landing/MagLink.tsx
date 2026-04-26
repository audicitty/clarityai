"use client";
import { useRef, useEffect, ReactNode } from "react";

interface Props {
  children: ReactNode;
  href?: string;
  isBtn?: boolean;
  onClick?: () => void;
}

export function MagLink({ children, href, isBtn, onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMv = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      ref.current.style.transform = d < 72 ? `translate(${dx * 0.28}px,${dy * 0.28}px)` : "";
    };
    window.addEventListener("mousemove", onMv);
    return () => window.removeEventListener("mousemove", onMv);
  }, []);

  return (
    <div ref={ref} className="mag-wrap">
      {isBtn ? (
        children
      ) : onClick ? (
        <span className="nav-a" onClick={onClick} style={{ cursor: "none" }}>
          {children}
        </span>
      ) : (
        <a href={href} className="nav-a">
          {children}
        </a>
      )}
    </div>
  );
}
