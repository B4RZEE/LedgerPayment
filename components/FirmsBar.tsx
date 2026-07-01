const firms = [
  "FTMO",
  "Apex Trader",
  "The5ers",
  "TopStep",
  "MyFundedFX",
  "FundedNext",
  "E8 Markets",
  "Funded Engineer",
  "City Traders Imperium",
  "Lux Trading",
  "Maven Trading",
  "True Forex Funds",
];

export default function FirmsBar() {
  const doubled = [...firms, ...firms];

  return (
    <div
      className="relative z-10 py-8 overflow-hidden"
      style={{
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 z-10 w-16 pointer-events-none"
        style={{
          background: "linear-gradient(to right, var(--bg-0), transparent)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 z-10 w-16 pointer-events-none"
        style={{
          background: "linear-gradient(to left, var(--bg-0), transparent)",
        }}
      />

      <p
        className="text-center text-[11px] font-semibold uppercase tracking-widest mb-5"
        style={{ color: "var(--text-4)" }}
      >
        Used by traders at
      </p>

      <div className="ticker-track" aria-hidden="true">
        {doubled.map((firm, i) => (
          <div
            key={`${firm}-${i}`}
            className="mx-3 px-4 py-1.5 rounded-full whitespace-nowrap text-[13px] font-semibold flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--hairline)",
              color: "var(--text-3)",
            }}
          >
            {firm}
          </div>
        ))}
      </div>
    </div>
  );
}
