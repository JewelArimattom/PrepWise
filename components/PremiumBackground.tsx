"use client";

import { useEffect, useState } from "react";

const PremiumBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* ── Gradient mesh — always present (base ambient lighting) ── */}
      <div className="bg-mesh" />

      {/* ── Noise texture ── */}
      <div className="bg-noise" />

      {/* ── Dot grid overlay — professional studio feel ── */}
      <div className="bg-grid-dots" />

      {/* ── Static Aurora bands for color depth ── */}
      {/* Top-left violet */}
      <div className="hero-glow absolute -top-32 left-[5%] h-[28rem] w-[36rem] rounded-full bg-[#9400D3]/20" />

      {/* Bottom-right pink */}
      <div className="hero-glow absolute bottom-[-140px] right-[2%] h-[30rem] w-[30rem] rounded-full bg-[#ED80E9]/15" />

      {/* Center lavender (subtle) */}
      <div className="hero-glow absolute top-[40%] left-[50%] h-[22rem] w-[22rem] rounded-full bg-[#D3D3FF]/10" />

      {/* Mid-right violet */}
      <div className="hero-glow absolute top-[15%] right-[20%] h-[18rem] w-[18rem] rounded-full bg-[#9400D3]/8" />

      {/* Bottom-left thistle */}
      <div className="hero-glow absolute bottom-[5%] left-[15%] h-[20rem] w-[24rem] rounded-full bg-[#D8BFD8]/8" />

      {/* ── Vignette — strong edge darkening for depth ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,5,16,0.7))]" />
    </div>
  );
};

export default PremiumBackground;
