"use client";

import { useState } from "react";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { filteredPayouts, recentSettled, type PayoutSearchFilter } from "@/lib/domain/selectors";
import { openPayoutSheet } from "@/components/dashboard/sheets/PayoutSheet";
import { showAlertSheet } from "@/components/dashboard/sheets/AlertSheet";
import { toast } from "@/lib/store/uiStore";
import Icon from "@/components/ui/Icon";
import PayoutItem from "./PayoutItem";
import SwipeableRow from "./SwipeableRow";

const FILTERS: { id: PayoutSearchFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "received", label: "✓ Received" },
  { id: "pending", label: "⏳ Awaiting" },
  { id: "denied", label: "✗ Denied" },
];

export default function RecentPayoutsCard() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PayoutSearchFilter>("all");

  const isFiltering = !!query || filter !== "all";
  const hits = filteredPayouts(state, query, filter);
  const items = isFiltering ? hits : recentSettled(state);
  const cap = isFiltering ? 40 : 8;
  const shown = items.slice(0, cap);

  const settled = recentSettled(state);
  const receivedCount = settled.filter((p) => p.status === "received").length;
  const deniedCount = settled.filter((p) => p.status === "denied").length;
  const metaParts = [];
  if (receivedCount) metaParts.push(`${receivedCount} received`);
  if (deniedCount) metaParts.push(`${deniedCount} denied`);

  function confirmDelete(id: string) {
    showAlertSheet({
      title: "Delete Payout",
      body: "Remove this payout? This can't be undone.",
      buttons: [
        {
          label: "Delete Payout",
          variant: "danger",
          action: () => {
            store.actions.deletePayout(id);
            toast("Deleted");
          },
        },
      ],
    });
  }

  return (
    <section className="section">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Payouts</div>
          {metaParts.length > 0 && <div className="section-meta">{metaParts.join(" · ")}</div>}
        </div>

        <div style={{ padding: "0 0 14px" }}>
          <div className="search-bar-inner">
            <div className="search-bar-icon">
              <Icon name="search" />
            </div>
            <input className="search-bar" type="search" placeholder="Search payouts…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="search-filters">
            {FILTERS.map((f) => (
              <button key={f.id} className={`filter-chip${filter === f.id ? " active" : ""}`} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">{isFiltering ? "🔍" : "💸"}</div>
            <div className="empty-title">{isFiltering ? "No matches" : "No payouts settled yet"}</div>
            <div className="empty-text">
              {isFiltering ? `Nothing matches "${query || "this filter"}"` : "Once a payout is marked Received or Denied, it'll show up here."}
            </div>
          </div>
        ) : (
          <div className="timeline stagger">
            {shown.map((p) => (
              <SwipeableRow key={p.id} onEdit={() => openPayoutSheet(p.id)} onDelete={() => confirmDelete(p.id)}>
                <PayoutItem p={p} state={state} />
              </SwipeableRow>
            ))}
            {isFiltering && items.length > 40 && (
              <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: 13, padding: "12px 0" }}>
                +{items.length - 40} more — narrow your search
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
