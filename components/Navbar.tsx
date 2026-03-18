"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface NavbarProps {
  userName?: string | null;
  signOutAction: () => Promise<void>;
}

export default function Navbar({ userName, signOutAction }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="glass-panel rounded-2xl px-5 py-3.5 relative z-50">
      <div className="flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setOpen(false)}>
          <Image src="/logo.svg" alt="PrepWise Logo" width={34} height={28} />
          <span
            className="font-bold text-lg tracking-tight text-primary-100 group-hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Prep<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Wise</span>
          </span>
        </Link>

        {/* ── Desktop right section ── */}
        <div className="hidden sm:flex items-center gap-4">
          {userName ? (
            <>
              <p className="text-sm text-primary-100/70">
                Hi, <span className="text-white font-medium">{userName}</span>
              </p>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="text-sm text-primary-200/80 hover:text-white transition-all duration-300 px-4 py-1.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm font-medium text-primary-200 hover:text-white transition-all duration-300 px-5 py-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              Login
            </Link>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          aria-label="Toggle menu"
          className="sm:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className="block h-[1.5px] w-5 bg-white/80 rounded-full transition-all duration-300 origin-center"
            style={{ transform: open ? "translateY(6.5px) rotate(45deg)" : "none" }}
          />
          <span
            className="block h-[1.5px] w-5 bg-white/80 rounded-full transition-all duration-300"
            style={{ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "scaleX(1)" }}
          />
          <span
            className="block h-[1.5px] w-5 bg-white/80 rounded-full transition-all duration-300 origin-center"
            style={{ transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none" }}
          />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className="sm:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "200px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="pt-4 pb-2 border-t border-white/8 mt-3 flex flex-col gap-3">
          {userName ? (
            <>
              <p className="text-sm text-white/50 px-1">
                Signed in as <span className="text-white/80 font-medium">{userName}</span>
              </p>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full text-sm text-left text-primary-200/80 hover:text-white transition-colors px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-center text-primary-200 hover:text-white transition-all px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
