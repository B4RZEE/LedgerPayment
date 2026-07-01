import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "../../dashboard.css";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth — middleware already redirects unauthenticated requests to
  // /app/*, but a layout-level check means this route can never render without a
  // user even if middleware's matcher config ever drifts out of sync.
  if (!user) {
    redirect("/app/login");
  }

  // Phase 2 placeholder shell — Sidebar/TopBar/BottomNav/SheetHost/PinLockOverlay
  // land in Phase 4.
  return <div className="min-h-svh" style={{ background: "var(--bg-0)", color: "var(--text-0)" }}>{children}</div>;
}
