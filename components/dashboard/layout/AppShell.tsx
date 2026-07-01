"use client";

import { useEffect } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import NavDrawer from "./NavDrawer";
import TopBar from "./TopBar";
import PinLockOverlay from "./PinLockOverlay";
import Toast from "./Toast";
import SheetHost from "@/components/dashboard/sheets/SheetHost";
import { useUiStore } from "@/lib/store/uiStore";
import { isPinSet } from "@/lib/pinLock";
import { useLedgerStore } from "@/lib/store/ledgerStore";
import { initLedgerSync, loadFromLocalStorage } from "@/lib/store/sync";
import { syncFromSupabase } from "@/lib/supabase/sync";

export default function AppShell({ userId, email, children }: { userId: string; email: string | null; children: React.ReactNode }) {
  const hydrateTheme = useUiStore((s) => s.hydrateTheme);
  const showPinLock = useUiStore((s) => s.showPinLock);

  useEffect(() => {
    hydrateTheme();
    const stopSync = initLedgerSync();

    const { setUser, hydrate } = useLedgerStore.getState().actions;
    setUser(userId, email);
    hydrate(loadFromLocalStorage(userId));

    async function pullFromSupabase() {
      const result = await syncFromSupabase(userId, useLedgerStore.getState());
      if (result) hydrate(result.state);
    }

    if (isPinSet()) {
      showPinLock({ onSuccess: pullFromSupabase });
    } else {
      void pullFromSupabase();
    }

    let hiddenAt = 0;
    function onVisibilityChange() {
      if (document.hidden) {
        hiddenAt = Date.now();
        return;
      }
      if (!isPinSet()) return;
      if (Date.now() - hiddenAt > 60000) showPinLock({});
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopSync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, email]);

  return (
    <>
      <Sidebar />
      <NavDrawer />
      <div className="app">
        <TopBar />
        {children}
      </div>
      <BottomNav />
      <SheetHost />
      <PinLockOverlay />
      <Toast />
    </>
  );
}
