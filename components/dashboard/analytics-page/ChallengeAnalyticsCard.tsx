"use client";

import { useRouter } from "next/navigation";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { accountPassRate, challengeFees, feeROI, lifetimeWithdrawals, netProfit } from "@/lib/domain/selectors";
import { fmtGBP } from "@/lib/format";

const R = 22;
const CIRC = 2 * Math.PI * R;

export default function ChallengeAnalyticsCard() {
  const router = useRouter();
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const pr = accountPassRate(state);
  const fees = challengeFees(state);
  const roi = feeROI(state);

  if (!pr && !fees) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-title">Challenge Analytics</div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon" style={{ color: "var(--jade-1)" }}>
            🎯
          </div>
          <div className="empty-state-title">Track your pass rate</div>
          <div className="empty-state-sub">Add accounts and mark them as Funded or Failed to see your challenge pass rate and fee ROI.</div>
          <button className="btn primary" style={{ fontSize: 13, padding: "10px 20px" }} onClick={() => router.push("/app/firms")}>
            Manage accounts
          </button>
        </div>
      </div>
    );
  }

  const net = netProfit(state);
  const roiText = roi != null ? (roi >= 0 ? "+" : "") + roi.toFixed(0) + "% ROI" : "—";
  const roiColor = net >= 0 ? "var(--jade-1)" : "var(--rose-1)";
  const offset = pr ? CIRC - (pr.rate / 100) * CIRC : CIRC;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Challenge Analytics</div>
      </div>

      {pr && (
        <div className="pass-rate-visual">
          <div className="pass-rate-circle">
            <svg viewBox="0 0 48 48">
              <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="24"
                cy="24"
                r={R}
                fill="none"
                stroke="var(--jade-2)"
                strokeWidth="3"
                strokeDasharray={CIRC.toFixed(1)}
                strokeDashoffset={offset.toFixed(1)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1.2s var(--ease-out)" }}
              />
            </svg>
            <div className="pass-rate-circle-text num">{pr.rate}%</div>
          </div>
          <div className="pass-rate-info">
            <div className="pass-rate-label">Challenge Pass Rate</div>
            <div className="pass-rate-detail">
              {pr.passed} funded · {pr.failed} failed · {pr.total} total
            </div>
          </div>
        </div>
      )}

      {fees > 0 && (
        <div className="pass-rate-visual">
          <div className="pass-rate-circle">
            <div style={{ fontSize: 18, fontWeight: 800, color: roiColor, letterSpacing: "-0.04em", position: "relative", zIndex: 1 }}>
              {roiText.split(" ")[0]}
            </div>
          </div>
          <div className="pass-rate-info">
            <div className="pass-rate-label">Fee ROI</div>
            <div className="pass-rate-detail">
              {fmtGBP(lifetimeWithdrawals(state), { short: true })} withdrawn vs {fmtGBP(fees, { short: true })} in fees —{" "}
              <span style={{ color: roiColor, fontWeight: 600 }}>
                {net >= 0 ? "+" : "−"}
                {fmtGBP(Math.abs(net), { short: true })} net
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
