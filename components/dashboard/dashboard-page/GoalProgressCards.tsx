"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { earnedThisMonth, earnedThisWeek, earnedThisYear, earnedToday } from "@/lib/domain/selectors";
import { fmtGBP } from "@/lib/format";

export default function GoalProgressCards() {
  const router = useRouter();
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const g = state.profile.goals;

  const goals = [
    { key: "daily", label: "Today", current: earnedToday(state), target: g.daily },
    { key: "weekly", label: "This Week", current: earnedThisWeek(state), target: g.weekly },
    { key: "monthly", label: "This Month", current: earnedThisMonth(state), target: g.monthly },
    { key: "annual", label: "This Year", current: earnedThisYear(state), target: g.annual },
  ];

  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      barRefs.current.forEach((el, i) => {
        const goal = goals[i];
        if (!el || !goal) return;
        const pct = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
        el.style.width = pct.toFixed(2) + "%";
      });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals.map((g) => `${g.current}-${g.target}`).join(",")]);

  return (
    <div>
      <div className="ov-section-head">
        <div className="ov-section-title">Income Goals</div>
        {/* TODO(Phase 10): open the real goals-edit sheet instead of navigating to Settings. */}
        <button className="ov-section-link" onClick={() => router.push("/app/settings")}>
          Edit targets
        </button>
      </div>
      <div className="ov-goals-grid">
        {goals.map(({ label, current, target }, i) => {
          const hasGoal = target > 0;
          const realPct = hasGoal ? (current / target) * 100 : 0;
          const pctDisplay = !hasGoal ? "—" : realPct.toFixed(0) + "%";
          const done = hasGoal && realPct >= 100;
          return (
            <div key={label} className="ov-goal-card">
              <div className="ov-goal-row">
                <div className="ov-goal-name">{label}</div>
                <div className={`ov-goal-pct${done ? " done" : ""}`}>{pctDisplay}</div>
              </div>
              <div className="ov-goal-amounts">
                <div className="ov-goal-current">{fmtGBP(current, { short: current >= 10000 })}</div>
                <div className="ov-goal-of">{hasGoal ? `of ${fmtGBP(target, { short: target >= 10000 })}` : "no target set"}</div>
              </div>
              <div className="ov-goal-bar-track">
                <div
                  className={`ov-goal-bar-fill${done ? " done" : ""}`}
                  style={{ width: 0 }}
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
