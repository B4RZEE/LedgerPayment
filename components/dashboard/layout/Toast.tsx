"use client";

import { useUiStore } from "@/lib/store/uiStore";

export default function Toast() {
  const message = useUiStore((s) => s.toastMessage);
  const visible = useUiStore((s) => s.toastVisible);
  if (!message) return null;
  return (
    <div className={`toast${visible ? " visible" : ""}`}>
      <span className="check">✓</span>
      {message}
    </div>
  );
}
