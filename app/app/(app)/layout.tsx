import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/dashboard/layout/AppShell";
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

  return (
    <AppShell userId={user.id} email={user.email ?? null}>
      {children}
    </AppShell>
  );
}
