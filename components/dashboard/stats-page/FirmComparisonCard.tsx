"use client";

import { useEffect, useRef } from "react";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { firmComparisonRows } from "@/lib/domain/selectors";
import { firmAvatar, firmInitials } from "@/lib/domain/avatar";

export default function FirmComparisonCard() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const rows = firmComparisonRows(state);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      barRefs.current.forEach((el, i) => {
        if (!el) return;
        const row = rows[Math.floor(i / 4)];
        const bar = row?.bars[i % 4];
        if (!bar) return;
        el.style.width = `${(bar.pct * 100).toFixed(1)}%`;
      });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.map((r) => r.score).join(",")]);

  if (rows.length < 2) return null;

  const top = rows[0];

  return (
    <section className="section">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Firm Comparison</div>
        </div>
        <div style={{ padding: "0 16px 12px 16px" }}>
          <div className="fc-top-badge">🏆 Top performer: {top.firm.name}</div>
        </div>
        <div className="fc-rows">
          {rows.map((e, i) => (
            <div key={e.firm.id} className="fc-row">
              <div className="fc-rank">{i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}`}</div>
              <div className="fc-avatar" style={{ background: firmAvatar(e.firm) }}>
                {firmInitials(e.firm.name)}
              </div>
              <div className="fc-info">
                <div className="fc-name">{e.firm.name}</div>
                <div className="fc-bars">
                  {e.bars.map((b, bi) => (
                    <div key={b.label} className="fc-bar-row">
                      <div className="fc-bar-label">{b.label}</div>
                      <div className="fc-bar-track">
                        <div
                          className="fc-bar-fill"
                          style={{ width: 0, background: b.color }}
                          ref={(el) => {
                            barRefs.current[i * 4 + bi] = el;
                          }}
                        />
                      </div>
                      <div className="fc-bar-val">{b.val}</div>
                    </div>
                  ))}
                </div>
              </div>
              {i === 0 && <div className="fc-score-pill">Score {e.score}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
