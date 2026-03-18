"use client";

/**
 * ClientBackgrounds — thin "use client" shell so we can use
 * next/dynamic with ssr:false inside the Server Component layout.
 *
 * Rule: `ssr: false` is only legal inside a Client Component.
 */
import dynamic from "next/dynamic";

/* 3D WebGL layer — desktop only, zero SSR cost */
const InteractiveAIBackground = dynamic(
  () => import("@/components/InteractiveAIBackground"),
  { ssr: false }
);

/* CSS gradient/particle layer — mobile fallback */
const PremiumBackground = dynamic(
  () => import("@/components/PremiumBackground"),
  { ssr: false }
);

export default function ClientBackgrounds() {
  return (
    <>
      <PremiumBackground />
      <InteractiveAIBackground />
    </>
  );
}
