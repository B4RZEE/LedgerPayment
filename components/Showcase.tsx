function StatsMock() {
  const stats = [
    { label: "⌀ Avg Payout", value: "£2,847", sub: "across 31 payouts", positive: false },
    { label: "✓ Success Rate", value: "91%", sub: "of decided payouts", positive: true },
    { label: "🔥 Streak", value: "8 mo", sub: "consecutive months", positive: false },
    { label: "📈 Projected", value: "£104k", sub: "annual income", positive: false },
    { label: "💷 Net Profit", value: "£72,815", sub: "after all costs", positive: true },
    { label: "⏱ Velocity", value: "↑ 14%", sub: "vs last 30 days", positive: true },
  ];

  return (
    <div
      className="w-full max-w-md rounded-3xl overflow-hidden"
      style={{
        background: "var(--bg-1)",
        border: "1px solid var(--border)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="px-5 py-4 text-[11px] font-semibold uppercase tracking-widest"
        style={{ borderBottom: "1px solid var(--hairline)", color: "var(--text-3)" }}
      >
        Performance Statistics
      </div>
      <div
        className="grid grid-cols-2"
        style={{ gap: 1, background: "var(--hairline)" }}
      >
        {stats.map(({ label, value, sub, positive }) => (
          <div key={label} className="p-5" style={{ background: "var(--bg-1)" }}>
            <div
              className="text-[10px] uppercase tracking-wider font-semibold mb-2"
              style={{ color: "var(--text-3)" }}
            >
              {label}
            </div>
            <div
              className="text-[22px] font-bold tracking-tight"
              style={{
                letterSpacing: "-0.03em",
                color: positive ? "var(--jade-1)" : "var(--text-0)",
              }}
            >
              {value}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>
              {sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalsMock() {
  const goals = [
    { label: "Daily", current: "£247", target: "£250", pct: 99, done: false },
    { label: "Weekly", current: "£1,840", target: "£1,500", pct: 100, done: true, over: "123%" },
    { label: "Monthly", current: "£8,750", target: "£10,000", pct: 88, done: false },
    { label: "Annual", current: "£72,815", target: "£100,000", pct: 73, done: false },
  ];

  return (
    <div
      className="w-full max-w-md rounded-3xl p-6"
      style={{
        background: "var(--bg-1)",
        border: "1px solid var(--border)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="text-[11px] font-semibold uppercase tracking-widest mb-6"
        style={{ color: "var(--text-3)" }}
      >
        Income Goals
      </div>
      <div className="flex flex-col gap-5">
        {goals.map(({ label, current, target, pct, done, over }) => (
          <div key={label}>
            <div className="flex justify-between items-baseline mb-2">
              <span
                className="text-[12px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-1)" }}
              >
                {label}
              </span>
              <span className="text-[12px]" style={{ color: "var(--text-3)" }}>
                <span className="font-semibold" style={{ color: "var(--text-0)" }}>
                  {current}
                </span>{" "}
                of {target}
              </span>
              <span
                className="text-[12px] font-bold"
                style={{ color: done ? "var(--lav-1)" : "var(--jade-1)" }}
              >
                {done ? `✓ ${over}` : `${pct}%`}
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="h-full rounded-full bar-fill relative overflow-hidden"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: done
                    ? "linear-gradient(90deg, var(--jade-1), var(--lav-2))"
                    : "linear-gradient(90deg, var(--jade-2), var(--jade-1), #06b6d4)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Showcase() {
  return (
    <>
      {/* Stats showcase */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--jade-1)" }}
              >
                Performance
              </p>
              <h2
                className="font-extrabold tracking-tight leading-tight mb-4"
                style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em", color: "var(--text-0)" }}
              >
                Know your numbers cold
              </h2>
              <p className="text-lg leading-relaxed max-w-md" style={{ color: "var(--text-2)" }}>
                Twelve performance metrics updated the moment you log a payout. Success rate,
                withdrawal streak, average size, net profit, projected income — everything a
                serious funded trader needs to see.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <StatsMock />
            </div>
          </div>
        </div>
      </section>

      {/* Goals showcase */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              <GoalsMock />
            </div>
            <div className="order-1 lg:order-2">
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--jade-1)" }}
              >
                Goals
              </p>
              <h2
                className="font-extrabold tracking-tight leading-tight mb-4"
                style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em", color: "var(--text-0)" }}
              >
                Hit targets you actually set
              </h2>
              <p className="text-lg leading-relaxed max-w-md" style={{ color: "var(--text-2)" }}>
                Define what success looks like — daily, weekly, monthly, and annually. Progress
                bars update in real time as payouts come in, so you always know exactly where
                you stand against your targets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
