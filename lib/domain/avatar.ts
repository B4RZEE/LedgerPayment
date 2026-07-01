import type { Firm } from "@/lib/store/types";

export function firmInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #e01c1c, #06b6d4)",
  "linear-gradient(135deg, #6366f1, #a855f7)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #ec4899, #8b5cf6)",
  "linear-gradient(135deg, #14b8a6, #0ea5e9)",
  "linear-gradient(135deg, #f43f5e, #8b5cf6)",
  "linear-gradient(135deg, #84cc16, #14b8a6)",
  "linear-gradient(135deg, #06b6d4, #6366f1)",
];

export function firmAvatar(firm: Firm | null | undefined): string {
  if (!firm) return AVATAR_GRADIENTS[0];
  // Hash firm id to a stable gradient
  let h = 0;
  for (const ch of firm.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}
