import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/shell/admin-shell";
import { requireSession } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s · Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const supabase = await createClient();
  const [{ count: pendingReviews }, { count: newLeads }] = await Promise.all([
    supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("is_approved", false),
    session.profile.role === "admin"
      ? supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new")
      : Promise.resolve({ count: 0 }),
  ]);
  return (
    <AdminShell profile={session.profile} pendingReviews={pendingReviews ?? 0} newLeads={newLeads ?? 0}>
      {children}
    </AdminShell>
  );
}
