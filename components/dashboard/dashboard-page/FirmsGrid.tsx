"use client";

import { useRouter } from "next/navigation";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import FirmCard from "./FirmCard";

export default function FirmsGrid() {
  const router = useRouter();
  const store = useLedgerStore();
  const state = getLedgerState(store);

  return (
    <div className="ov-firms-section">
      <div className="ov-section-head">
        <div className="ov-section-title">Firms & Accounts ({state.firms.length})</div>
        <button className="ov-section-link" onClick={() => router.push("/app/firms")}>
          Manage →
        </button>
      </div>

      {state.firms.length === 0 ? (
        <div className="ov-empty-firms">No firms added yet — tap Manage to add your first firm</div>
      ) : (
        <div className="ov-firm-grid">
          {state.firms.map((firm) => (
            <FirmCard key={firm.id} firm={firm} state={state} />
          ))}
        </div>
      )}
    </div>
  );
}
