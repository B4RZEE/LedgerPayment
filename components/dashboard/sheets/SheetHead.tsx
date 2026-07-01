"use client";

import Icon from "@/components/ui/Icon";
import { useUiStore } from "@/lib/store/uiStore";

export default function SheetHead({ title, onClose }: { title: string; onClose?: () => void }) {
  const closeSheet = useUiStore((s) => s.closeSheet);
  return (
    <div className="sheet-head">
      <div className="sheet-title">{title}</div>
      <button className="sheet-close" onClick={onClose ?? closeSheet}>
        <Icon name="close" />
      </button>
    </div>
  );
}
