"use client";

import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { accountsForFirm, payoutsForFirm } from "@/lib/domain/selectors";
import { firmAvatar, firmInitials } from "@/lib/domain/avatar";
import { fmtGBP } from "@/lib/format";
import { healthLabel } from "@/lib/domain/meta";
import { openFirmSheet } from "@/components/dashboard/sheets/FirmSheet";
import { openAccountSheet } from "@/components/dashboard/sheets/AccountSheet";
import Icon from "@/components/ui/Icon";

export default function FirmListCard() {
  const store = useLedgerStore();
  const state = getLedgerState(store);

  return (
    <section className="section">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Account Health</div>
          <button className="card-action" onClick={() => openFirmSheet()}>
            <span style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 4 }}>
              <Icon name="plus" />
            </span>
            Add firm
          </button>
        </div>

        {state.firms.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🏛</div>
            <div className="empty-title">No firms yet</div>
            <div className="empty-text">Add the prop firms you trade with to track account health.</div>
            <button className="empty-btn" onClick={() => openFirmSheet()}>
              Add a firm
            </button>
          </div>
        ) : (
          <div className="firms-list stagger">
            {state.firms.map((firm) => {
              const accounts = accountsForFirm(state, firm.id);
              const firmReceived = payoutsForFirm(state, firm.id).filter((p) => p.status === "received");
              const firmTotal = firmReceived.reduce((s, p) => s + Number(p.amount || 0), 0);
              const subParts = [`${accounts.length} account${accounts.length === 1 ? "" : "s"}`];
              if (firmReceived.length) subParts.push(`${fmtGBP(firmTotal, { short: firmTotal >= 1000 })} received`);

              return (
                <div key={firm.id} className="firm-card" onClick={() => openFirmSheet(firm.id)}>
                  <div className="firm-head">
                    <div className="firm-head-left">
                      <div className="pay-avatar" style={{ background: firmAvatar(firm), width: 36, height: 36, fontSize: 13 }}>
                        {firmInitials(firm.name)}
                      </div>
                      <div>
                        <div className="firm-name">{firm.name}</div>
                        <div className="firm-sub">{subParts.join(" · ")}</div>
                      </div>
                    </div>
                  </div>

                  <div className="firm-accounts">
                    {accounts.map((a) => (
                      <button
                        key={a.id}
                        className={`account-chip ${a.health}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openAccountSheet(a.id);
                        }}
                      >
                        <span className="dot" />
                        {a.label}
                        <span style={{ color: "var(--text-2)", marginLeft: 5, fontSize: 10, fontWeight: 500 }}>{healthLabel(a.health)}</span>
                      </button>
                    ))}
                    <button
                      className="account-chip add"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAccountSheet(undefined, firm.id);
                      }}
                    >
                      + Account
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
