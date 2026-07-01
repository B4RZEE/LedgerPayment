"use client";

import { useRef, useState } from "react";
import SheetHead from "@/components/dashboard/sheets/SheetHead";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { useUiStore } from "@/lib/store/uiStore";
import { journalForDate } from "@/lib/domain/selectors";
import { fmtDateLong, todayISO } from "@/lib/format";
import { openPayoutSheet } from "@/components/dashboard/sheets/PayoutSheet";
import PayoutItem from "@/components/dashboard/payouts-page/PayoutItem";

function DayDetailSheetContent({ iso }: { iso: string }) {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const dayPayouts = state.payouts.filter((p) => p.date === iso);
  const journalEntry = journalForDate(state, iso);
  const today = todayISO();
  const isToday = iso === today;
  const isPast = iso < today;

  const [text, setText] = useState(journalEntry?.text ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onInput(value: string) {
    setText(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      store.actions.saveJournalEntry(iso, value);
    }, 800);
  }

  const placeholder = isToday
    ? "What happened today? Passed eval, got reset, market notes…"
    : isPast
      ? "Add a note about this day…"
      : "Notes for this upcoming date…";

  return (
    <div>
      <SheetHead title={fmtDateLong(iso)} />
      <div className="sheet-body">
        <button
          className="btn primary"
          style={{ width: "100%", marginBottom: 18 }}
          onClick={() => {
            closeSheet();
            setTimeout(() => openPayoutSheet(undefined, { date: iso }), 200);
          }}
        >
          + Add Payout for This Day
        </button>

        {dayPayouts.length > 0 && (
          <>
            <div className="field-label" style={{ marginBottom: 8 }}>
              Payouts ({dayPayouts.length})
            </div>
            <div className="timeline" style={{ marginBottom: 18 }}>
              {dayPayouts.map((p) => (
                <PayoutItem key={p.id} p={p} state={state} />
              ))}
            </div>
          </>
        )}

        <div className="journal-wrap">
          <div className="journal-label">
            Daily Note
            {journalEntry && <span className="journal-dot" />}
          </div>
          <textarea className="journal-textarea" placeholder={placeholder} value={text} onChange={(e) => onInput(e.target.value)} />
          <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 6 }}>Auto-saves as you type</div>
        </div>
      </div>

      <div className="sheet-foot">
        <button className="btn ghost" onClick={closeSheet}>
          Done
        </button>
      </div>
    </div>
  );
}

export function openDaySheet(iso: string) {
  useUiStore.getState().openSheet(<DayDetailSheetContent iso={iso} />);
}
