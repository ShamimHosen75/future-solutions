import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordForm } from "@/components/admin/record-form/record-form";
import { requireSession } from "@/lib/admin/auth";
import { getModule } from "@/lib/admin/modules";
import { defaultValues } from "@/lib/admin/schema";
import { loadRelationOptions } from "@/lib/admin/relations";

type Params = Promise<{ module: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const def = getModule((await params).module);
  return { title: def ? `New ${def.singular.toLowerCase()}` : "Not found" };
}

export default async function NewRecordPage({ params }: { params: Params }) {
  const def = getModule((await params).module);
  if (!def) notFound();
  await requireSession();
  const relationOptions = await loadRelationOptions(def);
  return <RecordForm moduleKey={def.key} id={null} initialValues={defaultValues(def)} relationOptions={relationOptions} />;
}
