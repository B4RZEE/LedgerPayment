import type { LedgerState } from "@/lib/store/types";
import {
  accountPassRate,
  challengeFees,
  lifetimeWithdrawals,
  netProfit,
  received,
  withdrawalStreak,
} from "@/lib/domain/selectors";

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  check: (state: LedgerState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_firm", name: "Getting Started", desc: "Add your first firm", icon: "🚀", color: "#ff3333", check: (s) => s.firms.length >= 1 },
  { id: "first_withdrawal", name: "First Win", desc: "Receive your first payout", icon: "🏆", color: "#f59e0b", check: (s) => received(s).length >= 1 },
  { id: "five_payouts", name: "Momentum", desc: "Receive 5 payouts", icon: "📈", color: "#e01c1c", check: (s) => received(s).length >= 5 },
  { id: "twenty_payouts", name: "Power Trader", desc: "Receive 20 payouts", icon: "⚡", color: "#c7d2fe", check: (s) => received(s).length >= 20 },
  { id: "big_score", name: "Big Score", desc: "Single payout of £1,000+", icon: "💰", color: "#f59e0b", check: (s) => received(s).some((p) => Number(p.amount) >= 1000) },
  { id: "high_roller", name: "High Roller", desc: "Single payout of £5,000+", icon: "💎", color: "#6366f1", check: (s) => received(s).some((p) => Number(p.amount) >= 5000) },
  { id: "whale", name: "Whale", desc: "Single payout of £10,000+", icon: "🐋", color: "#a78bfa", check: (s) => received(s).some((p) => Number(p.amount) >= 10000) },
  { id: "streak_2", name: "Consistent", desc: "Payouts in 2 consecutive months", icon: "🔥", color: "#f97316", check: (s) => withdrawalStreak(s) >= 2 },
  { id: "streak_3", name: "On Fire", desc: "Payouts in 3 consecutive months", icon: "🌶️", color: "#ef4444", check: (s) => withdrawalStreak(s) >= 3 },
  { id: "streak_6", name: "Unstoppable", desc: "Payouts in 6 consecutive months", icon: "🌟", color: "#fbbf24", check: (s) => withdrawalStreak(s) >= 6 },
  { id: "ten_k", name: "Five Figures", desc: "Lifetime withdrawals hit £10,000", icon: "💸", color: "#e01c1c", check: (s) => lifetimeWithdrawals(s) >= 10000 },
  { id: "fifty_k", name: "Elite Trader", desc: "Lifetime withdrawals hit £50,000", icon: "👑", color: "#a78bfa", check: (s) => lifetimeWithdrawals(s) >= 50000 },
  { id: "profitable", name: "In Profit", desc: "Withdrawals exceed your challenge fees", icon: "✅", color: "#ff3333", check: (s) => challengeFees(s) > 0 && netProfit(s) > 0 },
  { id: "multi_firm", name: "Multi-Firm", desc: "Receive payouts from 3+ different firms", icon: "🏢", color: "#0ea5e9", check: (s) => new Set(received(s).map((p) => p.firmId).filter(Boolean)).size >= 3 },
  { id: "sharp_eye", name: "Sharp Eye", desc: "80%+ challenge pass rate (min 3 attempts)", icon: "🎯", color: "#ff3333", check: (s) => { const pr = accountPassRate(s); return !!pr && pr.total >= 3 && pr.rate >= 80; } },
  { id: "journal_7", name: "Journaling", desc: "Write 7+ journal entries", icon: "📓", color: "#94a3b8", check: (s) => s.journal.length >= 7 },
];

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
}

export function getAchievements(state: LedgerState): AchievementWithStatus[] {
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check(state) }));
}

export function unlockedAchievements(state: LedgerState): AchievementWithStatus[] {
  return getAchievements(state).filter((a) => a.unlocked);
}

// Diffs currently-unlocked achievements against what's already been notified. Called by the
// store's change subscriber (lib/store/sync.ts) after every mutation — cheap (16 pure boolean
// checks) and catches unlocks regardless of what changed, mirroring the original
// checkAchievementUnlocks()'s "re-check on every save" behavior.
export function findNewlyUnlockedAchievements(state: LedgerState): Achievement[] {
  const seen = new Set(state.profile.unlockedAchievementIds || []);
  return unlockedAchievements(state).filter((a) => !seen.has(a.id));
}
