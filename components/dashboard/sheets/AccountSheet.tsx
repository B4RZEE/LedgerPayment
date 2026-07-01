"use client";

import { useEffect, useState } from "react";
import SheetHead from "./SheetHead";
import { showAlertSheet } from "./AlertSheet";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { useUiStore, toast } from "@/lib/store/uiStore";
import { HEALTH_STATUSES } from "@/lib/domain/meta";
import { uid } from "@/lib/uid";
import type { AccountHealth } from "@/lib/store/types";
import { openFirmSheet } from "./FirmSheet";

function AccountSheetContent({ accountId, defaultFirmId }: { accountId?: string; defaultFirmId?: string }) {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const editing = accountId ? state.accounts.find((a) => a.id === accountId) : null;

  const [firmId, setFirmId] = useState(editing?.firmId ?? defaultFirmId ?? state.firms[0]?.id ?? "");
  const [label, setLabel] = useState(editing?.label ?? "");
  const [health, setHealth] = useState<AccountHealth | "">(editing?.health ?? "");

  // No firms exist — redirect to FirmSheet instead of rendering a dead form.
  useEffect(() => {
    if (!state.firms.length) {
      closeSheet();
      setTimeout(() => openFirmSheet(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!state.firms.length) return null;

  function save() {
    if (!label.trim()) return toast("Give the account a label");
    if (!firmId) return toast("Pick a firm");
    if (!health) return toast("Select a status — Funded, In Progress, or Failed");
    store.actions.upsertAccount({ id: editing ? editing.id : uid(), firmId, label: label.trim(), health });
    closeSheet();
    toast(editing ? "Account updated" : "Account added");
  }

  return (
    <div>
      <SheetHead title={editing ? "Edit Account" : "Add Account"} />
      <div className="sheet-body">
        <div className="field">
          <label className="field-label">Firm</label>
          <select className="select" value={firmId} onChange={(e) => setFirmId(e.target.value)}>
            {state.firms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Account label</label>
          <input
            className="input"
            type="text"
            placeholder="e.g. 50K Combine, Express #2"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">Status</label>
          <div className="chip-row">
            {HEALTH_STATUSES.map((s) => (
              <button key={s.id} type="button" className={`chip${health === s.id ? " active" : ""}`} onClick={() => setHealth(s.id)}>
                {s.icon}  {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sheet-foot">
        {editing && (
          <button
            className="btn danger"
            onClick={() =>
              showAlertSheet({
                title: "Delete Account",
                body: `Remove "${editing.label}"? Payouts linked to this account will be kept but unlinked.`,
                buttons: [
                  {
                    label: "Delete Account",
                    variant: "danger",
                    action: () => {
                      store.actions.deleteAccount(editing.id);
                      toast("Account deleted");
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
          {editing ? "Save" : "Add account"}
        </button>
      </div>
    </div>
  );
}

export function openAccountSheet(accountId?: string, defaultFirmId?: string) {
  useUiStore.getState().openSheet(<AccountSheetContent accountId={accountId} defaultFirmId={defaultFirmId} />);
}
