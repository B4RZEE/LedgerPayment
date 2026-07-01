"use client";

import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { expectedThisMonth, expectedNextMonth, expectedThisWeek, pendingPayouts, pendingTotal } from "@/lib/domain/selectors";
import { endOfWeekISO, fmtGBP, localMonthISO, monthKey, parseISO, startOfWeekISO, todayISO } from "@/lib/format";

export default function ExpectedIncomeCard() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const week = expectedThisWeek(state);
  const month = expectedThisMonth(state);
  const next = expectedNextMonth(state);
  const total = pendingTotal(state);

  const today = todayISO();
  const ws = startOfWeekISO(today),
    we = endOfWeekISO(today);
  const m = monthKey(today);
  const d = parseISO(today)!;
  d.setMonth(d.getMonth() + 1);
  const nextM = localMonthISO(d);

  const pending = pendingPayouts(state);
  const weekCount = pending.filter((p) => p.date >= ws && p.date <= we).length;
  const monthCount = pending.filter((p) => monthKey(p.date) === m).length;
  const nextCount = pending.filter((p) => monthKey(p.date) === nextM).length;
  const pendingCount = pending.length;

  return (
    <section className="section">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Expected Income</div>
        </div>
        <div className="expected">
          <div className="exp-card">
            <div className="exp-label">This Week</div>
            <div className="exp-value num">{fmtGBP(week, { short: week >= 1000 })}</div>
            <div className="exp-count">
              {weekCount} payout{weekCount === 1 ? "" : "s"}
            </div>
          </div>
          <div className="exp-card">
            <div className="exp-label">This Month</div>
            <div className="exp-value num">{fmtGBP(month, { short: month >= 1000 })}</div>
            <div className="exp-count">
              {monthCount} payout{monthCount === 1 ? "" : "s"}
            </div>
          </div>
          <div className="exp-card">
            <div className="exp-label">Next Month</div>
            <div className="exp-value num">{fmtGBP(next, { short: next >= 1000 })}</div>
            <div className="exp-count">
              {nextCount} payout{nextCount === 1 ? "" : "s"}
            </div>
          </div>
          <div className="exp-card">
            <div className="exp-label">Total Pending</div>
            <div className="exp-value num">{fmtGBP(total, { short: total >= 1000 })}</div>
            <div className="exp-count">
              {pendingCount} payout{pendingCount === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
