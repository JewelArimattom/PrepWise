"use client";

import { useEffect, useRef } from "react";

const CursorGlow = () => {
  const rafId = useRef<number>(0);
  const pos = useRef({ x: -200, y: -200 });
  const rendered = useRef({ x: -200, y: -200 });

  useEffect(() => {
    /* ── primary glow ── */
    const primary = document.createElement("div");
    primary.className = "cursor-glow cursor-glow--primary";
    document.body.appendChild(primary);

    /* ── secondary (trailing) glow ── */
    const trail = document.createElement("div");
    trail.className = "cursor-glow cursor-glow--trail";
    document.body.appendChild(trail);

    const moveGlow = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", moveGlow);

    /* smooth render loop */
    const render = () => {
      const lerp = 0.12;
      rendered.current.x += (pos.current.x - rendered.current.x) * lerp;
      rendered.current.y += (pos.current.y - rendered.current.y) * lerp;

      const px = rendered.current.x - 96;
      const py = rendered.current.y - 96;
      primary.style.transform = `translate(${pos.current.x - 96}px, ${pos.current.y - 96}px)`;
      trail.style.transform = `translate(${px}px, ${py}px)`;

      rafId.current = requestAnimationFrame(render);
    };
    rafId.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", moveGlow);
      primary.remove();
      trail.remove();
    };
  }, []);

  return null;
};

export default CursorGlow;
