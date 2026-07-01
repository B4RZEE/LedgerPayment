"use client";

import { useState } from "react";
import SheetHead from "./SheetHead";
import { showAlertSheet } from "./AlertSheet";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { useUiStore, toast } from "@/lib/store/uiStore";
import { accountsForFirm, getFirm } from "@/lib/domain/selectors";
import { PAYOUT_STATUSES, healthLabel } from "@/lib/domain/meta";
import { createNotification } from "@/lib/domain/notifications";
import { fmtGBP, todayISO } from "@/lib/format";
import { uid } from "@/lib/uid";
import type { Payout, PayoutStatus } from "@/lib/store/types";
import { openFirmSheet } from "./FirmSheet";
import { openAccountSheet } from "./AccountSheet";

interface Draft {
  id: string;
  firmId: string;
  accountId: string;
  amount: string;
  date: string;
  status: PayoutStatus;
  notes: string;
}

function blankDraft(store: ReturnType<typeof useLedgerStore.getState>, opts: { date?: string; prefill?: Payout }): Draft {
  const state = getLedgerState(store);
  if (opts.prefill) return { ...opts.prefill, amount: String(opts.prefill.amount) };

  let defaultFirmId = state.firms[0]?.id || "";
  const firmWithAccounts = state.firms.find((f) => accountsForFirm(state, f.id).length > 0);
  if (firmWithAccounts) defaultFirmId = firmWithAccounts.id;
  const accts = accountsForFirm(state, defaultFirmId);

  return {
    id: uid(),
    firmId: defaultFirmId,
    accountId: accts[0]?.id || "",
    amount: "",
    date: opts.date || todayISO(),
    status: "awaiting_approval",
    notes: "",
  };
}

function PayoutSheetContent({ payoutId, opts }: { payoutId?: string; opts: { date?: string; prefill?: Payout } }) {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const editing = payoutId ? state.payouts.find((p) => p.id === payoutId) : null;

  const [draft, setDraft] = useState<Draft>(() =>
    editing ? { ...editing, amount: String(editing.amount) } : blankDraft(store, opts)
  );

  if (!state.firms.length) {
    return (
      <div>
        <SheetHead title={editing ? "Edit Payout" : "Add Payout"} />
        <div className="sheet-body">
          <div className="empty" style={{ padding: "14px 0" }}>
            <div className="empty-icon">🏛</div>
            <div className="empty-title">Add a firm first</div>
            <div className="empty-text">Payouts are linked to firms — let&apos;s add one so we can attribute this payout correctly.</div>
            <button
              className="empty-btn"
              onClick={() => {
                closeSheet();
                setTimeout(() => openFirmSheet(), 200);
              }}
            >
              Add firm
            </button>
          </div>
        </div>
      </div>
    );
  }

  const accts = accountsForFirm(state, draft.firmId);
  const accountId = accts.find((a) => a.id === draft.accountId) ? draft.accountId : accts[0]?.id || "";
  if (accountId !== draft.accountId) setDraft((d) => ({ ...d, accountId }));

  function save() {
    const amount = parseFloat(draft.amount);
    if (!draft.firmId) return toast("Pick a firm");
    if (!draft.accountId) return toast("Pick an account for this payout");
    if (isNaN(amount) || amount < 0) return toast("Enter a valid amount");
    if (!draft.date) return toast("Pick a date");

    const final: Payout = { id: draft.id, firmId: draft.firmId, accountId: draft.accountId, amount, date: draft.date, status: draft.status, notes: draft.notes };
    const wasAwaiting = editing && editing.status === "awaiting_approval";
    store.actions.upsertPayout(final);
    if (final.status === "awaiting_approval" && !wasAwaiting) {
      const firmName = getFirm(state, final.firmId)?.name || "your firm";
      store.actions.addNotification(
        createNotification("payout_upcoming", `Payout pending — ${firmName}`, `${fmtGBP(final.amount)} is awaiting approval from ${firmName}.`, { payoutId: final.id })
      );
    }
    closeSheet();
    toast(editing ? "Payout updated" : "Payout added");
  }

  return (
    <div>
      <SheetHead title={editing ? "Edit Payout" : "Add Payout"} />
      <div className="sheet-body">
        <div className="field">
          <label className="field-label">Firm</label>
          <select
            className="select"
            value={draft.firmId}
            onChange={(e) => setDraft((d) => ({ ...d, firmId: e.target.value, accountId: "" }))}
          >
            {state.firms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label">Account</label>
          {accts.length === 0 ? (
            <div className="inline-warn">
              <div className="inline-warn-text">
                <strong>No accounts under this firm yet.</strong>
                <div style={{ marginTop: 3, fontWeight: 400, opacity: 0.85 }}>Each payout has to be tied to an account.</div>
              </div>
              <button
                className="inline-warn-btn"
                type="button"
                onClick={() => {
                  const firmIdForAccount = draft.firmId;
                  closeSheet();
                  setTimeout(() => openAccountSheet(undefined, firmIdForAccount), 200);
                }}
              >
                Add account
              </button>
            </div>
          ) : (
            <select className="select" value={draft.accountId} onChange={(e) => setDraft((d) => ({ ...d, accountId: e.target.value }))}>
              {accts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} · {healthLabel(a.health)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label">Amount (GBP)</label>
            <div className="input-prefix-wrap">
              <span className="prefix">£</span>
              <input
                className="input num"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={draft.amount}
                onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
              />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Date</label>
            <input className="input" type="date" value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} />
          </div>
        </div>

        <div className="field">
          <label className="field-label">Status</label>
          <div className="chip-row">
            {PAYOUT_STATUSES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`chip${draft.status === s.id ? " active" : ""}`}
                onClick={() => setDraft((d) => ({ ...d, status: s.id }))}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label">Notes (optional)</label>
          <textarea
            className="textarea"
            placeholder="Reason for delay, batch number, anything useful…"
            value={draft.notes}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
          />
        </div>
      </div>

      <div className="sheet-foot">
        {editing && (
          <button
            className="btn danger"
            onClick={() =>
              showAlertSheet({
                title: "Delete Payout",
                body: "Remove this payout? This can't be undone.",
                buttons: [
                  {
                    label: "Delete Payout",
                    variant: "danger",
                    action: () => {
                      store.actions.deletePayout(editing.id);
                      toast("Payout deleted");
                    },
                  },
                ],
              })
            }
          >
            Delete
          </button>
        )}
        {editing && (
          <button
            className="btn-duplicate"
            onClick={() => {
              closeSheet();
              setTimeout(
                () => openPayoutSheet(undefined, { prefill: { ...editing, id: uid(), date: todayISO(), status: "awaiting_approval" } }),
                200
              );
            }}
          >
            ⎘ Duplicate
          </button>
        )}
        <button className="btn ghost" onClick={closeSheet}>
          Cancel
        </button>
        <button className="btn primary" onClick={save}>
          {editing ? "Save" : "Add payout"}
        </button>
      </div>
    </div>
  );
}

export function openPayoutSheet(payoutId?: string, opts: { date?: string; prefill?: Payout } = {}) {
  useUiStore.getState().openSheet(<PayoutSheetContent payoutId={payoutId} opts={opts} />);
}
