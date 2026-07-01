const features = [
  {
    icon: "💸",
    accent: "jade",
    name: "Multi-firm payout tracking",
    desc: "Log every withdrawal from every prop firm. See your full payout history, upcoming dates, and firm-by-firm performance at a glance.",
    tags: ["Unlimited firms", "Status tracking", "Denial rates"],
  },
  {
    icon: "🎯",
    accent: "jade",
    name: "Income goals",
    desc: "Set daily, weekly, monthly, and annual targets. Watch your progress bars fill up in real time as payouts land.",
    tags: ["4 goal tiers", "Live progress", "Custom targets"],
  },
  {
    icon: "📊",
    accent: "lav",
    name: "Performance stats",
    desc: "Success rate, withdrawal streak, average payout, net profit, projected annual income — every metric a funded trader needs.",
    tags: ["12+ metrics", "Monthly chart", "Firm leaderboard"],
  },
  {
    icon: "💰",
    accent: "amber",
    name: "Cost tracking",
    desc: "Account purchases, subscriptions, wire fees — track every business expense and see your true net profit after all costs.",
    tags: ["4 categories", "Net P&L", "Monthly spend"],
  },
  {
    icon: "📅",
    accent: "lav",
    name: "Calendar & journal",
    desc: "See every payout on a calendar. Add daily trading notes, track what went well, and build a log of your funded account journey.",
    tags: ["Monthly view", "Daily notes", "Auto-save"],
  },
  {
    icon: "📱",
    accent: "jade",
    name: "Install on your phone",
    desc: "Ledger works as a full PWA — add it to your home screen for instant access, just like a native app. No App Store required.",
    tags: ["iOS & Android", "Home screen", "Fast load"],
  },
];

const accentMap = {
  jade: { iconBg: "var(--jade-glow)", tagBg: "rgba(255,51,51,0.06)", tagBorder: "rgba(255,51,51,0.15)" },
  lav: { iconBg: "var(--lav-glow)", tagBg: "rgba(165,180,252,0.06)", tagBorder: "rgba(165,180,252,0.15)" },
  amber: { iconBg: "var(--amber-glow)", tagBg: "rgba(245,158,11,0.06)", tagBorder: "rgba(245,158,11,0.15)" },
};

export default function Features() {
  return (
    <section id="features" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--jade-1)" }}
          >
            Features
          </p>
          <h2
            className="font-extrabold tracking-tight leading-tight mb-4"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              letterSpacing: "-0.03em",
              color: "var(--text-0)",
            }}
          >
            Everything your
            <br />
            trading business needs
          </h2>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: "var(--text-2)" }}>
            From your first payout to your hundredth — Ledger keeps every number in one place
            so you never lose track of what you&apos;ve earned.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon, accent, name, desc, tags }) => {
            const a = accentMap[accent as keyof typeof accentMap];
            return (
              <div
                key={name}
                className="feature-card relative overflow-hidden rounded-2xl p-7"
              >
                {/* Top shine */}
                <div
                  className="absolute top-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                  }}
                />

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                  style={{ background: a.iconBg }}
                >
                  {icon}
                </div>

                <h3
                  className="font-bold text-[17px] mb-2"
                  style={{ letterSpacing: "-0.01em", color: "var(--text-0)" }}
                >
                  {name}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-2)" }}>
                  {desc}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        background: a.tagBg,
                        border: `1px solid ${a.tagBorder}`,
                        color: "var(--text-3)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
