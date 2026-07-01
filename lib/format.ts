/* ================================================================
   FORMATTERS & DATE HELPERS
   Ported from public/app.html. Currency symbol is now an explicit
   parameter instead of a hidden module-global (`_sym()`), so these
   stay pure and don't need a currency-preference store to exist yet.
   ================================================================ */

export const CURRENCIES = {
  GBP: { sym: "£", label: "£ GBP" },
  USD: { sym: "$", label: "$ USD" },
  EUR: { sym: "€", label: "€ EUR" },
} as const;

export type CurrencyKey = keyof typeof CURRENCIES;

export const DEFAULT_CURRENCY_SYMBOL = CURRENCIES.GBP.sym;

const _nf2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const _nf0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

export function fmtGBP(n: number | null | undefined, opts: { short?: boolean } = {}, sym = DEFAULT_CURRENCY_SYMBOL): string {
  if (n == null || isNaN(n)) return sym + "0";
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  return sign + sym + (opts.short ? _nf0 : _nf2).format(abs);
}

export function compactGBP(n: number | null | undefined, sym = DEFAULT_CURRENCY_SYMBOL): string {
  // For tight slots (calendar cells): £850, £1.2k, £27.8k, £250k, £1.5M
  if (n == null || isNaN(n) || n === 0) return "";
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (abs >= 1000000) return sign + sym + (abs / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 100000) return sign + sym + Math.round(abs / 1000) + "k";
  if (abs >= 1000) return sign + sym + (abs / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return sign + sym + Math.round(abs);
}

export function fmtAmountParts(n: number | null | undefined, sym = DEFAULT_CURRENCY_SYMBOL): { whole: string; pence: string } {
  // Returns { whole: "£27,840", pence: ".62" } for hero display
  if (n == null || isNaN(n)) return { whole: sym + "0", pence: "" };
  const fixed = n.toFixed(2);
  const [intStr, decStr] = fixed.split(".");
  const withCommas = Number(intStr).toLocaleString("en-GB");
  return { whole: sym + withCommas, pence: "." + decStr };
}

export function localISO(d: Date): string {
  // Format a Date as YYYY-MM-DD using its local components (avoids UTC day-shift).
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dy = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dy}`;
}

export function localMonthISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function todayISO(): string {
  return localISO(new Date());
}

export function parseISO(iso: string | null | undefined): Date | null {
  // Always interpret as local date at noon to avoid TZ slippage
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function daysBetween(fromISO: string, toISO: string): number {
  const a = parseISO(fromISO);
  const b = parseISO(toISO);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function fmtDateShort(iso: string): string {
  const d = parseISO(iso);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function fmtDateLong(iso: string): string {
  const d = parseISO(iso);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function fmtMonthYear(iso: string): string {
  const d = parseISO(iso);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function monthKey(iso: string): string {
  return iso ? iso.slice(0, 7) : "";
}

export function startOfWeekISO(iso: string): string {
  // ISO week starts Monday
  const d = parseISO(iso)!;
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return localISO(d);
}

export function endOfWeekISO(iso: string): string {
  const s = parseISO(startOfWeekISO(iso))!;
  s.setDate(s.getDate() + 6);
  return localISO(s);
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function isInRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}
