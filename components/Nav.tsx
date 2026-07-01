"use client";

import { useState, useEffect } from "react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,11,0.9)" : "rgba(10,10,11,0.6)",
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "transparent"}`,
        }}
      >
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-6">
          {/* Brand */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-7 h-7 rounded-[9px]"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, var(--jade-1), var(--jade-3) 65%)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.1) inset, 0 6px 16px var(--jade-glow)",
              }}
            />
            <span
              className="font-bold text-[17px] tracking-tight"
              style={{ color: "var(--text-0)" }}
            >
              Ledger
            </span>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} className="nav-link text-sm font-medium">
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <a href="/app" className="btn-nav-ghost px-4 py-2 rounded-full text-sm font-medium">
              Log in
            </a>
            <a href="/app" className="btn-nav-red px-4 py-2 rounded-full text-sm font-semibold">
              Start free
            </a>
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <a
              href="/app"
              className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold"
              style={{
                background: "linear-gradient(135deg, var(--jade-1), var(--jade-2))",
                color: "#fff",
              }}
            >
              Start free
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg"
              style={{ color: "var(--text-1)" }}
            >
              <span
                className="block h-0.5 w-5 rounded-full transition-all duration-300 origin-center"
                style={{
                  background: "currentColor",
                  transform: menuOpen ? "rotate(45deg) translateY(5px)" : "",
                }}
              />
              <span
                className="block h-0.5 w-5 rounded-full transition-all duration-300"
                style={{
                  background: "currentColor",
                  opacity: menuOpen ? 0 : 1,
                  transform: menuOpen ? "scaleX(0)" : "",
                }}
              />
              <span
                className="block h-0.5 w-5 rounded-full transition-all duration-300 origin-center"
                style={{
                  background: "currentColor",
                  transform: menuOpen ? "rotate(-45deg) translateY(-5px)" : "",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(10,10,11,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile panel */}
      <div
        className={`mobile-menu fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden flex flex-col pt-20 pb-8 px-6 gap-2 ${
          menuOpen ? "open" : ""
        }`}
        style={{ background: "var(--bg-1)", borderLeft: "1px solid var(--border)" }}
      >
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation menu"
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg"
          style={{ color: "var(--text-3)", background: "var(--glass)" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ pointerEvents: "none" }}
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3.5 rounded-xl text-base font-medium"
              style={{ color: "var(--text-1)" }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="h-px mt-4" style={{ background: "var(--hairline)" }} />

        <div className="flex flex-col gap-3 mt-4">
          <a
            href="/app"
            onClick={() => setMenuOpen(false)}
            className="btn-outline w-full py-3 rounded-full text-center text-sm font-medium"
          >
            Log in
          </a>
          <a
            href="/app"
            onClick={() => setMenuOpen(false)}
            className="btn-primary w-full py-3 rounded-full text-center text-sm font-bold"
          >
            Start for free
          </a>
        </div>
      </div>
    </>
  );
}
