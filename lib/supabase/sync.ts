import { createClient } from "@/lib/supabase/client";
import { DEFAULT_STATE, type Account, type AppNotification, type Firm, type JournalEntry, type LedgerState, type Payout, type Spending } from "@/lib/store/types";
import { unlockedAchievements } from "@/lib/domain/achievements";

/* ================================================================
   SUPABASE DATA SYNC
   Ported from public/app.html's syncToSupabase/syncFromSupabase/dbDelete*.
   Plain async functions taking/returning plain state objects instead of
   reading/writing a module-global `state` — keeps this layer unit-testable
   and decoupled from the Zustand store (lib/store/sync.ts wires the two
   together).
   ================================================================ */

export async function syncToSupabase(userId: string, state: LedgerState): Promise<void> {
  const supabase = createClient();
  const firmIds = new Set(state.firms.map((f) => f.id));
  const accountIds = new Set(state.accounts.map((a) => a.id));
  try {
    // Step 1 — profile + firms (no deps on each other)
    await Promise.all([
      supabase.from("profiles").upsert(
        {
          id: userId,
          first_name: state.profile.firstName || null,
          last_name: state.profile.lastName || null,
          username: state.profile.username ? state.profile.username.toLowerCase() : null,
          goals_daily: state.profile.goals.daily,
          goals_weekly: state.profile.goals.weekly,
          goals_monthly: state.profile.goals.monthly,
          goals_annual: state.profile.goals.annual,
          unlocked_achievements: state.profile.unlockedAchievementIds || [],
        },
        { onConflict: "id" }
      ),
      state.firms.length
        ? supabase.from("firms").upsert(
            state.firms.map((f) => ({ id: f.id, user_id: userId, name: f.name })),
            { onConflict: "id" }
          )
        : Promise.resolve(),
    ]);
    // Step 2 — accounts (FK firms)
    if (state.accounts.length) {
      await supabase.from("accounts").upsert(
        state.accounts.map((a) => ({ id: a.id, user_id: userId, firm_id: a.firmId, label: a.label, health: a.health || "active" })),
        { onConflict: "id" }
      );
    }
    // Step 3 — payouts, spending, journal, notifications (FK firms + accounts)
    await Promise.all([
      state.payouts.length
        ? supabase.from("payouts").upsert(
            state.payouts.map((p) => ({
              id: p.id,
              user_id: userId,
              firm_id: firmIds.has(p.firmId) ? p.firmId : null,
              account_id: accountIds.has(p.accountId) ? p.accountId : null,
              amount: p.amount,
              date: p.date,
              status: p.status,
              notes: p.notes || null,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve(),
      state.spending.length
        ? supabase.from("spending").upsert(
            state.spending.map((s) => ({
              id: s.id,
              user_id: userId,
              firm_id: firmIds.has(s.firmId) ? s.firmId : null,
              account_id: accountIds.has(s.accountId) ? s.accountId : null,
              amount: s.amount,
              date: s.date,
              category: s.category || "other",
              notes: s.notes || null,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve(),
      state.journal.length
        ? supabase.from("journal").upsert(
            state.journal.map((j) => ({ user_id: userId, date: j.date, text: j.text })),
            { onConflict: "user_id,date" }
          )
        : Promise.resolve(),
      state.notifications.length
        ? supabase.from("notifications").upsert(
            state.notifications.map((n) => ({
              id: n.id,
              user_id: userId,
              type: n.type,
              title: n.title,
              body: n.body || null,
              payload: n.payload || null,
              read: n.read,
              created_at: n.createdAt,
            })),
            { onConflict: "id" }
          )
        : Promise.resolve(),
    ]);
  } catch (e) {
    console.warn("syncToSupabase failed:", e);
  }
}

export interface SyncFromSupabaseResult {
  state: LedgerState;
  subscriptionTier: string | null;
}

export async function syncFromSupabase(userId: string, localState: LedgerState): Promise<SyncFromSupabaseResult | null> {
  const supabase = createClient();
  try {
    const [profileRes, firmsRes, acctRes, payRes, spendRes, jRes, notifRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("firms").select("*").eq("user_id", userId),
      supabase.from("accounts").select("*").eq("user_id", userId),
      supabase.from("payouts").select("*").eq("user_id", userId),
      supabase.from("spending").select("*").eq("user_id", userId),
      supabase.from("journal").select("*").eq("user_id", userId),
      supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    const pr = profileRes.data;
    const firms = firmsRes.data || [];
    const accounts = acctRes.data || [];
    const payouts = payRes.data || [];
    const spending = spendRes.data || [];
    const journal = jRes.data || [];
    const notifs = notifRes.data || [];
    const subscriptionTier: string | null = pr?.subscription_tier ?? null;

    const hasRemote = firms.length || accounts.length || payouts.length || spending.length;
    const hasLocal = localState.firms.length || localState.payouts.length || localState.spending.length;
    if (!hasRemote && hasLocal) {
      // Local has data the remote has never seen (e.g. first sync after this device was
      // offline-first) — push instead of overwriting local with an empty remote.
      await syncToSupabase(userId, localState);
      return null;
    }
    if (!hasRemote && !hasLocal) return null; // brand-new user — nothing to sync

    let state: LedgerState = {
      profile: {
        // first_name/last_name fall back to old profile.name for users who signed up before this migration
        firstName: pr?.first_name || (pr?.name && !pr?.first_name ? pr.name : "") || localState.profile.firstName || "",
        lastName: pr?.last_name || localState.profile.lastName || "",
        username: pr?.username || localState.profile.username || "",
        goals: {
          daily: pr?.goals_daily ?? localState.profile.goals.daily,
          weekly: pr?.goals_weekly ?? localState.profile.goals.weekly,
          monthly: pr?.goals_monthly ?? localState.profile.goals.monthly,
          annual: pr?.goals_annual ?? localState.profile.goals.annual,
        },
        unlockedAchievementIds:
          Array.isArray(pr?.unlocked_achievements) && pr.unlocked_achievements.length
            ? pr.unlocked_achievements
            : localState.profile.unlockedAchievementIds || [],
      },
      firms: firms.map((f): Firm => ({ id: f.id, name: f.name })),
      accounts: accounts.map((a): Account => ({ id: a.id, firmId: a.firm_id, label: a.label, health: a.health })),
      payouts: payouts.map(
        (p): Payout => ({
          id: p.id,
          firmId: p.firm_id || "",
          accountId: p.account_id || "",
          amount: Number(p.amount),
          date: p.date,
          status: p.status,
          notes: p.notes || "",
        })
      ),
      spending: spending.map(
        (s): Spending => ({
          id: s.id,
          firmId: s.firm_id || "",
          accountId: s.account_id || "",
          amount: Number(s.amount),
          date: s.date,
          category: s.category,
          notes: s.notes || "",
        })
      ),
      journal: journal.map((j): JournalEntry => ({ id: String(j.id), date: j.date, text: j.text })),
      notifications: notifs.map(
        (n): AppNotification => ({
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body || "",
          payload: n.payload || null,
          read: !!n.read,
          createdAt: n.created_at,
        })
      ),
      ui: localState.ui,
    };

    // Migration: remote `unlocked_achievements` is empty (new column, or never synced) but the
    // user already has real trading history — backfill silently so existing users aren't
    // flooded with "unlocked" notifications for badges they already earned.
    if (!state.profile.unlockedAchievementIds.length && (state.firms.length || state.payouts.length || state.journal.length)) {
      state = {
        ...state,
        profile: { ...state.profile, unlockedAchievementIds: unlockedAchievements(state).map((a) => a.id) },
      };
    }

    return { state, subscriptionTier };
  } catch (e) {
    console.warn("syncFromSupabase failed:", e);
    return null;
  }
}

export async function dbDelete(table: "firms" | "accounts" | "payouts" | "spending" | "notifications", id: string): Promise<void> {
  const supabase = createClient();
  try {
    await supabase.from(table).delete().eq("id", id);
  } catch {
    // Best-effort — the next full syncToSupabase pass doesn't re-delete stale rows (it only
    // upserts), so a failed delete here just means a stale row lingers until retried.
  }
}

export async function dbDeleteJournal(userId: string, date: string): Promise<void> {
  const supabase = createClient();
  try {
    await supabase.from("journal").delete().eq("user_id", userId).eq("date", date);
  } catch {
    // Best-effort, see dbDelete.
  }
}

export async function dbDeleteAll(userId: string): Promise<void> {
  const supabase = createClient();
  try {
    // Delete children before parents to respect FK constraints
    await Promise.all([
      supabase.from("journal").delete().eq("user_id", userId),
      supabase.from("spending").delete().eq("user_id", userId),
      supabase.from("payouts").delete().eq("user_id", userId),
    ]);
    await supabase.from("accounts").delete().eq("user_id", userId);
    await supabase.from("firms").delete().eq("user_id", userId);
    await supabase.from("profiles").upsert(
      {
        id: userId,
        username: null,
        goals_daily: DEFAULT_STATE.profile.goals.daily,
        goals_weekly: DEFAULT_STATE.profile.goals.weekly,
        goals_monthly: DEFAULT_STATE.profile.goals.monthly,
        goals_annual: DEFAULT_STATE.profile.goals.annual,
      },
      { onConflict: "id" }
    );
  } catch (e) {
    console.warn("dbDeleteAll failed:", e);
  }
}
