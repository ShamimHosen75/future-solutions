import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/page-header";
import { UsersTable } from "@/components/admin/users-table";
import { requireSession } from "@/lib/admin/auth";
import { serverEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const session = await requireSession("admin");
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (
    <>
      <AdminPageHeader title="Users" description="Who can sign in to this dashboard and what they can do." crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Users" }]} />
      <UsersTable users={data ?? []} currentUserId={session.userId} canInvite={Boolean(serverEnv().SUPABASE_SERVICE_ROLE_KEY)} />
    </>
  );
}
