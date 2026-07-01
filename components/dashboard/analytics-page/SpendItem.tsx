"use client";

import type { LedgerState, Spending } from "@/lib/store/types";
import { getAccount, getFirm } from "@/lib/domain/selectors";
import { categoryMeta } from "@/lib/domain/meta";
import { fmtDateShort, fmtGBP } from "@/lib/format";
import { openSpendingSheet } from "@/components/dashboard/sheets/SpendingSheet";

export default function SpendItem({ s, state }: { s: Spending; state: LedgerState }) {
  const cat = categoryMeta(s.category);
  const firm = s.firmId ? getFirm(state, s.firmId) : undefined;
  const acct = s.accountId ? getAccount(state, s.accountId) : undefined;

  return (
    <button className="pay-item" onClick={() => openSpendingSheet(s.id)}>
      <div
        className="pay-avatar"
        style={{ background: `${cat.color}1f`, color: cat.color, boxShadow: `inset 0 0 0 1px ${cat.color}44`, fontSize: 18 }}
      >
        {cat.icon}
      </div>
      <div className="pay-body">
        <div className="pay-firm">{s.notes && s.notes.trim() ? s.notes : cat.label}</div>
        <div className="pay-meta">
          {fmtDateShort(s.date)}
          <span className="sep">·</span>
          {cat.label}
          {firm && (
            <>
              <span className="sep">·</span>
              {firm.name}
            </>
          )}
        </div>
        {acct && <div className="cost-account-tag">📊 {acct.label}</div>}
      </div>
      <div className="pay-right">
        <div className="pay-amount" style={{ color: "var(--rose-1)" }}>
          −{fmtGBP(s.amount)}
        </div>
      </div>
    </button>
  );
}
