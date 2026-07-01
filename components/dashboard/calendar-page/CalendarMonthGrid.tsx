"use client";

import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { buildMonthGrid, journalForDate } from "@/lib/domain/selectors";
import { compactGBP, localISO, localMonthISO, todayISO } from "@/lib/format";
import Icon from "@/components/ui/Icon";
import { openDaySheet } from "./DayDetailSheet";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarMonthGrid() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const today = todayISO();
  const monthStr = state.ui.calendarMonth || today.slice(0, 7);
  const [year, month] = monthStr.split("-").map(Number);

  const first = new Date(year, month - 1, 1);
  const cells = buildMonthGrid(year, month);

  function shiftMonth(delta: number) {
    const d = new Date(year, month - 1 + delta, 1);
    store.actions.setCalendarMonth(localMonthISO(d));
  }

  return (
    <section className="section">
      <div className="card">
        <div className="card-header">
          <div className="cal-month">{first.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</div>
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={() => shiftMonth(-1)}>
              <Icon name="chevL" />
            </button>
            <button className="cal-nav-btn" style={{ width: "auto", padding: "0 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }} onClick={() => store.actions.setCalendarMonth(today.slice(0, 7))}>
              Today
            </button>
            <button className="cal-nav-btn" onClick={() => shiftMonth(1)}>
              <Icon name="chevR" />
            </button>
          </div>
        </div>

        <div className="cal-weekdays">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="cal-grid">
          {cells.map((cell, i) => {
            const iso = localISO(cell.date);
            const dayPayouts = state.payouts.filter((p) => p.date === iso);
            const receivedPays = dayPayouts.filter((p) => p.status === "received");
            const pendingPays = dayPayouts.filter((p) => p.status === "awaiting_approval");
            const deniedPays = dayPayouts.filter((p) => p.status === "denied");

            let amount = 0;
            let amountClass = "";
            const cls = ["cal-day"];
            if (cell.otherMonth) cls.push("other-month");
            if (iso === today) cls.push("today");

            if (receivedPays.length) {
              amount = receivedPays.reduce((s, p) => s + Number(p.amount), 0);
              amountClass = "received";
              cls.push("has-received");
            } else if (pendingPays.length) {
              amount = pendingPays.reduce((s, p) => s + Number(p.amount), 0);
              amountClass = "pending";
              cls.push("has-pending");
            } else if (deniedPays.length) {
              amount = deniedPays.reduce((s, p) => s + Number(p.amount), 0);
              amountClass = "denied";
            }

            const seen = new Set<string>();
            const dots: string[] = [];
            dayPayouts.forEach((p) => {
              if (seen.has(p.status)) return;
              seen.add(p.status);
              dots.push(p.status);
            });
            const hasNote = !!journalForDate(state, iso);

            return (
              <button key={i} className={cls.join(" ")} onClick={() => !cell.otherMonth && openDaySheet(iso)}>
                <div className="cal-day-num">{cell.date.getDate()}</div>
                <div className={`cal-day-amount ${amountClass}`}>{amount > 0 ? compactGBP(amount) : ""}</div>
                <div className="cal-dots">
                  {dots.map((status) => (
                    <div key={status} className={`cal-dot ${status}`} />
                  ))}
                  {hasNote && <div className="cal-dot" style={{ background: "var(--lav-1)", opacity: 0.7 }} />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="cal-legend">
          <div className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: "var(--jade-1)" }} />
            Received
          </div>
          <div className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: "var(--amber-1)" }} />
            Awaiting
          </div>
          <div className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: "var(--rose-1)" }} />
            Denied
          </div>
          <div className="cal-legend-item">
            <span className="cal-legend-dot" style={{ background: "var(--lav-1)", opacity: 0.7 }} />
            Note
          </div>
        </div>
      </div>
    </section>
  );
}
