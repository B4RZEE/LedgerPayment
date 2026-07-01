"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PAGES, pagePath } from "@/lib/domain/pages";
import Icon from "@/components/ui/Icon";
import { useUiStore } from "@/lib/store/uiStore";
import { createClient } from "@/lib/supabase/client";
import { useLedgerStore } from "@/lib/store/ledgerStore";

// Tier gating (PRO_PAGES / isFree()) is TESTING_MODE-disabled in the original app today —
// ported when Settings/subscription UI lands. No pages render as locked right now, matching
// current production behavior.

export default function NavDrawer() {
  const pathname = usePathname();
  const router = useRouter();
  const open = useUiStore((s) => s.navDrawerOpen);
  const close = useUiStore((s) => s.closeNavDrawer);
  const email = useLedgerStore((s) => s.email);

  async function handleLogout() {
    close();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/app/login");
    router.refresh();
  }

  let lastSection = "";

  return (
    <>
      <div className={`nav-overlay${open ? " open" : ""}`} onClick={close} />
      <div className={`nav-drawer${open ? " open" : ""}`}>
        <div className="nav-drawer-head">
          <div className="nav-drawer-brand">
            <div className="nav-drawer-brand-mark" />
            <div className="nav-drawer-title">Ledger</div>
          </div>
          <button className="nav-close" onClick={close}>
            <Icon name="close" />
          </button>
        </div>

        <div className="nav-list">
          {PAGES.map((page) => {
            const showLabel = page.section !== lastSection;
            lastSection = page.section;
            return (
              <div key={page.id}>
                {showLabel && <div className="nav-section-label">{page.section === "account" ? "Account" : "Navigation"}</div>}
                <Link href={pagePath(page.id)} className={`nav-item${pathname === pagePath(page.id) ? " active" : ""}`} onClick={close}>
                  <Icon name={page.icon} />
                  <span>{page.label}</span>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="nav-footer">
          {email && <div style={{ fontSize: 12, color: "var(--text-3)", padding: "4px 12px 10px" }}>{email}</div>}
          <button className="nav-item" style={{ color: "var(--rose-1)" }} onClick={handleLogout}>
            <Icon name="logout" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
