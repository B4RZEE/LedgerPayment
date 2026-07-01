"use client";

import { useRouter } from "next/navigation";
import type { Account, Firm, LedgerState } from "@/lib/store/types";
import { firmAvatar, firmInitials } from "@/lib/domain/avatar";
import { fmtGBP } from "@/lib/format";
import { healthLabel } from "@/lib/domain/meta";
import FirmDonut from "@/components/dashboard/charts/FirmDonut";

// Chip CSS class per health value, matching the existing colour scheme (funded=red,
// active=lavender, eval=amber, blown=rose). The original checked for health values
// ("funded"/"eval"/"blown") that don't exist anywhere in the actual health enum
// (passed/active/in_progress/failed) — a dead-code bug where these chips could never
// render for any account. Fixed to key off the real health values instead.
const CHIP_CLASS: Record<Account["health"], string> = {
  passed: "funded",
  active: "active",
  in_progress: "eval",
  failed: "blown",
};

export default function FirmCard({ firm, state }: { firm: Firm; state: LedgerState }) {
  const router = useRouter();
  const allFirmPayouts = state.payouts.filter((p) => p.firmId === firm.id);
  const rCount = allFirmPayouts.filter((p) => p.status === "received").length;
  const aCount = allFirmPayouts.filter((p) => p.status === "awaiting_approval").length;
  const dCount = allFirmPayouts.filter((p) => p.status === "denied").length;
  const firmTotal = allFirmPayouts.filter((p) => p.status === "received").reduce((s, p) => s + Number(p.amount || 0), 0);
  const firmAccounts = state.accounts.filter((a) => a.firmId === firm.id);

  const healthCounts: Record<Account["health"], number> = { passed: 0, active: 0, in_progress: 0, failed: 0 };
  firmAccounts.forEach((a) => {
    healthCounts[a.health] = (healthCounts[a.health] || 0) + 1;
  });

  return (
    <div className="ov-firm-card" onClick={() => router.push("/app/firms")}>
      <div className="ov-firm-header">
        <div className="ov-firm-avatar" style={{ background: firmAvatar(firm) }}>
          {firmInitials(firm.name)}
        </div>
        <div className="ov-firm-info">
          <div className="ov-firm-name">{firm.name}</div>
          <div className="ov-firm-accts">
            {firmAccounts.length} account{firmAccounts.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="ov-firm-donut-wrap">
        <FirmDonut received={rCount} awaiting={aCount} denied={dCount} />
        <div className="ov-firm-legend">
          {[
            { color: "#3b82f6", label: "Received", count: rCount },
            { color: "#f59e0b", label: "Awaiting", count: aCount },
            { color: "#ff3333", label: "Denied", count: dCount },
          ].map(({ color, label, count }) => (
            <div key={label} className="ov-firm-legend-item">
              <div className="ov-firm-legend-dot" style={{ background: color }} />
              {count} {label}
            </div>
          ))}
        </div>
      </div>

      <div className="ov-firm-divider" />
      <div className="ov-firm-bottom">
        <div>
          <div className="ov-firm-total">{firmTotal > 0 ? fmtGBP(firmTotal, { short: firmTotal >= 10000 }) : "—"}</div>
          <div className="ov-firm-payout-meta">{rCount > 0 ? `${rCount} payout${rCount !== 1 ? "s" : ""} received` : "No payouts yet"}</div>
        </div>
        <div className="ov-firm-status-chips">
          {(Object.keys(healthCounts) as Account["health"][]).map(
            (health) => healthCounts[health] > 0 && (
              <span key={health} className={`ov-firm-chip ${CHIP_CLASS[health]}`}>
                {healthCounts[health]} {healthLabel(health)}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
