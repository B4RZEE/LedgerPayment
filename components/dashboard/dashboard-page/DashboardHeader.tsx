"use client";

import { useLedgerStore } from "@/lib/store/ledgerStore";

export default function DashboardHeader() {
  const username = useLedgerStore((s) => s.profile.username);
  const firstName = useLedgerStore((s) => s.profile.firstName);
  const displayName = username || firstName || null;

  const now = new Date();
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const dateRange = `${startOfMonth.getDate()} ${MONTHS[startOfMonth.getMonth()]} – ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div className="ov-topbar">
      <div>
        {displayName ? (
          <>
            <div className="ov-page-eyebrow">Dashboard</div>
            <div className="ov-title">
              Hi, <span className="ov-title-name">{displayName}</span>
            </div>
          </>
        ) : (
          <div className="ov-title">Dashboard</div>
        )}
        <div className="ov-subtitle">Overview of your funded trading performance</div>
      </div>
      <div className="ov-topbar-controls">
        <div className="ov-date-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="13" height="13">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {dateRange}
        </div>
      </div>
    </div>
  );
}
