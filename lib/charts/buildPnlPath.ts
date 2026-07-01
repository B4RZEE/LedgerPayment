import type { PnlPoint } from "./pnlCurveSeries";

export interface PnlPathResult {
  d: string;
  dFill: string;
  xs: number[];
  ys: number[];
  minV: number;
  maxV: number;
  toY: (v: number) => number;
}

export function buildPnlPath(points: PnlPoint[], W: number, H: number, padL: number, padT: number, padR: number, padB: number): PnlPathResult {
  if (points.length < 2) return { d: "", dFill: "", xs: [], ys: [], minV: 0, maxV: 0, toY: () => 0 };
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const minV = Math.min(0, ...points.map((p) => p.value));
  const maxV = Math.max(0, ...points.map((p) => p.value));
  const range = maxV - minV || 1;
  const toX = (i: number) => padL + (i / (points.length - 1)) * chartW;
  const toY = (v: number) => padT + chartH - ((v - minV) / range) * chartH;
  const xs = points.map((_, i) => toX(i));
  const ys = points.map((p) => toY(p.value));

  // Smooth cubic bezier path
  let d = `M ${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2;
    d += ` C ${cpx.toFixed(1)} ${ys[i - 1].toFixed(1)}, ${cpx.toFixed(1)} ${ys[i].toFixed(1)}, ${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`;
  }
  const baseY = toY(0).toFixed(1);
  const dFill = d + ` L ${xs[xs.length - 1].toFixed(1)} ${baseY} L ${xs[0].toFixed(1)} ${baseY} Z`;
  return { d, dFill, xs, ys, minV, maxV, toY };
}
