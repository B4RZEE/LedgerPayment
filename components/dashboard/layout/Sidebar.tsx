"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PAGES, pagePath } from "@/lib/domain/pages";
import Icon from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/app/login");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-mark" />
        <div className="sidebar-name">Ledger</div>
      </div>

      <nav className="sidebar-nav">
        {PAGES.map((page) => (
          <Link
            key={page.id}
            href={pagePath(page.id)}
            className={`nav-item sidebar-nav-item${pathname === pagePath(page.id) ? " active" : ""}`}
            title={page.label}
          >
            <Icon name={page.icon} />
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item sidebar-nav-item" title="Log Out" style={{ color: "var(--rose-1)" }} onClick={handleLogout}>
          <Icon name="logout" />
        </button>
      </div>
    </aside>
  );
}
