"use client";

import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { upcomingSorted } from "@/lib/domain/selectors";
import { openPayoutSheet } from "@/components/dashboard/sheets/PayoutSheet";
import { showAlertSheet } from "@/components/dashboard/sheets/AlertSheet";
import { toast } from "@/lib/store/uiStore";
import Icon from "@/components/ui/Icon";
import PayoutItem from "./PayoutItem";
import SwipeableRow from "./SwipeableRow";

export default function UpcomingPayoutsCard() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const items = upcomingSorted(state).slice(0, 8);

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
          <div className="card-title">Upcoming Payouts</div>
          <button className="card-action primary" onClick={() => openPayoutSheet()}>
            <span style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 4 }}>
              <Icon name="plus" />
            </span>
            Add
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📅</div>
            <div className="empty-title">No upcoming payouts</div>
            <div className="empty-text">Add an expected payout to start tracking countdowns.</div>
            <button className="empty-btn" onClick={() => openPayoutSheet()}>
              Add a payout
            </button>
          </div>
        ) : (
          <div className="timeline stagger">
            {items.map((p) => (
              <SwipeableRow key={p.id} onEdit={() => openPayoutSheet(p.id)} onDelete={() => confirmDelete(p.id)}>
                <PayoutItem p={p} state={state} />
              </SwipeableRow>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
