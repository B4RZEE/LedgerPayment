/* ================================================================
   PURE STAT/SELECTOR FUNCTIONS
   Ported from public/app.html. Every function here read a module-global
   `state` in the original; they now take `state` as an explicit first
   argument instead — same logic, more testable, no hidden globals.
   ================================================================ */
import type { Account, Firm, LedgerState, Payout, SpendingCategory } from "@/lib/store/types";
import { daysBetween, localISO, localMonthISO, monthKey, parseISO, startOfWeekISO, endOfWeekISO, todayISO } from "@/lib/format";
import { SPENDING_CATEGORIES } from "@/lib/domain/meta";

const today = () => todayISO();

export function getFirm(state: LedgerState, id: string): Firm | undefined {
  return state.firms.find((f) => f.id === id);
}
export function getAccount(state: LedgerState, id: string): Account | undefined {
  return state.accounts.find((a) => a.id === id);
}
export function accountsForFirm(state: LedgerState, firmId: string): Account[] {
  return state.accounts.filter((a) => a.firmId === firmId);
}
export function payoutsForFirm(state: LedgerState, firmId: string): Payout[] {
  return state.payouts.filter((p) => p.firmId === firmId);
}

export function received(state: LedgerState): Payout[] {
  return state.payouts.filter((p) => p.status === "received");
}
export function pendingPayouts(state: LedgerState): Payout[] {
  return state.payouts.filter((p) => p.status !== "received" && p.status !== "denied");
}
export function upcomingSorted(state: LedgerState): Payout[] {
  return pendingPayouts(state).slice().sort((a, b) => a.date.localeCompare(b.date));
}
export function recentReceived(state: LedgerState): Payout[] {
  return received(state).slice().sort((a, b) => b.date.localeCompare(a.date));
}
export function recentSettled(state: LedgerState): Payout[] {
  // Things that have a final outcome (paid or rejected). Denied are shown for context but
  // are NOT counted in lifetime/totals (those use received() only).
  return state.payouts
    .filter((p) => p.status === "received" || p.status === "denied")
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function lifetimeWithdrawals(state: LedgerState): number {
  return received(state).reduce((s, p) => s + Number(p.amount || 0), 0);
}
function sumInRange(state: LedgerState, filterFn: (p: Payout) => boolean): number {
  return state.payouts.filter(filterFn).reduce((s, p) => s + Number(p.amount || 0), 0);
}
export function earnedToday(state: LedgerState): number {
  const t = today();
  return sumInRange(state, (p) => p.status === "received" && p.date === t);
}
export function earnedThisWeek(state: LedgerState): number {
  const s = startOfWeekISO(today()),
    e = endOfWeekISO(today());
  return sumInRange(state, (p) => p.status === "received" && p.date >= s && p.date <= e);
}
export function earnedThisMonth(state: LedgerState): number {
  const m = monthKey(today());
  return sumInRange(state, (p) => p.status === "received" && monthKey(p.date) === m);
}
export function earnedThisYear(state: LedgerState): number {
  const y = today().slice(0, 4);
  return sumInRange(state, (p) => p.status === "received" && p.date.startsWith(y));
}
export function earnedLastMonth(state: LedgerState): number {
  const d = parseISO(today())!;
  d.setMonth(d.getMonth() - 1);
  const m = localMonthISO(d);
  return sumInRange(state, (p) => p.status === "received" && monthKey(p.date) === m);
}

export function pctDeltaMonthOverMonth(state: LedgerState): number {
  const cur = earnedThisMonth(state);
  const prev = earnedLastMonth(state);
  if (prev === 0) return cur > 0 ? 100 : 0;
  return ((cur - prev) / prev) * 100;
}

export function nextPayout(state: LedgerState): Payout | null {
  return upcomingSorted(state)[0] || null;
}

export function avgPayout(state: LedgerState): number {
  const r = received(state);
  if (!r.length) return 0;
  return r.reduce((s, p) => s + Number(p.amount), 0) / r.length;
}
export function largestPayout(state: LedgerState): Payout | null {
  const r = received(state);
  if (!r.length) return null;
  return r.reduce((a, b) => (Number(a.amount) >= Number(b.amount) ? a : b));
}
export function largestMonth(state: LedgerState): { key: string; total: number } | null {
  const r = received(state);
  if (!r.length) return null;
  const m: Record<string, number> = {};
  r.forEach((p) => {
    const k = monthKey(p.date);
    m[k] = (m[k] || 0) + Number(p.amount);
  });
  let best: { key: string; total: number } | null = null;
  for (const k in m) {
    if (!best || m[k] > best.total) best = { key: k, total: m[k] };
  }
  return best;
}
export function avgMonthlyIncome(state: LedgerState): number {
  const r = received(state);
  if (!r.length) return 0;
  const months = new Set(r.map((p) => monthKey(p.date)));
  return r.reduce((s, p) => s + Number(p.amount), 0) / months.size;
}
export function payoutSuccessRate(state: LedgerState): number | null {
  const total = state.payouts.filter((p) => p.status === "received" || p.status === "denied").length;
  if (!total) return null;
  return (received(state).length / total) * 100;
}
export function paidThisMonthCount(state: LedgerState): number {
  const m = monthKey(today());
  return received(state).filter((p) => monthKey(p.date) === m).length;
}
export function withdrawalStreak(state: LedgerState): number {
  // Consecutive months ending at current month (or last month if current is empty) with ≥1 received
  const r = received(state);
  if (!r.length) return 0;
  const months = new Set(r.map((p) => monthKey(p.date)));
  const cur = parseISO(today())!;
  const pointer = new Date(cur.getFullYear(), cur.getMonth(), 15);
  let streak = 0;
  let started = false;
  for (let i = 0; i < 240; i++) {
    const k = localMonthISO(pointer);
    if (months.has(k)) {
      streak++;
      started = true;
    } else {
      if (started) break;
      // first iteration current-month miss is allowed
      if (i > 0) break;
    }
    pointer.setMonth(pointer.getMonth() - 1);
  }
  return streak;
}
export function daysSinceLastWithdrawal(state: LedgerState): number | null {
  const r = recentReceived(state);
  if (!r.length) return null;
  return daysBetween(r[0].date, today());
}

export function eligibleAccountsCount(state: LedgerState): number {
  // "Passed" accounts are payout-ready
  return state.accounts.filter((a) => a.health === "passed").length;
}

export function pendingTotal(state: LedgerState): number {
  return pendingPayouts(state).reduce((s, p) => s + Number(p.amount || 0), 0);
}

/* ----- Spending / Net ----- */
export function lifetimeSpend(state: LedgerState): number {
  return state.spending.reduce((s, x) => s + Number(x.amount || 0), 0);
}
export function netProfit(state: LedgerState): number {
  return lifetimeWithdrawals(state) - lifetimeSpend(state);
}
export function spendThisMonth(state: LedgerState): number {
  const m = monthKey(today());
  return state.spending.filter((x) => monthKey(x.date) === m).reduce((s, x) => s + Number(x.amount), 0);
}
export function spendThisYear(state: LedgerState): number {
  const y = today().slice(0, 4);
  return state.spending.filter((x) => x.date.startsWith(y)).reduce((s, x) => s + Number(x.amount), 0);
}
export function spendingByCategory(state: LedgerState): Record<SpendingCategory, number> {
  const out = {} as Record<SpendingCategory, number>;
  SPENDING_CATEGORIES.forEach((c) => (out[c.id] = 0));
  state.spending.forEach((x) => {
    out[x.category] = (out[x.category] || 0) + Number(x.amount);
  });
  return out;
}
export function recentSpending(state: LedgerState) {
  return state.spending.slice().sort((a, b) => b.date.localeCompare(a.date));
}
export function expectedThisWeek(state: LedgerState): number {
  const s = startOfWeekISO(today()),
    e = endOfWeekISO(today());
  return pendingPayouts(state)
    .filter((p) => p.date >= s && p.date <= e)
    .reduce((s2, p) => s2 + Number(p.amount), 0);
}
export function expectedThisMonth(state: LedgerState): number {
  const m = monthKey(today());
  return pendingPayouts(state)
    .filter((p) => monthKey(p.date) === m)
    .reduce((s, p) => s + Number(p.amount), 0);
}
export function expectedNextMonth(state: LedgerState): number {
  const d = parseISO(today())!;
  d.setMonth(d.getMonth() + 1);
  const m = localMonthISO(d);
  return pendingPayouts(state)
    .filter((p) => monthKey(p.date) === m)
    .reduce((s, p) => s + Number(p.amount), 0);
}

export interface MonthlyEarningsPoint {
  key: string;
  label: string;
  total: number;
}

export function monthlyEarningsSeries(state: LedgerState, months = 6): MonthlyEarningsPoint[] {
  // Returns last N months including current
  const out: MonthlyEarningsPoint[] = [];
  const now = parseISO(today())!;
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = localMonthISO(d);
    const label = d.toLocaleDateString("en-GB", { month: "short" });
    const total = sumInRange(state, (p) => p.status === "received" && monthKey(p.date) === k);
    out.push({ key: k, label, total });
  }
  return out;
}

