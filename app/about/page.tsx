import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — Ledger",
  description:
    "Ledger was built by funded traders for funded traders. Our mission: make the business side of prop trading as transparent as your charts.",
};

const values = [
  {
    icon: "⚡",
    title: "Built for speed",
    desc: "Log a payout in under 10 seconds. No bloat, no friction — just the data you need to make decisions.",
  },
  {
    icon: "🔒",
    title: "Your data, locked down",
    desc: "PIN protection, zero third-party trackers, and no selling your data. What's yours stays yours.",
  },
  {
    icon: "📱",
    title: "Phone-first",
    desc: "Install Ledger to your home screen and use it like a native app — no App Store required. Built as a PWA from day one.",
  },
  {
    icon: "🎯",
    title: "Goal-driven",
    desc: "We believe what gets measured gets achieved. Income goals with live progress bars keep you focused on what matters.",
  },
];

const team = [
  {
    initials: "BK",
    name: "B. Kontrol",
    role: "Founder & Developer",
    note: "Funded trader turned builder. Frustrated by spreadsheets, built Ledger instead.",
    gradient: "linear-gradient(135deg, #ff3333, #b51414)",
  },
];

export default function About() {
  return (
    <main>
      <Nav />

      {/* Hero */}
      <section className="relative z-10 pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--jade-1)" }}
          >
            About Ledger
          </p>
          <h1
            className="font-extrabold tracking-tight mb-6"
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              letterSpacing: "-0.04em",
              color: "var(--text-0)",
            }}
          >
            Built by traders,
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--jade-1), var(--lav-2))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for traders.
            </span>
          </h1>
          <p
            className="text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--text-2)" }}
          >
            Prop trading is a real business. Most traders track their payouts in
            spreadsheets, browser bookmarks, or their memory. Ledger was built to
            change that — one clean dashboard, every firm, every withdrawal.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl p-10"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 0% 0%, rgba(255,51,51,0.06), transparent 60%)",
              }}
            />
            <div className="relative z-10">
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--jade-1)" }}
              >
                The story
              </p>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: "var(--text-1)" }}
              >
                Ledger started as a personal side project after running five prop
                firm accounts simultaneously and losing track of what was actually
                withdrawn vs. pending vs. denied. After months in a spreadsheet
                that kept breaking, the choice was simple: build something better.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-2)" }}>
                Six months of evenings and weekends later, Ledger launched as a
                mobile-first PWA that any funded trader can install in under a
                minute. The mission hasn&apos;t changed: make the business side of
                funded trading as clear as your charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--jade-1)" }}
            >
              What we stand for
            </p>
            <h2
              className="font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(26px, 3.5vw, 42px)",
                letterSpacing: "-0.03em",
                color: "var(--text-0)",
              }}
            >
              Our values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="feature-card relative overflow-hidden rounded-2xl p-7"
              >
                <div
                  className="absolute top-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                  }}
                />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                  style={{ background: "var(--jade-glow)" }}
                >
                  {icon}
                </div>
                <h3
                  className="font-bold text-[17px] mb-2"
                  style={{ letterSpacing: "-0.01em", color: "var(--text-0)" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--jade-1)" }}
            >
              The team
            </p>
            <h2
              className="font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(26px, 3.5vw, 42px)",
                letterSpacing: "-0.03em",
                color: "var(--text-0)",
              }}
            >
              Who built this
            </h2>
          </div>

          <div className="flex justify-center">
            {team.map(({ initials, name, role, note, gradient }) => (
              <div
                key={name}
                className="feature-card relative overflow-hidden rounded-3xl p-8 max-w-sm w-full text-center"
              >
                <div
                  className="absolute top-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                  }}
                />
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5"
                  style={{ background: gradient, color: "#fff" }}
                >
                  {initials}
                </div>
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ color: "var(--text-0)" }}
                >
                  {name}
                </h3>
                <p
                  className="text-[13px] font-semibold uppercase tracking-wider mb-4"
                  style={{ color: "var(--jade-1)" }}
                >
                  {role}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative z-10 py-20 px-6 pb-32">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="relative overflow-hidden rounded-[32px] px-10 py-14"
            style={{ background: "var(--glass)", border: "1px solid var(--border)" }}
          >
            <div
              className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(255,51,51,0.07), transparent 60%)",
              }}
            />
            <div className="relative z-10">
              <h2
                className="font-extrabold tracking-tight mb-4"
                style={{
                  fontSize: "clamp(24px, 3.5vw, 38px)",
                  letterSpacing: "-0.03em",
                  color: "var(--text-0)",
                }}
              >
                Questions or feedback?
              </h2>
              <p className="text-lg mb-8" style={{ color: "var(--text-2)" }}>
                We&apos;re a small team and we read every message. Reach out anytime.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:hello@ledger.app"
                  className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base font-bold"
                >
                  Get in touch
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
                  href="/"
                  className="btn-ghost inline-flex items-center px-6 py-3.5 rounded-full text-base font-medium"
                >
                  Back to home
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
