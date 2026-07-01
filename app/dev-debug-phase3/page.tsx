"use client";

// TEMPORARY — Phase 3 verification page. Not linked from anywhere, not under /app/* so it
// isn't auth-gated. Delete before cutover (Phase 12).

import { useEffect, useState } from "react";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { initLedgerSync } from "@/lib/store/sync";
import * as sel from "@/lib/domain/selectors";
import { getAchievements, unlockedAchievements } from "@/lib/domain/achievements";
import { unreadNotificationCount } from "@/lib/domain/notifications";
import { fmtGBP } from "@/lib/format";
import type { LedgerState } from "@/lib/store/types";

const SYNTHETIC_STATE: LedgerState = {
  profile: {
    firstName: "Jane",
    lastName: "Doe",
    username: "jdoe",
    goals: { daily: 100, weekly: 700, monthly: 5000, annual: 50000 },
    unlockedAchievementIds: [],
  },
  firms: [
    { id: "firmA", name: "AlphaFutures" },
    { id: "firmB", name: "Topstep" },
    { id: "firmC", name: "FTMO" },
  ],
  accounts: [
    { id: "acctA1", firmId: "firmA", label: "100k", health: "passed" },
    { id: "acctA2", firmId: "firmA", label: "50k", health: "passed" },
    { id: "acctB1", firmId: "firmB", label: "50k", health: "failed" },
    { id: "acctC1", firmId: "firmC", label: "25k", health: "in_progress" },
  ],
  payouts: [
    // received: 6 total, across firmA (5) and firmB (1), spanning 3 consecutive months
    { id: "p1", firmId: "firmA", accountId: "acctA1", amount: 500, date: "2026-05-03", status: "received", notes: "" },
    { id: "p2", firmId: "firmA", accountId: "acctA1", amount: 1200, date: "2026-05-20", status: "received", notes: "" },
    { id: "p3", firmId: "firmA", accountId: "acctA2", amount: 7500, date: "2026-06-05", status: "received", notes: "" },
    { id: "p4", firmId: "firmA", accountId: "acctA2", amount: 300, date: "2026-06-15", status: "received", notes: "" },
    { id: "p5", firmId: "firmB", accountId: "acctB1", amount: 12000, date: "2026-07-01", status: "received", notes: "" },
    { id: "p6", firmId: "firmA", accountId: "acctA1", amount: 250, date: "2026-07-01", status: "received", notes: "" },
    // denied: 1 (firmA)
    { id: "p7", firmId: "firmA", accountId: "acctA1", amount: 400, date: "2026-06-10", status: "denied", notes: "" },
    // awaiting: 2 (firmC, firmB)
    { id: "p8", firmId: "firmC", accountId: "acctC1", amount: 900, date: "2026-07-05", status: "awaiting_approval", notes: "" },
    { id: "p9", firmId: "firmB", accountId: "acctB1", amount: 600, date: "2026-07-10", status: "awaiting_approval", notes: "" },
  ],
  spending: [
    { id: "s1", firmId: "firmA", accountId: "acctA1", amount: 150, date: "2026-05-01", category: "account_purchase", notes: "" },
    { id: "s2", firmId: "firmB", accountId: "acctB1", amount: 100, date: "2026-05-15", category: "account_purchase", notes: "" },
    { id: "s3", firmId: "", accountId: "", amount: 50, date: "2026-06-01", category: "subscription", notes: "" },
  ],
  journal: [
    { id: "j1", date: "2026-06-01", text: "note 1" },
    { id: "j2", date: "2026-06-02", text: "note 2" },
  ],
  notifications: [],
  ui: { calendarMonth: null },
};

// Hand-computed expected values for SYNTHETIC_STATE (relative to "today" being whatever the
// test runs on — the date-relative selectors like earnedToday/streak are checked separately,
// everything else here is date-agnostic against the fixture).
const EXPECTED = {
  receivedCount: 6,
  lifetimeWithdrawals: 500 + 1200 + 7500 + 300 + 12000 + 250, // 21750
  lifetimeSpend: 150 + 100 + 50, // 300
  netProfit: 21750 - 300, // 21450
  avgPayout: 21750 / 6, // 3625
  largestPayoutAmount: 12000,
  payoutSuccessRate: (6 / 7) * 100, // 6 received / (6 received + 1 denied)
  pendingTotal: 900 + 600, // 1500
  challengeFees: 150 + 100, // 250 (account_purchase only)
  feeROI: ((21750 - 250) / 250) * 100, // 8600
  accountPassRateRate: Math.round((2 / 3) * 100), // 2 passed / (2 passed + 1 failed)
  firmALeaderboardTotal: 500 + 1200 + 7500 + 300 + 250, // 9750
  firmBLeaderboardTotal: 12000,
  // Date-sensitive: fixture payouts fall in May/Jun/Jul 2026 deliberately, so this only holds
  // while "today" is within July 2026 (the date this fixture was authored against).
  // True achievements for this fixture: first_firm, first_withdrawal, five_payouts, big_score,
  // high_roller, whale, streak_2, streak_3, ten_k, profitable.
  // False: twenty_payouts (6<20), streak_6 (streak=3), fifty_k (21750<50000),
  // multi_firm (only firmA+firmB received, needs 3), sharp_eye (pass rate 67%<80%), journal_7 (2<7).
  unlockedAchievementCount: 10,
};

