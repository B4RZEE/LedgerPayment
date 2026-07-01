"use client";

import { useEffect } from "react";
import { useUiStore } from "@/lib/store/uiStore";

export default function SheetHost() {
  const open = useUiStore((s) => s.sheetOpen);
  const content = useUiStore((s) => s.sheetContent);
  const close = useUiStore((s) => s.closeSheet);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className={`scrim${open ? " open" : ""}`} onClick={close} />
      <div className={`sheet${open ? " open" : ""}`} role="dialog" aria-modal="true">
        <div className="sheet-handle" />
        <div>{content}</div>
      </div>
    </>
  );
}
