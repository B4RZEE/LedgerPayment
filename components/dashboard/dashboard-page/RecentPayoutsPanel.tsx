"use client";

import { useRouter } from "next/navigation";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { getFirm, recentSettled } from "@/lib/domain/selectors";
import { firmAvatar, firmInitials } from "@/lib/domain/avatar";
import { fmtDateShort, fmtGBP } from "@/lib/format";
import { openPayoutSheet } from "@/components/dashboard/sheets/PayoutSheet";

export default function RecentPayoutsPanel() {
  const router = useRouter();
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const recent = recentSettled(state).slice(0, 8);

  return (
    <div className="ov-recent">
      <div className="ov-recent-head">
        <div className="ov-recent-title">Recent Payouts</div>
        <button className="ov-recent-link" onClick={() => router.push("/app/payouts")}>
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-4)", fontSize: 13 }}>No payouts recorded yet</div>
      ) : (
        recent.map((p) => {
          const firm = getFirm(state, p.firmId);
          const isReceived = p.status === "received";
          const isDenied = p.status === "denied";
          const amtClass = isReceived ? "received" : isDenied ? "denied" : "awaiting";
          const pillLabel = isReceived ? "Paid" : isDenied ? "Denied" : "Pending";
          return (
            <div key={p.id} className="ov-pay-row" onClick={() => openPayoutSheet(p.id)}>
              <div className="ov-pay-avatar" style={{ background: firmAvatar(firm) }}>
                {firmInitials(firm?.name)}
              </div>
              <div className="ov-pay-body">
                <div className="ov-pay-firm">{firm?.name || "Unknown firm"}</div>
                <div className="ov-pay-date">{fmtDateShort(p.date)}</div>
              </div>
              <div className={`ov-pay-amount ${amtClass}`}>
                {isReceived ? "+" + fmtGBP(p.amount) : fmtGBP(p.amount)}
                <span className={`ov-pay-status-pill ${amtClass}`}>{pillLabel}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
