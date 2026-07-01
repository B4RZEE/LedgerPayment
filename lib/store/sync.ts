import { DEFAULT_STATE, type LedgerState } from "@/lib/store/types";
import { getLedgerState, useLedgerStore } from "@/lib/store/ledgerStore";
import { findNewlyUnlockedAchievements, unlockedAchievements } from "@/lib/domain/achievements";
import { createNotification } from "@/lib/domain/notifications";
import { syncToSupabase } from "@/lib/supabase/sync";

/* ================================================================
   LOCAL STORAGE (loadState/saveState's localStorage half)
   ================================================================ */
const STORAGE_KEY = "ledger_dashboard_v1";

function scopedKey(base: string, userId: string | null): string {
  return userId ? `${base}::${userId}` : base;
}

export function loadFromLocalStorage(userId: string | null): LedgerState {
  try {
    const raw = localStorage.getItem(scopedKey(STORAGE_KEY, userId));
    if (!raw) return structuredClone(DEFAULT_STATE);
    const saved = JSON.parse(raw);

    const state: LedgerState = {
      profile: {
        ...DEFAULT_STATE.profile,
        ...(saved.profile || {}),
        goals: { ...DEFAULT_STATE.profile.goals, ...((saved.profile || {}).goals || {}) },
      },
      firms: saved.firms || [],
      accounts: saved.accounts || [],
      payouts: saved.payouts || [],
      spending: saved.spending || [],
      journal: saved.journal || [],
      notifications: saved.notifications || [],
      ui: { ...DEFAULT_STATE.ui, ...(saved.ui || {}) },
    };

    // Migration: retired statuses ("needs_trading_days", "being_paid") collapse into "awaiting_approval"
    state.payouts.forEach((p) => {
      if ((p.status as string) === "needs_trading_days" || (p.status as string) === "being_paid") {
        p.status = "awaiting_approval";
      }
    });
    // Migration: old account health statuses → new Passed/In Progress/Failed
    state.accounts.forEach((a) => {
      if ((a.health as string) === "eligible" || (a.health as string) === "ready") a.health = "passed";
      else if ((a.health as string) === "building" || (a.health as string) === "needs_days") a.health = "in_progress";
    });
    // Migration: users upgrading from before achievement notifications existed already have
    // unlocked badges — backfill silently so they aren't flooded with "unlocked" notifications
    // for things they earned long ago.
    if (saved.profile?.unlockedAchievementIds === undefined && (state.firms.length || state.payouts.length || state.journal.length)) {
      state.profile.unlockedAchievementIds = unlockedAchievements(state).map((a) => a.id);
    }

    return state;
  } catch (e) {
    console.warn("loadFromLocalStorage failed:", e);
    return structuredClone(DEFAULT_STATE);
  }
}

function saveToLocalStorage(userId: string | null, state: LedgerState) {
  try {
    localStorage.setItem(scopedKey(STORAGE_KEY, userId), JSON.stringify(state));
  } catch (e) {
    console.error("save failed", e);
  }
}

/* ================================================================
   STORE SUBSCRIBER
   Ported from saveState()'s three responsibilities — run on every
   mutation via the store's own change subscription instead of requiring
   every call site to remember to invoke a save function:
     1. achievement check (synchronous, may add notifications)
     2. debounced localStorage write (200ms)
     3. debounced Supabase push (1000ms, skipped for ui-only changes —
        `ui` was never synced to any Supabase table in the original either)
   ================================================================ */
let localSaveTimer: ReturnType<typeof setTimeout> | null = null;
let supabaseSyncTimer: ReturnType<typeof setTimeout> | null = null;
let unsubscribe: (() => void) | null = null;

export function initLedgerSync(): () => void {
  if (unsubscribe) return unsubscribe; // idempotent — safe to call once per app boot

  unsubscribe = useLedgerStore.subscribe((store, prevStore) => {
    const domainChanged =
      store.firms !== prevStore.firms ||
      store.accounts !== prevStore.accounts ||
      store.payouts !== prevStore.payouts ||
      store.spending !== prevStore.spending ||
      store.journal !== prevStore.journal ||
      store.notifications !== prevStore.notifications ||
      store.profile !== prevStore.profile;
    const uiChanged = store.ui !== prevStore.ui;
    if (!domainChanged && !uiChanged) return;

    // 1. Achievement check — only meaningful if something other than notifications/profile-only
    // (e.g. unlockedAchievementIds itself, which this very check writes to) changed. Comparing
    // against the notification/profile fields we just wrote avoids an infinite subscribe loop:
    // once unlockAchievements() applies, firms/accounts/payouts/etc. references are unchanged
    // on the next tick, so domainChanged is false and this block doesn't re-run.
    const newly = findNewlyUnlockedAchievements(getLedgerState(store));
    if (newly.length) {
      const ids = newly.map((a) => a.id);
      const notifications = newly.map((a) => createNotification("achievement_unlocked", `Achievement unlocked: ${a.name}`, a.desc, { achievementId: a.id }));
      store.actions.unlockAchievements(ids, notifications);
      return; // the unlockAchievements() call above re-triggers this subscriber; let that pass handle 2/3
    }

    // 2. Debounced localStorage write
    if (localSaveTimer) clearTimeout(localSaveTimer);
    localSaveTimer = setTimeout(() => saveToLocalStorage(store.userId, getLedgerState(store)), 200);

    // 3. Debounced Supabase push (skip for ui-only changes, and when logged out)
    if (domainChanged && store.userId) {
      if (supabaseSyncTimer) clearTimeout(supabaseSyncTimer);
      const userId = store.userId;
      supabaseSyncTimer = setTimeout(() => void syncToSupabase(userId, getLedgerState(useLedgerStore.getState())), 1000);
    }
  });

  return unsubscribe;
}

export function stopLedgerSync(): void {
  unsubscribe?.();
  unsubscribe = null;
  if (localSaveTimer) clearTimeout(localSaveTimer);
  if (supabaseSyncTimer) clearTimeout(supabaseSyncTimer);
}
