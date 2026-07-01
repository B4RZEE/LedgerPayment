export interface Profile {
  firstName: string; // set at signup, immutable in-app
  lastName: string; // set at signup, immutable in-app
  username: string; // optional, unique, user-editable
  goals: { daily: number; weekly: number; monthly: number; annual: number };
  unlockedAchievementIds: string[]; // achievement ids already notified — prevents re-notifying on every check
}

export interface Firm {
  id: string;
  name: string;
}

export type AccountHealth = "passed" | "in_progress" | "failed" | "active";

export interface Account {
  id: string;
  firmId: string;
  label: string;
  health: AccountHealth;
}

export type PayoutStatus = "awaiting_approval" | "received" | "denied";

export interface Payout {
  id: string;
  firmId: string;
  accountId: string;
  amount: number;
  date: string; // ISO date, YYYY-MM-DD
  status: PayoutStatus;
  notes: string;
}

export type SpendingCategory = "account_purchase" | "cash_deposit" | "subscription" | "other";

export interface Spending {
  id: string;
  firmId: string;
  accountId: string;
  amount: number;
  date: string;
  category: SpendingCategory;
  notes: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
}

export type NotificationType = "payout_upcoming" | "achievement_unlocked";

export interface NotificationPayload {
  payoutId?: string;
  achievementId?: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  payload: NotificationPayload | null;
  read: boolean;
  createdAt: string; // ISO timestamp
}

export interface UiState {
  calendarMonth: string | null; // YYYY-MM
}

export interface LedgerState {
  profile: Profile;
  firms: Firm[];
  accounts: Account[];
  payouts: Payout[];
  spending: Spending[];
  journal: JournalEntry[];
  notifications: AppNotification[];
  ui: UiState;
}

export const DEFAULT_STATE: LedgerState = {
  profile: {
    firstName: "",
    lastName: "",
    username: "",
    goals: { daily: 100, weekly: 700, monthly: 5000, annual: 50000 },
    unlockedAchievementIds: [],
  },
  firms: [],
  accounts: [],
  payouts: [],
  spending: [],
  journal: [],
  notifications: [],
  ui: { calendarMonth: null },
};
