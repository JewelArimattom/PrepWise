import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

/* Client component wrapper — holds all ssr:false dynamic imports */
import ClientBackgrounds from "@/components/ClientBackgrounds";
import CursorGlow from "@/components/CursorGlow";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepWise",
  description: "An AI-powered platform for preparing for mock interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased premium-bg`}
      >
        {/* CSS gradient mesh + 3D WebGL layer (lazy, client-only) */}
        <ClientBackgrounds />

        <CursorGlow />
        {children}

        <Toaster />
      </body>
    </html>
  );
}
