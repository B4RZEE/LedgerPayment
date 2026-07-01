"use client";

import type { ReactNode } from "react";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import {
  avgMonthlyIncome,
  avgPayout,
  daysSinceLastWithdrawal,
  earnedThisMonth,
  eligibleAccountsCount,
  getFirm,
  largestMonth,
  largestPayout,
  lifetimeSpend,
  lifetimeWithdrawals,
  netProfit,
  paidThisMonthCount,
  pendingPayouts,
  pendingTotal,
  payoutSuccessRate,
  received,
} from "@/lib/domain/selectors";
import { fmtDateLong, fmtGBP, fmtMonthYear } from "@/lib/format";
import Icon from "@/components/ui/Icon";

function StatCard({ label, value, sub, icon }: { label: string; value: ReactNode; sub?: ReactNode; icon?: string }) {
  return (
    <div className="stat">
      <div className="stat-label">
        {icon && (
          <span className="stat-icon">
            <Icon name={icon} />
          </span>
        )}
        {label}
      </div>
      <div className="stat-value num">{value}</div>
      {sub != null && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default function PerformanceStatsGrid() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const r = received(state);
  const succ = payoutSuccessRate(state);
  const lm = largestMonth(state);
  const dsl = daysSinceLastWithdrawal(state);
  const lp = largestPayout(state);
  const am = avgMonthlyIncome(state);
  const pendingCount = pendingPayouts(state).length;
  const ap = avgPayout(state);
  const np = netProfit(state);
  const sp = lifetimeSpend(state);
  const pt = pendingTotal(state);

  return (
    <section className="section">
      <div className="section-head">
        <div className="section-title">Performance</div>
        <div className="section-meta">
          {r.length} received · {pendingCount} pending
        </div>
      </div>
      <div className="stats-grid stagger">
        <StatCard label="Average Payout" value={fmtGBP(ap, { short: ap >= 1000 })} sub={`${r.length} payouts`} icon="coin" />
        <StatCard label="Largest Payout" value={lp ? fmtGBP(lp.amount) : "—"} sub={lp ? getFirm(state, lp.firmId)?.name : undefined} icon="trophy" />
        <StatCard label="Total Received" value={r.length.toString()} sub={r.length ? `since ${fmtDateLong(r[r.length - 1].date)}` : undefined} />
        <StatCard label="Success Rate" value={succ != null ? `${succ.toFixed(0)}%` : "—"} sub={succ != null ? "of decided payouts" : undefined} />
        <StatCard label="Active Accounts" value={state.accounts.length.toString()} sub={`${eligibleAccountsCount(state)} payout-ready`} />
        <StatCard label="Awaiting Payout" value={pendingCount.toString()} sub={pendingCount ? fmtGBP(pt) + " pending" : undefined} />
        <StatCard label="Paid This Month" value={paidThisMonthCount(state).toString()} sub={fmtGBP(earnedThisMonth(state))} />
        <StatCard label="Avg Monthly Income" value={fmtGBP(am, { short: am >= 1000 })} sub={r.length ? undefined : "Need data"} />
        <StatCard label="Largest Month" value={lm ? fmtGBP(lm.total) : "—"} sub={lm ? fmtMonthYear(lm.key + "-01") : undefined} />
        <StatCard
          label="Net Profit"
          value={sp === 0 && lifetimeWithdrawals(state) === 0 ? "—" : (np >= 0 ? "" : "−") + fmtGBP(Math.abs(np), { short: Math.abs(np) >= 1000 })}
          sub={sp ? fmtGBP(sp, { short: sp >= 1000 }) + " spent" : "no costs logged"}
        />
        <StatCard label="Days Since Last" value={dsl != null ? `${dsl}` : "—"} sub={dsl != null ? (dsl === 1 ? "day" : "days") : undefined} />
        <StatCard label="Pending Total" value={fmtGBP(pt, { short: pt >= 1000 })} sub={pendingCount ? `across ${pendingCount}` : "none yet"} />
      </div>
    </section>
  );
}
