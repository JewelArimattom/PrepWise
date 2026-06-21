"use client";

/**
 * ClientBackgrounds — thin "use client" shell so we can use
 * next/dynamic with ssr:false inside the Server Component layout.
 */
import dynamic from "next/dynamic";

/* CSS gradient/particle layer — mobile fallback */
const PremiumBackground = dynamic(
  () => import("@/components/PremiumBackground"),
  { ssr: false }
);

export default function ClientBackgrounds() {
  return (
    <>
      <PremiumBackground />
    </>
  );
}
