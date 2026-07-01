export interface PageConfig {
  id: string;
  label: string;
  icon: string;
  section: "main" | "account";
  /** Gated behind a Pro subscription (see PRO_PAGES in the original — TESTING_MODE
   *  currently disables all tier gates app-wide, ported when Settings/tier UI is built). */
  pro?: boolean;
}

export const PAGES: PageConfig[] = [
  { id: "dashboard", label: "Dashboard", icon: "home", section: "main" },
  { id: "payouts", label: "Payouts", icon: "money", section: "main" },
  { id: "analytics", label: "Analytics", icon: "chart", section: "main", pro: true },
  { id: "firms", label: "Firms & Accounts", icon: "building", section: "main" },
  { id: "milestones", label: "Milestones", icon: "medal", section: "main" },
  { id: "calendar", label: "Calendar", icon: "calendar", section: "main", pro: true },
  { id: "stats", label: "Statistics", icon: "stats", section: "main", pro: true },
  { id: "settings", label: "Settings", icon: "settings", section: "account" },
];

export const MOBILE_PAGES: { id: string; label: string; icon: string }[] = [
  { id: "dashboard", label: "Home", icon: "home" },
  { id: "payouts", label: "Payouts", icon: "money" },
  { id: "firms", label: "Firms", icon: "building" },
  { id: "analytics", label: "Stats", icon: "chart" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export function pagePath(id: string): string {
  return `/app/${id}`;
}
