export default function FinalCTA() {
  return (
    <section className="relative z-10 py-24 px-6 pb-32 text-center">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative overflow-hidden rounded-[36px] px-10 py-16 max-w-2xl mx-auto"
          style={{ background: "var(--glass)", border: "1px solid var(--border)" }}
        >
          {/* Top shine */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
            }}
          />
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12), transparent 60%)",
            }}
          />

          <div className="relative z-10">
            <h2
              className="font-extrabold tracking-tight mb-4"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                letterSpacing: "-0.03em",
                color: "var(--text-0)",
              }}
            >
              Start tracking today.
              <br />
              It takes 2 minutes.
            </h2>
            <p className="text-lg mb-10" style={{ color: "var(--text-2)" }}>
              Free forever. No credit card. Install on your phone.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/app"
                className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold"
              >
                Create your account
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="/app"
                className="btn-ghost inline-flex items-center px-6 py-3.5 rounded-full text-base font-medium"
              >
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
