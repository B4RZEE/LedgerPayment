"use client";

import { useState } from "react";
import SheetHead from "./SheetHead";
import { showAlertSheet } from "./AlertSheet";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { useUiStore, toast } from "@/lib/store/uiStore";
import { accountsForFirm, payoutsForFirm } from "@/lib/domain/selectors";
import { POPULAR_FIRMS, healthLabel } from "@/lib/domain/meta";
import { uid } from "@/lib/uid";
import { openAccountSheet } from "./AccountSheet";

function FirmSheetContent({ firmId }: { firmId?: string }) {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const editing = firmId ? state.firms.find((f) => f.id === firmId) : null;

  const [name, setName] = useState(editing?.name ?? "");
  const isPopular = POPULAR_FIRMS.includes(name);
  const [customMode, setCustomMode] = useState(!!name && !isPopular);

  const accts = editing ? accountsForFirm(state, editing.id) : [];

  function save() {
    const trimmed = name.trim();
    if (!trimmed) return toast("Pick or enter a firm name");
    const dupe = state.firms.find((f) => f.name.toLowerCase() === trimmed.toLowerCase() && (!editing || f.id !== editing.id));
    if (dupe) return toast(`"${trimmed}" is already in your roster`);
    store.actions.upsertFirm({ id: editing ? editing.id : uid(), name: trimmed });
    closeSheet();
    toast(editing ? "Firm updated" : "Firm added");
  }

  return (
    <div>
      <SheetHead title={editing ? "Edit Firm" : "Add Firm"} />
      <div className="sheet-body">
        <div className="field">
          <label className="field-label">Firm</label>
          <select
            className="select"
            value={customMode ? "__custom__" : name}
            onChange={(e) => {
              if (e.target.value === "__custom__") {
                setCustomMode(true);
                setName("");
              } else {
                setCustomMode(false);
                setName(e.target.value);
              }
            }}
          >
            <option value="">Select a firm…</option>
            {POPULAR_FIRMS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
            <option value="__custom__">Other (enter your own)…</option>
          </select>
          {customMode && (
            <div style={{ marginTop: 8 }}>
              <input
                className="input"
                type="text"
                placeholder="Enter firm name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
        </div>

        {editing && (
          <div className="field">
            <label className="field-label">Accounts ({accts.length})</label>
            <div className="firm-accounts" style={{ marginTop: 0 }}>
              {accts.map((a) => (
                <button
                  key={a.id}
                  className={`account-chip ${a.health}`}
                  onClick={() => {
                    closeSheet();
                    setTimeout(() => openAccountSheet(a.id), 200);
                  }}
                >
                  <span className="dot" />
                  {a.label}
                  <span style={{ color: "var(--text-2)", marginLeft: 5, fontSize: 10, fontWeight: 500 }}>{healthLabel(a.health)}</span>
                </button>
              ))}
              <button
                className="account-chip add"
                onClick={() => {
                  closeSheet();
                  setTimeout(() => openAccountSheet(undefined, editing.id), 200);
                }}
              >
                + Account
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="sheet-foot">
        {editing && (
          <button
            className="btn danger"
            onClick={() => {
              const accCount = accountsForFirm(state, editing.id).length;
              const payCount = payoutsForFirm(state, editing.id).length;
              let msg = `Remove "${editing.name}"?`;
              if (accCount || payCount) {
                const parts = [accCount && `${accCount} account${accCount === 1 ? "" : "s"}`, payCount && `${payCount} payout${payCount === 1 ? "" : "s"}`].filter(Boolean);
                msg += ` This will also delete ${parts.join(" and ")}.`;
              }
              showAlertSheet({
                title: "Delete Firm",
                body: msg,
                buttons: [
                  {
                    label: "Delete Firm",
                    variant: "danger",
                    action: () => {
                      store.actions.deleteFirm(editing.id);
                      toast("Firm deleted");
                    },
                  },
                ],
              });
            }}
          >
            Delete
          </button>
        )}
        <button className="btn ghost" onClick={closeSheet}>
          Cancel
        </button>
        <button className="btn primary" onClick={save}>
          {editing ? "Save" : "Add firm"}
        </button>
      </div>
    </div>
  );
}

export function openFirmSheet(firmId?: string) {
  useUiStore.getState().openSheet(<FirmSheetContent firmId={firmId} />);
}
