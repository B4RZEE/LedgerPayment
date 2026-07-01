"use client";

import { useId } from "react";
import { buildPnlPath } from "@/lib/charts/buildPnlPath";
import type { FirmCurvePoint } from "@/lib/domain/selectors";

const W = 300,
  H = 90;
const PAD_L = 0,
  PAD_T = 8,
  PAD_R = 0,
  PAD_B = 6;

export default function FirmMiniCurve({ points, color }: { points: FirmCurvePoint[]; color: string }) {
  const gradId = "fg-" + useId().replace(/[^a-zA-Z0-9]/g, "");

  if (points.length < 2) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H} className="fcc-svg">
        <text x={W / 2} y={H / 2} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.2)" fontSize="10">
          No data
        </text>
      </svg>
    );
  }

  const path = buildPnlPath(points, W, H, PAD_L, PAD_T, PAD_R, PAD_B);
  const endX = path.xs[path.xs.length - 1];
  const endY = path.ys[path.ys.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H} className="fcc-svg">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>
      <path d={path.dFill} fill={`url(#${gradId})`} />
      <path
        d={path.d}
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: color, filter: `drop-shadow(0 0 3px ${color})` }}
      />
      <circle cx={endX?.toFixed(1)} cy={endY?.toFixed(1)} r="3" fill="#fff" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}
