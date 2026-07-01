import type { LedgerState } from "@/lib/store/types";
import { received } from "@/lib/domain/selectors";
import { localISO, parseISO, todayISO } from "@/lib/format";

export type PnlRangeKey = "7D" | "30D" | "3M" | "1Y" | "ALL";

export interface PnlPoint {
  date: string;
  value: number;
  synth?: boolean;
}

export function pnlCurveSeries(state: LedgerState, rangeKey: PnlRangeKey): PnlPoint[] {
  const events: { date: string; delta: number }[] = [];
  received(state).forEach((p) => events.push({ date: p.date, delta: +Number(p.amount) }));
  state.spending.forEach((s) => events.push({ date: s.date, delta: -Number(s.amount) }));
  events.sort((a, b) => a.date.localeCompare(b.date));
  if (!events.length) return [];

  const todayStr = todayISO();
  let startStr: string | null = null;
  if (rangeKey === "7D") {
    const d = parseISO(todayStr)!;
    d.setDate(d.getDate() - 7);
    startStr = localISO(d);
  } else if (rangeKey === "30D") {
    const d = parseISO(todayStr)!;
    d.setDate(d.getDate() - 30);
    startStr = localISO(d);
  } else if (rangeKey === "3M") {
    const d = parseISO(todayStr)!;
    d.setMonth(d.getMonth() - 3);
    startStr = localISO(d);
  } else if (rangeKey === "1Y") {
    const d = parseISO(todayStr)!;
    d.setFullYear(d.getFullYear() - 1);
    startStr = localISO(d);
  }

  let baseValue = 0;
  if (startStr) {
    events.forEach((e) => {
      if (e.date < startStr!) baseValue += e.delta;
    });
    const filtered: PnlPoint[] = [{ date: startStr, value: baseValue, synth: true }];
    events.forEach((e) => {
      if (e.date >= startStr!) {
        baseValue += e.delta;
        filtered.push({ date: e.date, value: baseValue });
      }
    });
    return filtered;
  }

  let cum = 0;
  const all: PnlPoint[] = [];
  events.forEach((e) => {
    cum += e.delta;
    all.push({ date: e.date, value: cum });
  });
  return [{ date: events[0].date, value: 0, synth: true }, ...all];
}