/* ---- Average time from submission to payment (days) ---- */
export function avgTimeToPayoutDays(state: LedgerState): number | null {
  // Only payouts that have both a date and status=received can be measured.
  // We treat the payout date as the "expected/submitted" date. To calculate actual
  // wait time we'd need a submission date field, so instead we measure average days
  // between consecutive received payouts. Returns null if insufficient data.
  const r = recentReceived(state);
  if (r.length < 2) return null;
  const sorted = r.slice().sort((a, b) => a.date.localeCompare(b.date));
  let total = 0;
  for (let i = 1; i < sorted.length; i++) {
    total += daysBetween(sorted[i - 1].date, sorted[i].date);
  }
  return Math.round(total / (sorted.length - 1));
}

/* ---- Projected annual income based on trailing 3-month avg ---- */
export function projectedAnnualIncome(state: LedgerState): number {
  const series = monthlyEarningsSeries(state, 3);
  const avg = series.reduce((s, d) => s + d.total, 0) / series.length;
  return avg * 12;
}

/* ---- Payout velocity: % change last 30d vs prior 30d ---- */
export function payoutVelocity(state: LedgerState): number {
  const t = today();
  const now = parseISO(t)!;
  const d30 = new Date(now);
  d30.setDate(d30.getDate() - 30);
  const d60 = new Date(now);
  d60.setDate(d60.getDate() - 60);
  const d30iso = localISO(d30);
  const d60iso = localISO(d60);
  const recent30 = sumInRange(state, (p) => p.status === "received" && p.date > d30iso && p.date <= t);
  const prior30 = sumInRange(state, (p) => p.status === "received" && p.date > d60iso && p.date <= d30iso);
  if (prior30 === 0) return recent30 > 0 ? 100 : 0;
  return Math.round(((recent30 - prior30) / prior30) * 100);
}

