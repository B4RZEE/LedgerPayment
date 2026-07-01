"use client";

import { useState } from "react";
import SheetHead from "./SheetHead";
import { showAlertSheet } from "./AlertSheet";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { useUiStore, toast } from "@/lib/store/uiStore";
import { accountsForFirm } from "@/lib/domain/selectors";
import { SPENDING_CATEGORIES, healthLabel } from "@/lib/domain/meta";
import { todayISO } from "@/lib/format";
import { uid } from "@/lib/uid";
import type { SpendingCategory } from "@/lib/store/types";

function SpendingSheetContent({ spendId }: { spendId?: string }) {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const editing = spendId ? state.spending.find((s) => s.id === spendId) : null;

  const [category, setCategory] = useState<SpendingCategory>(editing?.category ?? "account_purchase");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [date, setDate] = useState(editing?.date ?? todayISO());
  const [firmId, setFirmId] = useState(editing?.firmId ?? "");
  const [accountId, setAccountId] = useState(editing?.accountId ?? "");
  const [notes, setNotes] = useState(editing?.notes ?? "");

  const accts = firmId ? accountsForFirm(state, firmId) : [];
  const resolvedAccountId = accts.find((a) => a.id === accountId) ? accountId : "";
  if (resolvedAccountId !== accountId) setAccountId(resolvedAccountId);

  function save() {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return toast("Enter a valid amount");
    if (!date) return toast("Pick a date");
    store.actions.upsertSpending({ id: editing ? editing.id : uid(), amount: amt, date, category, firmId, accountId, notes });
    closeSheet();
    toast(editing ? "Cost updated" : "Cost added");
  }

  return (
    <div>
      <SheetHead title={editing ? "Edit Cost" : "Add Cost"} />
      <div className="sheet-body">
        <div className="field">
          <label className="field-label">Category</label>
          <div className="chip-row">
            {SPENDING_CATEGORIES.map((c) => (
              <button key={c.id} type="button" className={`chip${category === c.id ? " active" : ""}`} onClick={() => setCategory(c.id)}>
                {c.icon}  {c.label}
              </button>
            ))}
          </div>
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Date</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        {state.firms.length > 0 && (
          <>
            <div className="field">
              <label className="field-label">Firm (optional)</label>
              <select
                className="select"
                value={firmId}
                onChange={(e) => {
                  setFirmId(e.target.value);
                  setAccountId("");
                }}
              >
                <option value="">— No specific firm —</option>
                {state.firms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            {accts.length > 0 && (
              <div className="field">
                <label className="field-label">Account (optional)</label>
                <select className="select" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                  <option value="">— No specific account —</option>
                  {accts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label} · {healthLabel(a.health)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        <div className="field">
          <label className="field-label">Description (optional)</label>
          <input
            className="input"
            type="text"
            placeholder="e.g. 50K Combine, TradingView Pro, Wire transfer"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="sheet-foot">
        {editing && (
          <button
            className="btn danger"
            onClick={() =>
              showAlertSheet({
                title: "Delete Cost",
                body: "Remove this cost entry? This can't be undone.",
                buttons: [
                  {
                    label: "Delete Cost",
                    variant: "danger",
                    action: () => {
                      store.actions.deleteSpending(editing.id);
                      toast("Cost deleted");
                    },
                  },
                ],
              })
            }
          >
            Delete
          </button>
        )}
        <button className="btn ghost" onClick={closeSheet}>
          Cancel
        </button>
        <button className="btn primary" onClick={save}>
          {editing ? "Save" : "Add cost"}
        </button>
      </div>
    </div>
  );
}

export function openSpendingSheet(spendId?: string) {
  useUiStore.getState().openSheet(<SpendingSheetContent spendId={spendId} />);
}
