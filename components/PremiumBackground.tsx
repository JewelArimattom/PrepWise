"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* CSS-only particle motes — only rendered on mobile
   (desktop gets the 3D layer instead) */
const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 13 + 7) % 100}%`,
  top: `${(i * 19 + 11) % 100}%`,
  size: 1.5 + (i % 4) * 0.6,
  duration: 8 + (i % 7) * 2.5,
  delay: i * 0.18,
  drift: 12 + (i % 5) * 6,
}));

const PremiumBackground = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* ── Gradient mesh — always present (base ambient lighting) ── */}
      <div className="bg-mesh" />

      {/* ── Noise texture ── */}
      <div className="bg-noise" />

      {/* ── Aurora bands — always present for color depth ── */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 100, -40, 0], y: [0, -40, 20, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="hero-glow absolute -top-32 left-[5%] h-[28rem] w-[36rem] rounded-full bg-blue-500/20"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -120, 50, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="hero-glow absolute bottom-[-140px] right-[2%] h-[30rem] w-[30rem] rounded-full bg-violet-500/20"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, 60, -80, 0], y: [0, -50, 30, 0], opacity: [0.10, 0.22, 0.10] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="hero-glow absolute top-[40%] left-[50%] h-[22rem] w-[22rem] rounded-full bg-cyan-400/15"
      />

      {/* ── DOM particles — mobile only (desktop uses 3D layer) ── */}
      {isMobile &&
        particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-white/40"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ y: [0, -p.drift, 0], x: [0, p.drift * 0.4, 0], opacity: [0.08, 0.6, 0.08] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}

      {/* ── Vignette ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,4,8,0.6))]" />
    </div>
  );
};

export default PremiumBackground;
