import { create } from "zustand";
import type { ReactNode } from "react";

export type Theme = "dark" | "light";

const THEME_KEY = "ledger_theme_v1";

interface UiStore {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  hydrateTheme: () => void;

  navDrawerOpen: boolean;
  openNavDrawer: () => void;
  closeNavDrawer: () => void;

  sheetOpen: boolean;
  sheetContent: ReactNode | null;
  openSheet: (content: ReactNode) => void;
  closeSheet: () => void;

  pinLock: { setup?: boolean; change?: boolean; onSuccess?: () => void } | null;
  showPinLock: (opts: { setup?: boolean; change?: boolean; onSuccess?: () => void }) => void;
  hidePinLock: () => void;

  toastMessage: string | null;
  toastVisible: boolean;
  showToast: (msg: string) => void;
}

function applyThemeToDocument(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t === "light" ? "#f1f5f9" : "#080c14");
}

export const useUiStore = create<UiStore>((set, get) => ({
  theme: "dark",
  setTheme: (t) => {
    localStorage.setItem(THEME_KEY, t);
    applyThemeToDocument(t);
    set({ theme: t });
  },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
  hydrateTheme: () => {
    const saved = (localStorage.getItem(THEME_KEY) as Theme | null) || "dark";
    applyThemeToDocument(saved);
    set({ theme: saved });
  },

  navDrawerOpen: false,
  openNavDrawer: () => set({ navDrawerOpen: true }),
  closeNavDrawer: () => set({ navDrawerOpen: false }),

  sheetOpen: false,
  sheetContent: null,
  openSheet: (content) => set({ sheetOpen: true, sheetContent: content }),
  closeSheet: () => set({ sheetOpen: false }),

  pinLock: null,
  showPinLock: (opts) => set({ pinLock: opts }),
  hidePinLock: () => set({ pinLock: null }),

  toastMessage: null,
  toastVisible: false,
  showToast: (msg) => {
    set({ toastMessage: msg, toastVisible: true });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toastVisible: false }), 2200);
  },
}));

let toastTimer: ReturnType<typeof setTimeout> | null = null;

/** Callable from anywhere (event handlers, async callbacks), matching the original's
 *  global toast() helper. */
export function toast(msg: string) {
  useUiStore.getState().showToast(msg);
}
