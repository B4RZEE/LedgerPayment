import PhoneMockup from "./PhoneMockup";

export default function Hero() {
  return (
    <section className="relative z-10 min-h-svh flex items-center pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          {/* Content */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest border mb-6"
              style={{
                background: "var(--jade-glow)",
                borderColor: "rgba(255,51,51,0.25)",
                color: "var(--jade-1)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: "var(--jade-1)",
                  boxShadow: "0 0 8px var(--jade-1)",
                  animation: "pulse-dot 2.4s ease-in-out infinite",
                }}
              />
              Built for funded traders
            </div>

            {/* Title */}
            <h1
              className="font-extrabold tracking-tight leading-none mb-5"
              style={{ fontSize: "clamp(44px, 6vw, 72px)", letterSpacing: "-0.04em" }}
            >
              Every payout.{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, var(--jade-1) 60%, var(--lav-2) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                One place.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="leading-relaxed mb-9 max-w-md"
              style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "var(--text-2)" }}
            >
              Track withdrawals across every prop firm, hit your income goals, and finally see
              what your funded trading business actually earns.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <a
                href="/app"
                className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold"
              >
                Start for free
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
                href="#features"
                className="btn-ghost inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-medium"
              >
                See how it works
              </a>
            </div>

            {/* Proof note */}
            <div
              className="flex items-center gap-1.5 text-[13px]"
              style={{ color: "var(--text-4)" }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--jade-2)"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Free forever — no card required
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
