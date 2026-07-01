"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_PAGES, pagePath } from "@/lib/domain/pages";
import Icon from "@/components/ui/Icon";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {MOBILE_PAGES.map((page) => (
        <Link key={page.id} href={pagePath(page.id)} className={`bottom-nav-item${pathname === pagePath(page.id) ? " active" : ""}`}>
          <Icon name={page.icon} />
          <span>{page.label}</span>
        </Link>
      ))}
    </nav>
  );
}
