"use client";

import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { firmLeaderboard } from "@/lib/domain/selectors";
import { firmAvatar, firmInitials } from "@/lib/domain/avatar";
import { fmtGBP } from "@/lib/format";

const RANK_LABELS = ["gold", "silver", "bronze"];

export default function FirmLeaderboardCard() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const board = firmLeaderboard(state);
  if (!board.length) return null;

  return (
    <section className="section">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Firm Leaderboard</div>
          <div className="section-meta">
            {board.length} firm{board.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="leaderboard">
          {board.map((entry, i) => {
            const drClass = entry.denialRate === null ? "" : entry.denialRate <= 10 ? "low" : entry.denialRate <= 30 ? "mid" : "high";
            const drText = entry.denialRate === null ? "—" : `${entry.denialRate}% denied`;
            return (
              <div key={entry.firm.id} className="lb-row">
                <div className={`lb-rank ${RANK_LABELS[i] || ""}`}>{i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}`}</div>
                <div className="pay-avatar" style={{ background: firmAvatar(entry.firm), width: 32, height: 32, fontSize: 11, flexShrink: 0 }}>
                  {firmInitials(entry.firm.name)}
                </div>
                <div className="lb-info">
                  <div className="lb-name">{entry.firm.name}</div>
                  <div className="lb-meta">
                    {entry.count} payout{entry.count === 1 ? "" : "s"}
                  </div>
                </div>
                {entry.denialRate !== null ? <div className={`lb-denial ${drClass}`}>{drText}</div> : <div />}
                <div className="lb-total num">{entry.total > 0 ? fmtGBP(entry.total, { short: entry.total >= 1000 }) : "—"}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
