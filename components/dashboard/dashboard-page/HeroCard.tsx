"use client";

import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { accountPassRate, earnedLastMonth, earnedThisMonth, lifetimeSpend, lifetimeWithdrawals, netProfit, pctDeltaMonthOverMonth } from "@/lib/domain/selectors";
import { fmtGBP } from "@/lib/format";
import MonthBarsChart from "@/components/dashboard/charts/MonthBarsChart";

export default function HeroCard() {
  const store = useLedgerStore();
  const state = getLedgerState(store);

  const lifetime = lifetimeWithdrawals(state);
  const spend = lifetimeSpend(state);
  const net = netProfit(state);
  const monthVal = earnedThisMonth(state);
  const lastMonth = earnedLastMonth(state);
  const delta = pctDeltaMonthOverMonth(state);
  const pr = accountPassRate(state);
  const activeAccts = state.accounts.filter((a) => a.health === "active").length;

  const noData = lifetime === 0 && spend === 0;
  const netSign = net >= 0 ? "+" : "−";
  const netAmtClass = net > 0 ? "pos" : net < 0 ? "neg" : "neutral";

  let deltaEl: React.ReactNode = null;
  if (!noData && (monthVal > 0 || lastMonth > 0)) {
    const cls = delta > 0 ? "pos" : delta < 0 ? "neg" : "flat";
    const txt = delta > 0 ? `↑ ${delta.toFixed(0)}%` : delta < 0 ? `↓ ${Math.abs(delta).toFixed(0)}%` : "0%";
    deltaEl = <span className={`ov-hero-delta ${cls}`}>{txt}</span>;
  }

  const stats = [
    { icon: "💸", label: "Payouts", value: fmtGBP(lifetime, { short: true }) },
    { icon: "💳", label: "Invested", value: fmtGBP(spend, { short: true }) },
    { icon: "🎯", label: "Pass Rate", value: pr ? pr.rate + "%" : "—" },
    { icon: "✅", label: "Active", value: activeAccts > 0 ? String(activeAccts) : String(state.accounts.length) },
  ];

  return (
    <div className="ov-hero">
      <div className="ov-hero-top">
        <div>
          <div className="ov-hero-label">Net Profit · Payouts minus costs</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
            <div className={`ov-hero-amount num ${netAmtClass}`}>{noData ? "—" : netSign + fmtGBP(Math.abs(net))}</div>
            {deltaEl}
          </div>
          <div className="ov-hero-meta">{noData ? "Add a payout and spending to start tracking" : `${fmtGBP(lifetime)} in · ${fmtGBP(spend)} costs`}</div>
        </div>
        <div className="ov-hero-stats">
          {stats.map(({ icon, label, value }) => (
            <div key={label} className="ov-hero-stat">
              <div className="ov-hero-stat-icon">{icon}</div>
              <div className="ov-hero-stat-label">{label}</div>
              <div className="ov-hero-stat-value">{value}</div>
            </div>
          ))}
        </div>
      </div>
      <MonthBarsChart />
    </div>
  );
}
