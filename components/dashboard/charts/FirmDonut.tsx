"use client";

import { useEffect, useRef } from "react";

const SZ = 90,
  R = 32,
  CX = 45,
  CY = 45;
const CIRC = +(2 * Math.PI * R).toFixed(2);

export default function FirmDonut({ received, awaiting, denied }: { received: number; awaiting: number; denied: number }) {
  const total = received + awaiting + denied;
  const refs = useRef<(SVGCircleElement | null)[]>([]);

  const segs = [
    { count: received, color: "#3b82f6" },
    { count: awaiting, color: "#f59e0b" },
    { count: denied, color: "#ff3333" },
  ];

  let cumLen = 0;
  const arcs = segs.map((seg) => {
    if (!seg.count) return null;
    const len = +((seg.count / total) * CIRC).toFixed(2);
    const arc = { ...seg, len, offset: -cumLen };
    cumLen += len;
    return arc;
  });

  useEffect(() => {
    // Draw-in animation: paint at "0 CIRC" (no arc visible), then on next frame animate
    // stroke-dasharray to the real length — same two-phase render as the original's
    // data-pie-target + global rAF pass, just scoped to this component.
    const raf = requestAnimationFrame(() => {
      refs.current.forEach((el, i) => {
        const arc = arcs[i];
        if (!el || !arc) return;
        el.style.transition = "stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)";
        el.setAttribute("stroke-dasharray", `${arc.len} ${CIRC}`);
      });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [received, awaiting, denied]);

  return (
    <svg viewBox={`0 0 ${SZ} ${SZ}`} width={SZ} height={SZ}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
      {total > 0 &&
        arcs.map(
          (arc, i) =>
            arc && (
              <circle
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                style={{ stroke: arc.color }}
                strokeWidth="9"
                strokeLinecap="butt"
                strokeDasharray={`0 ${CIRC}`}
                strokeDashoffset={arc.offset}
                transform={`rotate(-90 ${CX} ${CY})`}
              />
            )
        )}
      <text x={CX} y={CY - 3} textAnchor="middle" dominantBaseline="middle" style={{ fill: "rgba(255,255,255,0.9)" }} fontSize="16" fontWeight="800">
        {total}
      </text>
      <text x={CX} y={CY + 12} textAnchor="middle" style={{ fill: "rgba(255,255,255,0.3)" }} fontSize="7" fontWeight="600" letterSpacing="0.1em">
        PAYOUTS
      </text>
    </svg>
  );
}
