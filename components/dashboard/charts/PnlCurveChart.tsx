"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLedgerStore, getLedgerState } from "@/lib/store/ledgerStore";
import { lifetimeSpend, lifetimeWithdrawals, netProfit } from "@/lib/domain/selectors";
import { pnlCurveSeries, type PnlRangeKey } from "@/lib/charts/pnlCurveSeries";
import { buildPnlPath } from "@/lib/charts/buildPnlPath";
import { fmtDateShort, fmtGBP } from "@/lib/format";

const RANGES: PnlRangeKey[] = ["7D", "30D", "3M", "1Y", "ALL"];
const H = 160;
const PAD_L = 8,
  PAD_T = 14,
  PAD_R = 8,
  PAD_B = 28;

export default function PnlCurveChart() {
  const store = useLedgerStore();
  const state = getLedgerState(store);
  const [activeRange, setActiveRange] = useState<PnlRangeKey>("ALL");
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const crossHRef = useRef<SVGLineElement>(null);
  const hoverDotRef = useRef<SVGCircleElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tipDateRef = useRef<HTMLDivElement>(null);
  const tipValRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);

  useLayoutEffect(() => {
    if (wrapRef.current) setWidth(wrapRef.current.clientWidth || 360);
  }, [activeRange]);

  const net = netProfit(state);
  const netClass = net > 0 ? "pos" : net < 0 ? "neg" : "neutral";
  const netSign = net >= 0 ? "+" : "−";
  const lineColor = net >= 0 ? "#ff3333" : "#fb7185";
  const glowColor = net >= 0 ? "rgba(255,51,51,0.5)" : "rgba(251,113,133,0.5)";
  const gradStop = net >= 0 ? "rgba(255,51,51,0.18)" : "rgba(251,113,133,0.18)";

  const points = useMemo(() => pnlCurveSeries(state, activeRange), [state, activeRange]);
  const path = useMemo(() => buildPnlPath(points, width, H, PAD_L, PAD_T, PAD_R, PAD_B), [points, width]);

  // Draw-in animation: measure the path length after it's painted with its final `d`, then
  // animate stroke-dashoffset from full-length to 0. Double rAF (one to let the browser commit
  // the 0%-drawn state, one to trigger the transition) — collapsing this to a single rAF makes
  // the transition start from the final state instead of animating, exactly as in the original.
  useEffect(() => {
    const el = linePathRef.current;
    if (!el || points.length < 2) return;
    let raf1 = 0,
      raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      const len = el.getTotalLength ? el.getTotalLength() : 9999;
      el.style.transition = "none";
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      raf2 = requestAnimationFrame(() => {
        el.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)";
        el.style.strokeDashoffset = "0";
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [path.d, points.length]);

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current || points.length < 2) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const chartW = width - PAD_L - PAD_R;
    const pct = Math.max(0, Math.min(1, (mx - PAD_L) / chartW));
    const idx = Math.round(pct * (points.length - 1));
    const pt = points[idx];
    if (!pt) return;
    const px = path.xs[idx];
    const py = path.ys[idx];

    crossHRef.current?.setAttribute("x1", px.toFixed(1));
    crossHRef.current?.setAttribute("x2", px.toFixed(1));
    if (crossHRef.current) crossHRef.current.style.display = "";
    hoverDotRef.current?.setAttribute("cx", px.toFixed(1));
    hoverDotRef.current?.setAttribute("cy", py.toFixed(1));
    if (hoverDotRef.current) hoverDotRef.current.style.display = "";

    const v = pt.value;
    if (tipDateRef.current) tipDateRef.current.textContent = pt.synth ? "Start of range" : fmtDateShort(pt.date);
    if (tipValRef.current) {
      tipValRef.current.textContent = (v >= 0 ? "+" : "−") + fmtGBP(Math.abs(v));
      tipValRef.current.className = "ov-pnl-tip-val " + (v > 0 ? "pos" : v < 0 ? "neg" : "");
    }

    const tipW = 130;
    const svgW = rect.width;
    const tipLeft = (px / width) * svgW;
    if (tooltipRef.current) {
      if (tipLeft + tipW + 16 > svgW) {
        tooltipRef.current.style.left = "";
        tooltipRef.current.style.right = svgW - tipLeft + 8 + "px";
      } else {
        tooltipRef.current.style.right = "";
        tooltipRef.current.style.left = tipLeft + 12 + "px";
      }
      tooltipRef.current.classList.add("visible");
    }
  }

  function handleMouseLeave() {
    if (crossHRef.current) crossHRef.current.style.display = "none";
    if (hoverDotRef.current) hoverDotRef.current.style.display = "none";
    tooltipRef.current?.classList.remove("visible");
  }

  const gradId = "pnlFillGrad";
  const glowId = "pnlGlow";
  const labelIdxs = points.length ? [0, Math.floor((points.length - 1) / 2), points.length - 1] : [];
  const endX = path.xs[path.xs.length - 1];
  const endY = path.ys[path.ys.length - 1];

  return (
    <div className="ov-pnl-card">
      <div className="ov-pnl-top">
        <div>
          <div className="ov-pnl-label">Net P&L Curve</div>
          <div className={`ov-pnl-value ${netClass}`}>
            {lifetimeWithdrawals(state) === 0 && lifetimeSpend(state) === 0 ? "—" : netSign + fmtGBP(Math.abs(net))}
          </div>
          <div className="ov-pnl-subdesc">Payouts in minus costs out, over time</div>
        </div>
        <div className="ov-pnl-tabs">
          {RANGES.map((r) => (
            <button key={r} className={`ov-pnl-tab${r === activeRange ? " active" : ""}`} onClick={() => setActiveRange(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="ov-pnl-chart-wrap" ref={wrapRef}>
        <div className="ov-pnl-tooltip" ref={tooltipRef}>
          <div className="ov-pnl-tip-date" ref={tipDateRef} />
          <div className="ov-pnl-tip-val" ref={tipValRef} />
        </div>

        {points.length < 2 ? (
          <div className="ov-pnl-empty">Not enough data for this range — add payouts to see your curve</div>
        ) : (
          <svg ref={svgRef} viewBox={`0 0 ${width} ${H}`} width={width} height={H} className="ov-pnl-svg" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradStop} />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>
              <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {path.minV < 0 && path.maxV > 0 && (
              <>
                <line x1={PAD_L} x2={width - PAD_R} y1={path.toY(0).toFixed(1)} y2={path.toY(0).toFixed(1)} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <text x={width - PAD_R - 2} y={path.toY(0) - 3} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">
                  Breakeven
                </text>
              </>
            )}

            {labelIdxs.map((idx) => {
              const pt = points[idx];
              if (!pt || pt.synth) return null;
              return (
                <text key={idx} x={path.xs[idx].toFixed(1)} y={H - 6} textAnchor={idx === 0 ? "start" : idx === points.length - 1 ? "end" : "middle"} fill="rgba(255,255,255,0.25)" fontSize="9">
                  {fmtDateShort(pt.date)}
                </text>
              );
            })}

            <path d={path.dFill} fill={`url(#${gradId})`} />
            <path ref={linePathRef} d={path.d} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: lineColor, filter: `drop-shadow(0 0 4px ${glowColor})` }} />

            <circle cx={endX?.toFixed(1)} cy={endY?.toFixed(1)} r="6" style={{ fill: lineColor, opacity: 0.25 }}>
              <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={endX?.toFixed(1)} cy={endY?.toFixed(1)} r="3.5" fill="#fff" style={{ filter: `drop-shadow(0 0 5px ${lineColor})` }} />

            <line ref={crossHRef} y1={PAD_T} y2={H - PAD_B} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" style={{ display: "none" }} />
            <circle ref={hoverDotRef} r="4" fill="#fff" strokeWidth="2" style={{ stroke: lineColor, display: "none" }} />
          </svg>
        )}
      </div>
    </div>
  );
}
