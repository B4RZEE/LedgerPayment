"use client";

import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { lifetimeSpend, netProfit, recentSpending, spendThisMonth, spendThisYear, spendingByCategory } from "@/lib/domain/selectors";
import { SPENDING_CATEGORIES } from "@/lib/domain/meta";
import { fmtGBP, todayISO } from "@/lib/format";
import { openSpendingSheet } from "@/components/dashboard/sheets/SpendingSheet";
import Icon from "@/components/ui/Icon";
import SpendItem from "./SpendItem";

export default function TradingCostsCard() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const spend = lifetimeSpend(state);
  const net = netProfit(state);
  const byCat = spendingByCategory(state);
  const entries = recentSpending(state);
  const month = spendThisMonth(state);
  const year = spendThisYear(state);
  const usedCats = SPENDING_CATEGORIES.filter((c) => byCat[c.id] > 0);

  return (
    <section className="section">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Trading Costs</div>
          <button className="card-action primary" onClick={() => openSpendingSheet()}>
            <span style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 4 }}>
              <Icon name="plus" />
            </span>
            Add cost
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📒</div>
            <div className="empty-title">No costs logged yet</div>
            <div className="empty-text">Log challenge purchases, cash deposits, and tooling fees to see your real net profit.</div>
            <button className="empty-btn" onClick={() => openSpendingSheet()}>
              Add a cost
            </button>
          </div>
        ) : (
          <div>
            <div className="expected">
              <div className="exp-card">
                <div className="exp-label">Total Spent</div>
                <div className="exp-value num">{fmtGBP(spend, { short: spend >= 1000 })}</div>
                <div className="exp-count">
                  {entries.length} {entries.length === 1 ? "entry" : "entries"}
                </div>
              </div>
              <div className="exp-card">
                <div className="exp-label">Net Profit</div>
                <div className="exp-value num" style={{ color: net >= 0 ? "var(--jade-1)" : "var(--rose-1)" }}>
                  {net >= 0 ? "" : "−"}
                  {fmtGBP(Math.abs(net), { short: Math.abs(net) >= 1000 })}
                </div>
                <div className="exp-count">withdrawals − costs</div>
              </div>
              <div className="exp-card">
                <div className="exp-label">Spent This Month</div>
                <div className="exp-value num">{fmtGBP(month, { short: month >= 1000 })}</div>
                <div className="exp-count">all categories</div>
              </div>
              <div className="exp-card">
                <div className="exp-label">Spent This Year</div>
                <div className="exp-value num">{fmtGBP(year, { short: year >= 1000 })}</div>
                <div className="exp-count">{todayISO().slice(0, 4)}</div>
              </div>
            </div>

            {usedCats.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div className="cost-breakdown">
                  {usedCats.map((c) => (
                    <div key={c.id} className="cost-cat">
                      <div className="cost-cat-icon">{c.icon}</div>
                      <div className="cost-cat-body">
                        <div className="cost-cat-label">{c.label}</div>
                        <div className="cost-cat-value num">{fmtGBP(byCat[c.id], { short: byCat[c.id] >= 1000 })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 18 }}>
              <div className="timeline stagger">
                {entries.slice(0, 8).map((s) => (
                  <SpendItem key={s.id} s={s} state={state} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
