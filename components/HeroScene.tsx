"use client";

import { motion } from "framer-motion";

/* tiny orbiting dots around the orb */
const orbitDots = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  angle: i * 60,
  radius: 120 + (i % 3) * 16,
  duration: 12 + i * 2,
  size: 3 + (i % 3),
}));

/* waveform bars — heights pre-computed to avoid hydration mismatch with Math.random() */
const waveBarHeights = [10, 18, 14, 22, 8, 16, 20, 12, 24, 10, 18, 14, 8, 22, 16, 12, 20, 10];
const waveBarDurations = [0.9, 1.1, 0.8, 1.2, 1.0, 0.85, 1.15, 0.95, 0.75, 1.05, 0.9, 1.2, 0.8, 1.0, 0.85, 1.1, 0.95, 1.0];

/* waveform bars for voice effect */
const waveBars = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: i * 0.08,
  height: waveBarHeights[i] ?? 12,
  duration: waveBarDurations[i] ?? 1.0,
}));

const HeroScene = () => {
  return (
    <div className="hero-scene-wrapper relative w-full h-[600px] overflow-hidden flex items-center justify-center">
      {/* ── Deep background glow ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(148,0,211,0.12),transparent_60%)]" />

      {/* ── Outer ring 1 ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full border border-dashed border-[#9400D3]/15"
      />

      {/* ── Outer ring 2 ── */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-[2rem] border border-[#D8BFD8]/20"
      >
        {/* dots on ring */}
        <div className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-[#ED80E9]/60" />
        <div className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-[#9400D3]/60" />
      </motion.div>

      {/* ── Inner rotating ring ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-48 rounded-full border border-white/10"
      >
        <div className="absolute -left-1 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-[#D3D3FF] shadow-[0_0_12px_rgba(211,211,255,0.7)]" />
        <div className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-[#ED80E9] shadow-[0_0_12px_rgba(237,128,233,0.7)]" />
      </motion.div>

      {/* ── Central AI Orb ── */}
      <motion.div
        animate={{
          y: [0, -14, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {/* glow behind orb */}
        <div className="absolute inset-0 scale-150 rounded-full bg-gradient-to-br from-[#9400D3]/40 via-[#D8BFD8]/30 to-[#ED80E9]/40 blur-3xl" />

        {/* main orb */}
        <div className="relative size-36 rounded-full bg-gradient-to-br from-[#9400D3] via-[#D8BFD8] to-[#ED80E9] shadow-[0_0_80px_rgba(148,0,211,0.5),inset_0_-6px_24px_rgba(0,0,0,0.3)]">
          {/* glass highlight */}
          <div className="absolute top-2 left-4 h-12 w-20 rounded-full bg-gradient-to-br from-white/25 to-transparent blur-sm" />

          {/* ── Voice waveform inside orb ── */}
          <div className="absolute inset-0 flex items-center justify-center gap-[3px]">
            {waveBars.map((bar) => (
              <motion.span
                key={bar.id}
                className="w-[2.5px] rounded-full bg-white/70"
                animate={{
                  height: ["4px", `${bar.height}px`, "4px"],
                }}
                transition={{
                  duration: bar.duration,
                  repeat: Infinity,
                  delay: bar.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Orbiting dots ── */}
      {orbitDots.map((dot) => (
        <motion.div
          key={dot.id}
          animate={{ rotate: 360 }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute left-1/2 top-1/2"
          style={{
            width: dot.radius * 2,
            height: dot.radius * 2,
            marginLeft: -dot.radius,
            marginTop: -dot.radius,
          }}
        >
          <motion.span
            className="absolute rounded-full"
            style={{
              width: dot.size,
              height: dot.size,
              top: 0,
              left: "50%",
              transform: `translateX(-50%) rotate(${dot.angle}deg)`,
              background: dot.id % 2 === 0
                ? "rgba(148,0,211,0.7)"
                : "rgba(237,128,233,0.7)",
              boxShadow: dot.id % 2 === 0
                ? "0 0 8px rgba(148,0,211,0.5)"
                : "0 0 8px rgba(237,128,233,0.5)",
            }}
          />
        </motion.div>
      ))}

      {/* ── Status labels floating around orb ── */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 right-8 px-3 py-1.5 rounded-lg bg-[#9400D3]/8 backdrop-blur-md border border-[#9400D3]/15 text-[11px] text-[#D3D3FF]/80 tracking-wide"
      >
        🧠 AI Ready
      </motion.div>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-10 left-8 px-3 py-1.5 rounded-lg bg-[#ED80E9]/8 backdrop-blur-md border border-[#ED80E9]/15 text-[11px] text-[#D8BFD8]/80 tracking-wide"
      >
        🎤 Voice Active
      </motion.div>

      {/* ── Overlay for depth ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(12,7,20,0.5))]" />
    </div>
  );
};

export default HeroScene;
