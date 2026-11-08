import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { LeadsInbox } from "@/components/admin/leads-inbox";
import { requireSession } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Leads inbox" };

export default async function LeadsPage() {
  await requireSession("admin");
  const supabase = await createClient();
  const [{ data: leads, error }, { data: team }, { data: services }, { data: courses }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(1000),
    supabase.from("profiles").select("id, full_name, email").eq("is_active", true).order("full_name"),
    supabase.from("services").select("id, title"),
    supabase.from("courses").select("id, title"),
  ]);
  if (error) throw new Error(error.message);
  return (
    <>
      <AdminPageHeader title="Leads inbox" description="Quote requests, contact messages, enrollments and applications." crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Leads" }]} />
      <LeadsInbox
        leads={leads ?? []}
        team={team ?? []}
        lookups={{ services: Object.fromEntries((services ?? []).map((s) => [s.id, s.title])), courses: Object.fromEntries((courses ?? []).map((c) => [c.id, c.title])) }}
      />
    </>
  );
}
