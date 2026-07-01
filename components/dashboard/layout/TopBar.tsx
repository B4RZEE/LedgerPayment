"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { useUiStore } from "@/lib/store/uiStore";
import { PAGES } from "@/lib/domain/pages";
import NotificationBell from "./NotificationBell";

const ADD_ITEMS = [
  { icon: "building", bg: "rgba(255,51,51,0.1)", color: "var(--jade-1)", label: "Add a firm", desc: "Add a new prop firm" },
  { icon: "money", bg: "rgba(165,180,252,0.1)", color: "var(--lav-2)", label: "Add an account", desc: "Link an account to a firm" },
  { icon: "coin", bg: "rgba(59,130,246,0.1)", color: "#3b82f6", label: "Add a payout", desc: "Log a received or pending payout" },
  { icon: "target", bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "Add an expense", desc: "Log a fee, purchase or cost" },
] as const;

interface TopBarProps {
  /** Override the plain page-label title (dashboard passes its personalised greeting here). */
  titleSlot?: React.ReactNode;
}

export default function TopBar({ titleSlot }: TopBarProps) {
  const pathname = usePathname();
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const openNavDrawer = useUiStore((s) => s.openNavDrawer);
  const [addOpen, setAddOpen] = useState(false);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const pageId = pathname?.split("/")[2] ?? "dashboard";
  const pageLabel = PAGES.find((p) => p.id === pageId)?.label ?? "Ledger";

  return (
    <header className="top">
      <div className="brand">
        <div className="brand-mark mobile-only" />
        {titleSlot ?? <div className="page-title">{pageLabel}</div>}
      </div>

      <div className="top-actions">
        <button className="theme-btn" title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleTheme}>
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div style={{ position: "relative" }}>
          <button ref={addBtnRef} className={`icon-btn${addOpen ? " add-open" : ""}`} title="Add…" onClick={() => setAddOpen((v) => !v)}>
            <Icon name="plus" />
          </button>
          {addOpen && (
            <>
              <div className="add-dropdown-overlay" onClick={() => setAddOpen(false)} />
              <div
                className="add-dropdown"
                style={{
                  top: (addBtnRef.current?.getBoundingClientRect().bottom ?? 0) + 8,
                  right: window.innerWidth - (addBtnRef.current?.getBoundingClientRect().right ?? 0),
                }}
              >
                {ADD_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    className="add-dropdown-item"
                    onClick={() => {
                      setAddOpen(false);
                      // TODO(Phase 6): wire to openFirmSheet/openAccountSheet/openPayoutSheet/openSpendingSheet
                    }}
                  >
                    <div className="add-dropdown-icon" style={{ background: item.bg, color: item.color }}>
                      <Icon name={item.icon} />
                    </div>
                    <div>
                      <div className="add-dropdown-label">{item.label}</div>
                      <div className="add-dropdown-desc">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <NotificationBell />

        <button className="menu-btn mobile-only" title="Menu" onClick={openNavDrawer}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
