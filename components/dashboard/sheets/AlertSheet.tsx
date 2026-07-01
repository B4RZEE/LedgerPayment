"use client";

import SheetHead from "./SheetHead";
import { useUiStore } from "@/lib/store/uiStore";

export interface AlertSheetButton {
  label: string;
  variant?: "ghost" | "danger" | "primary";
  action?: () => void;
}

interface AlertSheetProps {
  title: string;
  body: string;
  buttons?: AlertSheetButton[];
  cancelLabel?: string;
  showCancel?: boolean;
}

function AlertSheetContent({ title, body, buttons = [], cancelLabel = "Cancel", showCancel = true }: AlertSheetProps) {
  const closeSheet = useUiStore((s) => s.closeSheet);
  return (
    <div>
      <SheetHead title={title} />
      <div className="sheet-body" style={{ padding: "4px 0 0" }}>
        <p style={{ fontSize: 15, color: "var(--text-1)", lineHeight: 1.65, marginBottom: 24 }}>{body}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {buttons.map((b) => (
            <button
              key={b.label}
              className={`btn ${b.variant || "ghost"}`}
              onClick={() => {
                closeSheet();
                b.action?.();
              }}
            >
              {b.label}
            </button>
          ))}
          {showCancel && (
            <button className="btn ghost" onClick={closeSheet}>
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Callable from anywhere (event handlers, not just component render), matching the
 *  original's global alertSheet() helper. */
export function showAlertSheet(props: AlertSheetProps) {
  useUiStore.getState().openSheet(<AlertSheetContent {...props} />);
}
