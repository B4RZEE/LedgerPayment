"use client";

import { useEffect, useRef } from "react";
import { getLedgerState, useLedgerStore } from "@/lib/store/ledgerStore";
import { monthlyEarningsSeries, payoutVelocity } from "@/lib/domain/selectors";
import { compactGBP, fmtGBP } from "@/lib/format";

export default function MonthBarsChart() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const data = monthlyEarningsSeries(state, 6);
  const maxVal = Math.max(1, ...data.map((d) => d.total));
  const currentIdx = data.length - 1;
  const velocity = payoutVelocity(state);
  const velClass = velocity > 0 ? "up" : velocity < 0 ? "down" : "flat";
  const velText = velocity > 0 ? `↑ ${velocity}%` : velocity < 0 ? `↓ ${Math.abs(velocity)}%` : "→ steady";
  const totalEarned = data.reduce((s, d) => s + d.total, 0);

  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      barRefs.current.forEach((el, i) => {
        const d = data[i];
        if (!el || !d) return;
        const pct = d.total > 0 ? Math.min(1, d.total / maxVal) : 0;
        const barH = Math.max(3, Math.round(pct * 56));
        el.style.height = barH + "px";
      });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.map((d) => d.total).join(",")]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 0" }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-3)" }}>Monthly Earnings</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`velocity-badge ${velClass}`}>{velText}</span>
          <div className="section-meta">{fmtGBP(totalEarned, { short: true })}</div>
        </div>
      </div>
      <div className="month-bars">
        {data.map((d, i) => (
          <div key={d.key} className={`month-bar-item${i === currentIdx ? " current" : ""}`}>
            <div className="mb-val">{d.total > 0 ? compactGBP(d.total) : ""}</div>
            <div className="mb-track">
              <div
                className="mb-bar"
                style={{ height: 0 }}
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
              />
            </div>
            <div className="mb-label">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
