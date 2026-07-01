export default function Footer() {
  return (
    <footer
      className="relative z-10 py-10 px-6"
      style={{ borderTop: "1px solid var(--hairline)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2">
          <div
            className="w-[22px] h-[22px] rounded-[7px]"
            style={{
              background: "radial-gradient(circle at 30% 25%, var(--jade-1), var(--jade-3) 65%)",
            }}
          />
          <span className="text-sm font-bold" style={{ color: "var(--text-0)" }}>
            Ledger
          </span>
        </a>

        <p className="text-[13px]" style={{ color: "var(--text-4)" }}>
          © 2026 Ledger. Built for funded traders.
        </p>

        <nav className="flex gap-5">
          {[
            { href: "/app", label: "Log in" },
            { href: "#pricing", label: "Pricing" },
            { href: "#features", label: "Features" },
          ].map(({ href, label }) => (
            <a key={href + label} href={href} className="footer-link text-[13px]">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
