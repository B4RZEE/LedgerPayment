import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DEFAULT_STATE, type Account, type AppNotification, type Firm, type JournalEntry, type LedgerState, type Payout, type Profile, type Spending } from "@/lib/store/types";
import { dbDelete, dbDeleteJournal } from "@/lib/supabase/sync";
import { uid } from "@/lib/uid";

interface LedgerActions {
  /** Full-state replace — used after loading from localStorage or Supabase. */
  hydrate: (state: LedgerState) => void;
  /** Back to DEFAULT_STATE — used on logout. */
  reset: () => void;

  setUserId: (userId: string | null) => void;

  setProfile: (patch: Partial<Omit<Profile, "goals" | "unlockedAchievementIds">>) => void;
  setGoals: (patch: Partial<Profile["goals"]>) => void;

  upsertFirm: (firm: Firm) => void;
  deleteFirm: (id: string) => void;

  upsertAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;

  upsertPayout: (payout: Payout) => void;
  deletePayout: (id: string) => void;

  upsertSpending: (spending: Spending) => void;
  deleteSpending: (id: string) => void;

  saveJournalEntry: (date: string, text: string) => void;

  addNotification: (n: AppNotification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  /** Atomically records newly-unlocked achievement ids and files one notification per id —
   *  single set() call so the sync subscriber only re-enters once, not once per achievement. */
  unlockAchievements: (ids: string[], notifications: AppNotification[]) => void;

  setCalendarMonth: (month: string | null) => void;
}

export type LedgerStore = LedgerState & {
  /** Supabase auth user id, set once after login — not part of DEFAULT_STATE since it's
   *  session metadata, not ledger data (never persisted to localStorage/Supabase as a field). */
  userId: string | null;
  actions: LedgerActions;
};

export const useLedgerStore = create<LedgerStore>()(
  immer((set) => ({
    ...DEFAULT_STATE,
    userId: null,

    actions: {
      hydrate: (state) =>
        set((draft) => {
          Object.assign(draft, state);
        }),

      reset: () =>
        set((draft) => {
          Object.assign(draft, DEFAULT_STATE);
        }),

      setUserId: (userId) =>
        set((draft) => {
          draft.userId = userId;
        }),

      setProfile: (patch) =>
        set((draft) => {
          Object.assign(draft.profile, patch);
        }),
      setGoals: (patch) =>
        set((draft) => {
          Object.assign(draft.profile.goals, patch);
        }),

      upsertFirm: (firm) =>
        set((draft) => {
          const i = draft.firms.findIndex((f) => f.id === firm.id);
          if (i === -1) draft.firms.push(firm);
          else draft.firms[i] = firm;
        }),
      deleteFirm: (id) => {
        set((draft) => {
          draft.firms = draft.firms.filter((f) => f.id !== id);
        });
        void dbDelete("firms", id);
      },

      upsertAccount: (account) =>
        set((draft) => {
          const i = draft.accounts.findIndex((a) => a.id === account.id);
          if (i === -1) draft.accounts.push(account);
          else draft.accounts[i] = account;
        }),
      deleteAccount: (id) => {
        set((draft) => {
          draft.accounts = draft.accounts.filter((a) => a.id !== id);
        });
        void dbDelete("accounts", id);
      },

      upsertPayout: (payout) =>
        set((draft) => {
          const i = draft.payouts.findIndex((p) => p.id === payout.id);
          if (i === -1) draft.payouts.push(payout);
          else draft.payouts[i] = payout;
        }),
      deletePayout: (id) => {
        set((draft) => {
          draft.payouts = draft.payouts.filter((p) => p.id !== id);
        });
        void dbDelete("payouts", id);
      },

      upsertSpending: (spending) =>
        set((draft) => {
          const i = draft.spending.findIndex((s) => s.id === spending.id);
          if (i === -1) draft.spending.push(spending);
          else draft.spending[i] = spending;
        }),
      deleteSpending: (id) => {
        set((draft) => {
          draft.spending = draft.spending.filter((s) => s.id !== id);
        });
        void dbDelete("spending", id);
      },

      saveJournalEntry: (date, text) => {
        let userId: string | null = null;
        set((draft) => {
          userId = draft.userId;
          const existing = draft.journal.findIndex((j) => j.date === date);
          if (text.trim() === "") {
            if (existing !== -1) draft.journal.splice(existing, 1);
          } else if (existing !== -1) {
            draft.journal[existing].text = text;
          } else {
            draft.journal.push({ id: uid(), date, text });
          }
        });
        // Journal upserts use (user_id, date) as the conflict target (see syncToSupabase), so
        // removed entries need an explicit delete-by-date — omitting them from the next upsert
        // batch does not delete the corresponding remote row.
        if (text.trim() === "" && userId) void dbDeleteJournal(userId, date);
      },

      addNotification: (n) =>
        set((draft) => {
          draft.notifications.unshift(n);
          // Cap the inbox so it can't grow unbounded for long-lived accounts
          if (draft.notifications.length > 200) draft.notifications.length = 200;
        }),
      markNotificationRead: (id) =>
        set((draft) => {
          const n = draft.notifications.find((n) => n.id === id);
          if (n && !n.read) n.read = true;
        }),
      markAllNotificationsRead: () =>
        set((draft) => {
          draft.notifications.forEach((n) => {
            n.read = true;
          });
        }),
      unlockAchievements: (ids, notifications) =>
        set((draft) => {
          draft.profile.unlockedAchievementIds = [...draft.profile.unlockedAchievementIds, ...ids];
          draft.notifications.unshift(...notifications);
          if (draft.notifications.length > 200) draft.notifications.length = 200;
        }),

      setCalendarMonth: (month) =>
        set((draft) => {
          draft.ui.calendarMonth = month;
        }),
    },
  }))
);

/** Selector helper: pulls only the domain state, dropping userId/actions — useful anywhere
 *  a plain LedgerState is needed (selectors, achievement checks, sync). */
export function getLedgerState(store: LedgerStore): LedgerState {
  const { userId: _userId, actions: _actions, ...state } = store;
  return state;
}
