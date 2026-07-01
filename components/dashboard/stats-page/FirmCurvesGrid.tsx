"use client";

import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { firmColor, firmCurveSeries, payoutsForFirm } from "@/lib/domain/selectors";
import { firmAvatar, firmInitials } from "@/lib/domain/avatar";
import { fmtGBP } from "@/lib/format";
import FirmMiniCurve from "@/components/dashboard/charts/FirmMiniCurve";

export default function FirmCurvesGrid() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  if (!state.firms.length) return null;

  return (
    <section className="section">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Earnings Curve · Per Firm</div>
          <div className="section-meta">
            {state.firms.length} firm{state.firms.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div style={{ padding: "4px 16px 16px" }}>
          <div className="firm-curves-grid">
            {state.firms.map((firm) => {
              const color = firmColor(state, firm.id);
              const pts = firmCurveSeries(state, firm.id);
              const firmPays = payoutsForFirm(state, firm.id);
              const rcv = firmPays.filter((p) => p.status === "received");
              const den = firmPays.filter((p) => p.status === "denied");
              const total = rcv.reduce((s, p) => s + Number(p.amount), 0);
              const avg = rcv.length ? total / rcv.length : 0;
              const successRate = rcv.length + den.length > 0 ? Math.round((rcv.length / (rcv.length + den.length)) * 100) : null;

              return (
                <div key={firm.id} className="firm-curve-card">
                  <div className="fcc-header">
                    <div className="fcc-avatar" style={{ background: firmAvatar(firm) }}>
                      {firmInitials(firm.name)}
                    </div>
                    <div className="fcc-name">{firm.name}</div>
                    <div className={`fcc-total${total === 0 ? " zero" : ""}`}>{total > 0 ? fmtGBP(total, { short: total >= 10000 }) : "—"}</div>
                  </div>

                  <div className="fcc-chart">
                    {pts.length >= 2 ? <FirmMiniCurve points={pts} color={color} /> : <div className="fcc-no-data">No received payouts yet</div>}
                  </div>

                  <div className="fcc-pills">
                    <span className="fcc-pill blue">{rcv.length} paid</span>
                    {avg > 0 && <span className="fcc-pill">avg {fmtGBP(avg, { short: avg >= 1000 })}</span>}
                    {successRate !== null && (
                      <span className={`fcc-pill ${successRate >= 70 ? "blue" : successRate >= 40 ? "amb" : "red"}`}>{successRate}% success</span>
                    )}
                    {den.length > 0 && <span className="fcc-pill red">{den.length} denied</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
