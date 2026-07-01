import type { AccountHealth, PayoutStatus, SpendingCategory } from "@/lib/store/types";

export const PAYOUT_STATUSES: { id: PayoutStatus; label: string }[] = [
  { id: "awaiting_approval", label: "Awaiting Approval" },
  { id: "received", label: "Received" },
  { id: "denied", label: "Denied" },
];

export const HEALTH_STATUSES: { id: AccountHealth; label: string; icon: string }[] = [
  { id: "passed", label: "Funded", icon: "✓" },
  { id: "in_progress", label: "In Progress", icon: "⏳" },
  { id: "failed", label: "Failed", icon: "✕" },
];

export const SPENDING_CATEGORIES: { id: SpendingCategory; label: string; icon: string; color: string }[] = [
  { id: "account_purchase", label: "Account Purchase", icon: "🎯", color: "#a78bfa" },
  { id: "cash_deposit", label: "Cash Deposit", icon: "💵", color: "#ff3333" },
  { id: "subscription", label: "Subscription", icon: "🔄", color: "#fbbf24" },
  { id: "other", label: "Other", icon: "📦", color: "#94a3b8" },
];

// Curated list of well-known prop firms for the picker.
// Users can still type their own via the "Other" option.
export const POPULAR_FIRMS = [
  "AlphaFutures",
  "Apex Trader Funding",
  "Bulenox",
  "Earn2Trade",
  "FTMO",
  "FundedNext",
  "Lucid Trading",
  "Maven Trading",
  "MyFundedFutures",
  "MyFundedFX",
  "The 5%ers",
  "The Funded Trader",
  "Topstep",
  "TradeDay",
  "Tradeify",
];

export function statusLabel(id: string): string {
  return PAYOUT_STATUSES.find((s) => s.id === id)?.label ?? id;
}
export function healthLabel(id: string): string {
  return HEALTH_STATUSES.find((h) => h.id === id)?.label ?? id;
}
export function healthIcon(id: string): string {
  return HEALTH_STATUSES.find((h) => h.id === id)?.icon ?? "";
}
export function categoryMeta(id: string) {
  return SPENDING_CATEGORIES.find((c) => c.id === id) ?? SPENDING_CATEGORIES[3];
}
