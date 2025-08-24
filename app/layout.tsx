import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

// Imports for theme and toast functionality
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Prep Wise",
  description: "Prep Wise ai tool for interview preparation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${monaSans.className} antialiased pattern`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}