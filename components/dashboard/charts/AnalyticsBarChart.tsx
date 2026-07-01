"use client";

import { useEffect, useRef } from "react";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { monthlyEarningsSeries, payoutVelocity } from "@/lib/domain/selectors";
import { compactGBP, fmtGBP } from "@/lib/format";

export default function AnalyticsBarChart() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const data = monthlyEarningsSeries(state, 6);
  const total = data.reduce((s, d) => s + d.total, 0);
  const maxVal = Math.max(1, ...data.map((d) => d.total));
  const scaleMax = maxVal * 1.15;
  const currentIdx = data.length - 1;
  const velocity = payoutVelocity(state);
  const velClass = velocity > 0 ? "up" : velocity < 0 ? "down" : "flat";
  const velText = velocity > 0 ? `↑ ${velocity}%` : velocity < 0 ? `↓ ${Math.abs(velocity)}%` : "→ steady";

  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      barRefs.current.forEach((el, i) => {
        const d = data[i];
        if (!el || !d) return;
        const pct = d.total > 0 ? (d.total / scaleMax) * 100 : 0;
        el.style.height = pct.toFixed(2) + "%";
      });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.map((d) => d.total).join(",")]);

  function showFor(i: number) {
    const d = data[i];
    const col = colRefs.current[i];
    const wrap = wrapRef.current;
    const bar = barRefs.current[i];
    if (!d || !col || !wrap || !bar || !tooltipRef.current) return;
    tooltipRef.current.innerHTML = `<div class="ttl">${d.label}</div><div class="val num">${fmtGBP(d.total)}</div>`;
    const colRect = col.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();
    tooltipRef.current.style.left = colRect.left - wrapRect.left + colRect.width / 2 + "px";
    tooltipRef.current.style.top = barRect.top - wrapRect.top - 8 + "px";
    tooltipRef.current.classList.add("visible");
    colRefs.current.forEach((c) => c?.classList.remove("hover"));
    col.classList.add("hover");
  }
  function hideAll() {
    tooltipRef.current?.classList.remove("visible");
    colRefs.current.forEach((c) => c?.classList.remove("hover"));
  }

  return (
    <section className="section">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Monthly Earnings</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className={`velocity-badge ${velClass}`}>{velText}</span>
            <div className="section-meta">{fmtGBP(total, { short: true })}</div>
          </div>
        </div>
        <div className="bar-chart" ref={wrapRef} onTouchEnd={() => setTimeout(hideAll, 1500)}>
          <div className="bc-bars">
            {data.map((d, i) => {
              const isCurrent = i === currentIdx;
              const pulseCurrent = isCurrent && d.total > 0;
              return (
                <div
                  key={d.key}
                  className={`bc-col${isCurrent ? " current" : ""}`}
                  ref={(el) => {
                    colRefs.current[i] = el;
                  }}
                  onMouseEnter={() => showFor(i)}
                  onMouseLeave={hideAll}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    showFor(i);
                  }}
                >
                  <div className="bc-col-value">{d.total > 0 ? compactGBP(d.total) : "£0"}</div>
                  <div
                    className={`bc-bar${pulseCurrent ? " current" : ""}${d.total === 0 ? " empty" : ""}`}
                    style={{ height: 0 }}
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="bc-labels">
            {data.map((d, i) => (
              <span key={d.key} className={i === currentIdx ? "current" : ""}>
                {d.label}
              </span>
            ))}
          </div>
          <div className="bc-tooltip" ref={tooltipRef} />
        </div>
      </div>
    </section>
  );
}
