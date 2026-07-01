"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "@/components/ui/Icon";

const THRESHOLD = 40;

export default function SwipeableRow({ children, onEdit, onDelete }: { children: ReactNode; onEdit: () => void; onDelete: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
    startY.current = e.clientY;
    dragging.current = false;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (e.buttons === 0 && e.pointerType === "mouse") return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (!dragging.current && Math.abs(dy) > Math.abs(dx)) return;
    dragging.current = true;
    if (dx < -THRESHOLD && !open) setOpen(true);
    else if (dx > THRESHOLD && open) setOpen(false);
  }
  function onPointerUp() {
    dragging.current = false;
  }

  return (
    <div className="swipe-row" ref={wrapRef}>
      <div className={`swipe-actions${open ? " visible" : ""}`}>
        <button
          className="swipe-action-btn edit"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            onEdit();
          }}
        >
          <Icon name="edit" />
          Edit
        </button>
        <button
          className="swipe-action-btn delete"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            onDelete();
          }}
        >
          <Icon name="trash" />
          Delete
        </button>
      </div>
      <div
        className={`swipe-content${open ? " open" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {children}
      </div>
    </div>
  );
}