export interface FirmLeaderboardEntry {
  firm: Firm;
  total: number;
  count: number;
  denied: number;
  denialRate: number | null;
}

/* ---- Firm leaderboard ---- */
export function firmLeaderboard(state: LedgerState): FirmLeaderboardEntry[] {
  return state.firms
    .map((firm) => {
      const firmPayouts = payoutsForFirm(state, firm.id);
      const firmReceived = firmPayouts.filter((p) => p.status === "received");
      const firmDenied = firmPayouts.filter((p) => p.status === "denied");
      const total = firmReceived.reduce((s, p) => s + Number(p.amount || 0), 0);
      const denialRate =
        firmReceived.length + firmDenied.length > 0
          ? Math.round((firmDenied.length / (firmReceived.length + firmDenied.length)) * 100)
          : null;
      return { firm, total, count: firmReceived.length, denied: firmDenied.length, denialRate };
    })
    .sort((a, b) => b.total - a.total);
}

export interface AccountPassRate {
  rate: number;
  passed: number;
  failed: number;
  total: number;
}

/* ---- Pass rate & Fee ROI ---- */
export function accountPassRate(state: LedgerState): AccountPassRate | null {
  const passed = state.accounts.filter((a) => a.health === "passed").length;
  const failed = state.accounts.filter((a) => a.health === "failed").length;
  const total = passed + failed;
  if (!total) return null;
  return { rate: Math.round((passed / total) * 100), passed, failed, total };
}

export function challengeFees(state: LedgerState): number {
  return state.spending
    .filter((s) => s.category === "account_purchase")
    .reduce((sum, s) => sum + Number(s.amount || 0), 0);
}

export function feeROI(state: LedgerState): number | null {
  const fees = challengeFees(state);
  if (!fees) return null;
  return ((lifetimeWithdrawals(state) - fees) / fees) * 100;
}

/* ----------------------------------------------------------------
   PAYOUTS PAGE — search/filter/countdown
   ---------------------------------------------------------------- */
export type PayoutSearchFilter = "all" | "received" | "pending" | "denied";

export function matchesPayoutSearch(state: LedgerState, p: Payout, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const firm = getFirm(state, p.firmId);
  const acct = getAccount(state, p.accountId);
  return (
    (firm?.name || "").toLowerCase().includes(q) ||
    (acct?.label || "").toLowerCase().includes(q) ||
    String(p.amount).includes(q) ||
    (p.notes || "").toLowerCase().includes(q) ||
    p.date.includes(q) ||
    (p.status || "").includes(q)
  );
}

export function filteredPayouts(state: LedgerState, query: string, filter: PayoutSearchFilter): Payout[] {
  return state.payouts
    .filter((p) => {
      if (filter === "received" && p.status !== "received") return false;
      if (filter === "pending" && p.status !== "awaiting_approval") return false;
      if (filter === "denied" && p.status !== "denied") return false;
      return matchesPayoutSearch(state, p, query);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export interface PayoutCountdown {
  cdClass: "later" | "received" | "denied" | "overdue" | "soon" | "this-week";
  cdText: string;
}

export function payoutCountdown(p: Payout): PayoutCountdown {
  const days = daysBetween(today(), p.date);
  if (p.status === "received") return { cdClass: "received", cdText: "Paid" };
  if (p.status === "denied") return { cdClass: "denied", cdText: "Denied" };
  if (days < 0) return { cdClass: "overdue", cdText: "Overdue" };
  if (days === 0) return { cdClass: "soon", cdText: "Today" };
  if (days <= 3) return { cdClass: "soon", cdText: `${days} ${days === 1 ? "day" : "days"}` };
  if (days <= 7) return { cdClass: "this-week", cdText: `${days} days` };
  return { cdClass: "later", cdText: `${days}d` };
}
