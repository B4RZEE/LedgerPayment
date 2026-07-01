"use client";

import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { accountPassRate, avgPayout, challengeFees, lifetimeSpend, lifetimeWithdrawals, netProfit, received, withdrawalStreak } from "@/lib/domain/selectors";
import { fmtGBP } from "@/lib/format";
import Icon from "@/components/ui/Icon";

export default function KpiStrip() {
  const store = useLedgerStore();
  const state = getLedgerState(store);

  const lifetime = lifetimeWithdrawals(state);
  const spend = lifetimeSpend(state);
  const net = netProfit(state);
  const pr = accountPassRate(state);
  const streak = withdrawalStreak(state);
  const avg = avgPayout(state);
  const activeFirms = state.firms.length;
  const fees = challengeFees(state);
  const roi = fees > 0 ? ((lifetime - fees) / fees) * 100 : null;

  const netSign = net >= 0 ? "+" : "−";
  const netClass = net > 0 ? "pos" : net < 0 ? "neg" : "";
  const roiClass = roi === null ? "" : roi >= 0 ? "pos" : "neg";

  const kpis = [
    { label: "Total Payouts", value: fmtGBP(lifetime, { short: lifetime >= 1000 }), sub: `${received(state).length} withdrawals`, cls: "", icon: "money" },
    { label: "Total Spend", value: fmtGBP(spend, { short: spend >= 1000 }), sub: "fees & purchases", cls: spend > 0 ? "neg" : "", icon: "coin" },
    { label: "Net P&L", value: net !== 0 || lifetime > 0 || spend > 0 ? netSign + fmtGBP(Math.abs(net), { short: Math.abs(net) >= 1000 }) : "—", sub: "payouts minus costs", cls: netClass, icon: "trend" },
    { label: "Fee ROI", value: roi !== null ? (roi >= 0 ? "+" : "") + roi.toFixed(0) + "%" : "—", sub: "return on challenge fees", cls: roiClass, icon: "target" },
    { label: "Pass Rate", value: pr ? pr.rate + "%" : "—", sub: pr ? `${pr.passed}/${pr.total} accounts` : "no data yet", cls: "lav", icon: "medal" },
    { label: "Streak", value: streak > 0 ? `${streak} mo` : "—", sub: "consecutive months", cls: "", icon: "flame" },
    { label: "Avg Payout", value: avg > 0 ? fmtGBP(avg, { short: avg >= 1000 }) : "—", sub: "per withdrawal", cls: "", icon: "chart" },
    { label: "Firms", value: activeFirms > 0 ? String(activeFirms) : "—", sub: `${state.accounts.length} account${state.accounts.length !== 1 ? "s" : ""}`, cls: "", icon: "building" },
  ];

  return (
    <div className="kpi-strip">
      {kpis.map(({ label, value, sub, cls, icon }) => (
        <div key={label} className="kpi-item">
          <div className="kpi-icon">
            <Icon name={icon} />
          </div>
          <div className="kpi-label">{label}</div>
          <div className={`kpi-value num${cls ? " " + cls : ""}`}>{value}</div>
          <div className="kpi-sub">{sub}</div>
        </div>
      ))}
    </div>
  );
}
