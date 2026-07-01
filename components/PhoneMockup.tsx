export default function PhoneMockup() {
  const bars = [
    { height: "38%", current: false },
    { height: "55%", current: false },
    { height: "70%", current: false },
    { height: "48%", current: false },
    { height: "82%", current: false },
    { height: "100%", current: true },
  ];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div className="relative flex justify-center items-center">
      {/* Glow blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 280,
          height: 280,
          background: "var(--jade-glow)",
          filter: "blur(60px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200,
          height: 200,
          background: "var(--lav-glow)",
          filter: "blur(50px)",
          top: "30%",
          right: -20,
        }}
      />

      {/* Phone frame */}
      <div
        className="relative z-10"
        style={{
          width: 280,
          background: "#0c0f1a",
          borderRadius: 36,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.05) inset, 0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(52,211,153,0.12), 0 0 160px rgba(129,140,248,0.08)",
          overflow: "hidden",
          animation: "float-phone 6s ease-in-out infinite",
        }}
      >
        {/* Notch */}
        <div
          className="flex items-center justify-center"
          style={{ height: 28, background: "#0c0f1a" }}
        >
          <div
            style={{
              width: 80,
              height: 10,
              borderRadius: 99,
              background: "rgba(255,255,255,0.06)",
            }}
          />
        </div>

        {/* Screen */}
        <div style={{ padding: "12px 14px 20px", minHeight: 520 }}>
          {/* Top bar */}
          <div className="flex items-center justify-between" style={{ paddingBottom: 12 }}>
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: "linear-gradient(135deg, var(--jade-1), var(--jade-3))",
                  boxShadow: "0 0 8px var(--jade-glow)",
                }}
              />
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "var(--text-0)" }}>Ledger</span>
            </div>
            <div className="flex gap-1">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    background: "var(--glass)",
                    border: "1px solid var(--border)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Greeting */}
          <div
            className="flex items-center gap-1"
            style={{ fontSize: 8, color: "var(--text-2)", marginBottom: 10 }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--jade-1)",
                boxShadow: "0 0 6px var(--jade-1)",
                animation: "pulse-dot 2.4s ease-in-out infinite",
              }}
            />
            Good morning, Alex
          </div>

          {/* Stats card */}
          <div
            className="relative overflow-hidden"
            style={{
              background: "var(--glass)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 12,
              marginBottom: 8,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
              }}
            />
            <div className="grid grid-cols-2 gap-2" style={{ marginBottom: 8 }}>
              {[
                { label: "Withdrawn", value: "£89,420" },
                { label: "Total Spend", value: "£16,605" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      fontSize: 7,
                      color: "var(--text-3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      marginBottom: 3,
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-0)" }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="flex items-center justify-between"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                padding: "7px 9px",
              }}
            >
              <div>
                <div style={{ fontSize: 7, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Net Profit
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--jade-1)" }}>£72,815</div>
              </div>
              <div
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  padding: "2px 5px",
                  borderRadius: 99,
                  background: "var(--jade-glow)",
                  color: "var(--jade-1)",
                }}
              >
                ↑ 14%
              </div>
            </div>
          </div>

          {/* Chart card */}
          <div
            style={{
              background: "var(--glass)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "10px 10px 6px",
              marginBottom: 8,
            }}
          >
            <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 7,
                  color: "var(--text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                }}
              >
                Monthly Earnings
              </span>
              <span style={{ fontSize: 8.5, fontWeight: 700, color: "var(--text-0)" }}>£8,750</span>
            </div>
            <div
              className="flex items-end gap-1"
              style={{ height: 48, padding: "0 2px" }}
            >
              {bars.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{
                    height: bar.height,
                    borderRadius: "3px 3px 1px 1px",
                    background: bar.current
                      ? "linear-gradient(180deg, var(--jade-1), var(--jade-3))"
                      : "linear-gradient(180deg, var(--jade-1), var(--jade-3))",
                    opacity: bar.current ? 1 : 0.7,
                    boxShadow: bar.current ? "0 -3px 8px rgba(52,211,153,0.4)" : undefined,
                  }}
                />
              ))}
            </div>
            <div className="flex gap-1 justify-between" style={{ padding: "4px 2px 0" }}>
              {months.map((m, i) => (
                <span
                  key={m}
                  className="flex-1 text-center"
                  style={{
                    fontSize: 6,
                    fontWeight: 600,
                    color: i === months.length - 1 ? "var(--jade-1)" : "var(--text-4)",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Upcoming payouts */}
          <div
            className="flex justify-between"
            style={{
              fontSize: 7,
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
              padding: "6px 2px",
            }}
          >
            <span>Upcoming Payouts</span>
            <span style={{ color: "var(--text-4)" }}>3</span>
          </div>

          <div className="flex flex-col gap-1">
            {[
              {
                initials: "AP",
                name: "Apex Trader",
                date: "15 Jun 2026",
                amount: "£3,200",
                badge: "Received",
                badgeColor: "var(--jade-1)",
                badgeBg: "var(--jade-glow)",
                avatarBg: "linear-gradient(135deg,#f59e0b,#d97706)",
              },
              {
                initials: "FT",
                name: "FTMO",
                date: "22 Jun 2026",
                amount: "£4,750",
                badge: "3 days",
                badgeColor: "var(--amber-1)",
                badgeBg: "var(--amber-glow)",
                avatarBg: "linear-gradient(135deg,#6366f1,#4f46e5)",
              },
            ].map(({ initials, name, date, amount, badge, badgeColor, badgeBg, avatarBg }) => (
              <div
                key={name}
                className="flex items-center gap-1.5"
                style={{
                  background: "var(--glass)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "7px 8px",
                }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: avatarBg,
                    fontSize: 7,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 8, fontWeight: 600, color: "var(--text-0)", marginBottom: 1 }}>{name}</div>
                  <div style={{ fontSize: 6.5, color: "var(--text-3)" }}>{date}</div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div style={{ fontSize: 9, fontWeight: 700, color: "var(--jade-1)" }}>{amount}</div>
                  <div
                    style={{
                      fontSize: 6,
                      fontWeight: 600,
                      padding: "1px 5px",
                      borderRadius: 99,
                      background: badgeBg,
                      color: badgeColor,
                    }}
                  >
                    {badge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
