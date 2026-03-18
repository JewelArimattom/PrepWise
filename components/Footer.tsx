import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Product: [
    { label: "Take Interview", href: "/interview" },
    { label: "Your Results", href: "/" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  Connect: [
    { label: "GitHub", href: "https://github.com", external: true },
    { label: "Twitter / X", href: "https://x.com", external: true },
    { label: "LinkedIn", href: "https://linkedin.com", external: true },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 overflow-hidden">
      {/* top separator glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(96,165,250,0.4), rgba(167,139,250,0.4), transparent)",
        }}
      />

      <div
        className="rounded-2xl px-8 py-10 mt-px"
        style={{
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <Image src="/logo.svg" alt="PrepWise Logo" width={32} height={27} />
              <span
                className="font-bold text-lg tracking-tight text-white/90 group-hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Prep<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Wise</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-[200px]">
              AI-powered mock interviews to help you land your dream job.
            </p>

            {/* Subtle status badge */}
            <div className="flex items-center gap-2 mt-1">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/35 tracking-wide">All systems operational</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-[0.18em] mb-1">
                {group}
              </p>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  {...("external" in link && link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-sm text-white/50 hover:text-white transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs text-white/25 text-center sm:text-left">
            © {year} PrepWise. Built with ❤️ to help you succeed.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-white/20">Powered by</span>
            <span className="text-xs font-semibold bg-gradient-to-r from-blue-400/70 to-violet-400/70 bg-clip-text text-transparent">
              Google Gemini · Vapi AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
