"use client";

import type { LedgerState, Payout } from "@/lib/store/types";
import { getAccount, getFirm, payoutCountdown } from "@/lib/domain/selectors";
import { firmAvatar, firmInitials } from "@/lib/domain/avatar";
import { fmtDateShort, fmtGBP } from "@/lib/format";
import { statusLabel } from "@/lib/domain/meta";
import { openPayoutSheet } from "@/components/dashboard/sheets/PayoutSheet";

export default function PayoutItem({ p, state }: { p: Payout; state: LedgerState }) {
  const firm = getFirm(state, p.firmId);
  const acct = getAccount(state, p.accountId);
  const { cdClass, cdText } = payoutCountdown(p);

  return (
    <button className="pay-item" onClick={() => openPayoutSheet(p.id)}>
      <div className="pay-avatar" style={{ background: firmAvatar(firm) }}>
        {firmInitials(firm?.name)}
      </div>
      <div className="pay-body">
        <div className="pay-firm">{firm?.name || "Unknown firm"}</div>
        <div className="pay-meta">
          {fmtDateShort(p.date)}
          <span className="sep">·</span>
          {statusLabel(p.status)}
          {acct && (
            <>
              <span className="sep">·</span>
              {acct.label}
            </>
          )}
        </div>
      </div>
      <div className="pay-right">
        <div className={`pay-amount${p.status === "received" ? " received" : ""}`}>{fmtGBP(p.amount)}</div>
        <div className={`pay-countdown ${cdClass}`}>{cdText}</div>
      </div>
    </button>
  );
}
