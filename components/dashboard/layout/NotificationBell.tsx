"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { unreadNotificationCount } from "@/lib/domain/notifications";
import { timeAgo } from "@/lib/format";
import type { AppNotification } from "@/lib/store/types";

const NOTIF_ICONS: Record<string, string> = { payout_upcoming: "💰", achievement_unlocked: "🏆" };

export default function NotificationBell() {
  const router = useRouter();
  const store = useLedgerStore();
  const markNotificationRead = useLedgerStore((s) => s.actions.markNotificationRead);
  const markAllNotificationsRead = useLedgerStore((s) => s.actions.markAllNotificationsRead);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const state = getLedgerState(store);
  const unread = unreadNotificationCount(state);

  function handleNotificationClick(n: AppNotification) {
    setOpen(false);
    markNotificationRead(n.id);
    if (n.type === "achievement_unlocked") {
      // TODO(Phase 9): open the real AchievementCertificate modal for
      // ACHIEVEMENTS.find(a => a.id === n.payload?.achievementId) instead of navigating away.
      router.push("/app/milestones");
    } else if (n.type === "payout_upcoming") {
      router.push("/app/payouts");
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <button ref={btnRef} className="ov-ctrl-btn" title={unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "Notifications"} onClick={() => setOpen((v) => !v)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && <span className="ov-notif-badge" />}
      </button>

      {open && (
        <>
          <div className="add-dropdown-overlay" onClick={() => setOpen(false)} />
          <div
            className="notif-panel"
            style={{
              top: (btnRef.current?.getBoundingClientRect().bottom ?? 0) + 8,
              right: window.innerWidth - (btnRef.current?.getBoundingClientRect().right ?? 0),
            }}
          >
            <div className="notif-panel-head">
              <div className="notif-panel-title">Notifications</div>
              {unread > 0 && (
                <div
                  className="notif-panel-mark"
                  onClick={() => {
                    markAllNotificationsRead();
                    setOpen(false);
                  }}
                >
                  Mark all read
                </div>
              )}
            </div>
            <div className="notif-panel-list">
              {state.notifications.length === 0 ? (
                <div className="notif-panel-empty">You&apos;re all caught up — no notifications yet.</div>
              ) : (
                state.notifications.map((n) => (
                  <button key={n.id} className={`notif-item${n.read ? "" : " unread"}`} onClick={() => handleNotificationClick(n)}>
                    <div className="notif-item-icon">{NOTIF_ICONS[n.type] || "🔔"}</div>
                    <div className="notif-item-body">
                      <div className="notif-item-title">{n.title}</div>
                      {n.body && <div className="notif-item-desc">{n.body}</div>}
                      <div className="notif-item-time">{timeAgo(n.createdAt)}</div>
                    </div>
                    {!n.read && <div className="notif-item-dot" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