export default function DebugPhase3Page() {
  const [ready, setReady] = useState(false);
  const store = useLedgerStore();

  useEffect(() => {
    const stop = initLedgerSync();
    useLedgerStore.getState().actions.hydrate(SYNTHETIC_STATE);
    setReady(true);
    return stop;
  }, []);

  if (!ready) return <div>loading…</div>;

  const state = getLedgerState(store);
  const achievements = getAchievements(state);
  const unlocked = unlockedAchievements(state);
  const leaderboard = sel.firmLeaderboard(state);

  const rows: [string, string | number][] = [
    ["received().length", sel.received(state).length],
    ["EXPECTED receivedCount", EXPECTED.receivedCount],
    ["lifetimeWithdrawals", sel.lifetimeWithdrawals(state)],
    ["EXPECTED lifetimeWithdrawals", EXPECTED.lifetimeWithdrawals],
    ["lifetimeSpend", sel.lifetimeSpend(state)],
    ["EXPECTED lifetimeSpend", EXPECTED.lifetimeSpend],
    ["netProfit", sel.netProfit(state)],
    ["EXPECTED netProfit", EXPECTED.netProfit],
    ["avgPayout", sel.avgPayout(state)],
    ["EXPECTED avgPayout", EXPECTED.avgPayout],
    ["largestPayout.amount", sel.largestPayout(state)?.amount ?? "null"],
    ["EXPECTED largestPayoutAmount", EXPECTED.largestPayoutAmount],
    ["payoutSuccessRate", sel.payoutSuccessRate(state) ?? "null"],
    ["EXPECTED payoutSuccessRate", EXPECTED.payoutSuccessRate],
    ["pendingTotal", sel.pendingTotal(state)],
    ["EXPECTED pendingTotal", EXPECTED.pendingTotal],
    ["challengeFees", sel.challengeFees(state)],
    ["EXPECTED challengeFees", EXPECTED.challengeFees],
    ["feeROI", sel.feeROI(state) ?? "null"],
    ["EXPECTED feeROI", EXPECTED.feeROI],
    ["accountPassRate.rate", sel.accountPassRate(state)?.rate ?? "null"],
    ["EXPECTED accountPassRateRate", EXPECTED.accountPassRateRate],
    ["firmLeaderboard[firmA].total", leaderboard.find((l) => l.firm.id === "firmA")?.total ?? "null"],
    ["EXPECTED firmALeaderboardTotal", EXPECTED.firmALeaderboardTotal],
    ["firmLeaderboard[firmB].total", leaderboard.find((l) => l.firm.id === "firmB")?.total ?? "null"],
    ["EXPECTED firmBLeaderboardTotal", EXPECTED.firmBLeaderboardTotal],
    ["withdrawalStreak (3 consecutive months: May/Jun/Jul, date-sensitive)", sel.withdrawalStreak(state)],
    ["fmtGBP(lifetimeWithdrawals)", fmtGBP(sel.lifetimeWithdrawals(state))],
    ["achievements.length (total defined)", achievements.length],
    ["unlockedAchievements.length (pure check against fixture)", unlocked.length],
    ["EXPECTED unlockedAchievementCount", EXPECTED.unlockedAchievementCount],
    ["unlocked ids", unlocked.map((a) => a.id).join(", ")],
    ["unreadNotificationCount (post-hydrate: subscriber fires achievement notifs synchronously)", unreadNotificationCount(state)],
  ];

  return (
    <div style={{ fontFamily: "monospace", padding: 24, whiteSpace: "pre", fontSize: 13 }}>
      <div data-testid="rows">
        {rows.map(([label, value]) => (
          <div key={label} data-row={label}>
            {label.padEnd(55)} = {String(value)}
          </div>
        ))}
      </div>
      <hr />
      <div data-testid="store-notifications-count">store.notifications.length = {store.notifications.length}</div>
      <div data-testid="store-unlocked-ids">store.profile.unlockedAchievementIds = {JSON.stringify(store.profile.unlockedAchievementIds)}</div>
      <button
        data-testid="mutate-btn"
        onClick={() => {
          // Adding a firm doesn't cross any new achievement threshold — notifications.length
          // should stay unchanged after this (proves no duplicate/spurious notifications fire).
          useLedgerStore.getState().actions.upsertFirm({ id: "firmD", name: "Extra Firm" });
        }}
      >
        Trigger no-op mutation (add firm, no new achievement)
      </button>
      <button
        data-testid="unlock-btn"
        onClick={() => {
          // Pushes received() from 6 to 21, crossing twenty_payouts (>=20) — notifications.length
          // should increase by exactly 1 and unlockedAchievementIds should gain "twenty_payouts".
          for (let i = 0; i < 15; i++) {
            useLedgerStore.getState().actions.upsertPayout({
              id: `extra-${i}`,
              firmId: "firmA",
              accountId: "acctA1",
              amount: 10,
              date: "2026-07-02",
              status: "received",
              notes: "",
            });
          }
        }}
      >
        Trigger new achievement unlock (twenty_payouts)
      </button>
    </div>
  );
}
