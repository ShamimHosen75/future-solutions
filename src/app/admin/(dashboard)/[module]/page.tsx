import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { requireSession } from "@/lib/admin/auth";
import { getModule } from "@/lib/admin/modules";
import { createClient } from "@/lib/supabase/server";

type Params = Promise<{ module: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const def = getModule((await params).module);
  return { title: def?.label ?? "Not found" };
}

export default async function ModuleListPage({ params }: { params: Params }) {
  const def = getModule((await params).module);
  if (!def) notFound();
  await requireSession();
  const supabase = await createClient();
  const { data, error } = await supabase.from(def.table).select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <>
      <AdminPageHeader title={def.label} description={def.description} crumbs={[{ label: "Dashboard", href: "/admin" }, { label: def.label }]} />
      <DataTable moduleKey={def.key} rows={(data ?? []) as never} />
    </>
  );
}
