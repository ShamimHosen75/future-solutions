import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordForm } from "@/components/admin/record-form/record-form";
import { requireSession } from "@/lib/admin/auth";
import { getModule } from "@/lib/admin/modules";
import { rowToValues } from "@/lib/admin/schema";
import { loadRelationOptions } from "@/lib/admin/relations";
import { createClient } from "@/lib/supabase/server";

type Params = Promise<{ module: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const def = getModule((await params).module);
  return { title: def ? `Edit ${def.singular.toLowerCase()}` : "Not found" };
}

export default async function EditRecordPage({ params }: { params: Params }) {
  const { module, id } = await params;
  const def = getModule(module);
  if (!def || !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  await requireSession();
  const supabase = await createClient();
  const [{ data: row }, relationOptions] = await Promise.all([supabase.from(def.table).select("*").eq("id", id).maybeSingle(), loadRelationOptions(def)]);
  if (!row) notFound();
  const record = row as Record<string, unknown>;
  const slug = String(record["slug"] ?? "");
  const publicUrl = def.publicPaths(slug).find((p) => p.includes(slug) && slug.length > 0) ?? null;
  return <RecordForm moduleKey={def.key} id={id} initialValues={rowToValues(def, record)} relationOptions={relationOptions} publicUrl={publicUrl} />;
}
