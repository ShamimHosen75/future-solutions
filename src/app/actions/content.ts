"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/admin/auth";
import { getModule } from "@/lib/admin/modules";
import { moduleSchema } from "@/lib/admin/schema";
import { revalidateModule } from "@/lib/admin/revalidate";
import { slugify } from "@/lib/utils";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

function fail(message: string): ActionResult<never> {
  return { ok: false, message };
}

/** Create or update a record. Validates against the module's generated schema. */
export async function saveRecord(moduleKey: string, id: string | null, values: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireSession();
  const def = getModule(moduleKey);
  if (!def) return fail("Unknown module");

  const parsed = moduleSchema(def).safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const data = parsed.data as Record<string, unknown>;
  // Auto slug from the title field when left blank; the DB trigger keeps it unique.
  const title = String(data[def.slugSource] ?? "");
  if (!data["slug"] || String(data["slug"]).trim() === "") data["slug"] = slugify(title) || null;
  else data["slug"] = slugify(String(data["slug"]));

  const supabase = await createClient();
  let previousSlug: string | null = null;

  if (id) {
    const { data: before } = await supabase.from(def.table).select("slug").eq("id", id).maybeSingle();
    previousSlug = (before as { slug?: string } | null)?.slug ?? null;
    const { data: row, error } = await supabase.from(def.table).update(data as never).eq("id", id).select("id, slug").single();
    if (error) return fail(friendlyDbError(error.message));
    revalidateModule(def, [row.slug, previousSlug]);
    revalidatePath(`/admin/${def.key}`);
    return { ok: true, data: { id: row.id, slug: row.slug }, message: `${def.singular} updated` };
  }

  const { data: row, error } = await supabase.from(def.table).insert(data as never).select("id, slug").single();
  if (error) return fail(friendlyDbError(error.message));
  revalidateModule(def, [row.slug]);
  revalidatePath(`/admin/${def.key}`);
  return { ok: true, data: { id: row.id, slug: row.slug }, message: `${def.singular} created` };
}

export async function deleteRecord(moduleKey: string, id: string): Promise<ActionResult> {
  await requireSession();
  const def = getModule(moduleKey);
  if (!def) return fail("Unknown module");
  const supabase = await createClient();
  const { data: before } = await supabase.from(def.table).select("slug").eq("id", id).maybeSingle();
  const { error } = await supabase.from(def.table).delete().eq("id", id);
  if (error) return fail(friendlyDbError(error.message));
  revalidateModule(def, [(before as { slug?: string } | null)?.slug]);
  revalidatePath(`/admin/${def.key}`);
  return { ok: true, message: `${def.singular} deleted` };
}

/** Flip a boolean column (is_published, is_featured, is_approved, is_popular). */
export async function toggleFlag(moduleKey: string, id: string, column: string, value: boolean): Promise<ActionResult> {
  await requireSession();
  const def = getModule(moduleKey);
  if (!def) return fail("Unknown module");
  const allowed = new Set(["is_published", ...def.toggles.map((t) => t.key)]);
  if (!allowed.has(column)) return fail("Field cannot be toggled");
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from(def.table)
    .update({ [column]: value } as never)
    .eq("id", id)
    .select("slug")
    .single();
  if (error) return fail(friendlyDbError(error.message));
  revalidateModule(def, [(row as { slug?: string }).slug]);
  revalidatePath(`/admin/${def.key}`);
  return { ok: true };
}

/** Persist a new drag-and-drop order. `ids` is the full ordered list of ids. */
export async function reorderRecords(moduleKey: string, ids: string[]): Promise<ActionResult> {
  await requireSession();
  const def = getModule(moduleKey);
  if (!def) return fail("Unknown module");
  if (ids.length > 500) return fail("Too many items to reorder at once");
  const supabase = await createClient();
  const results = await Promise.all(
    ids.map((id, index) => supabase.from(def.table).update({ sort_order: index + 1 } as never).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return fail(friendlyDbError(failed.error.message));
  revalidateModule(def, []);
  revalidatePath(`/admin/${def.key}`);
  return { ok: true, message: "Order saved" };
}

export async function duplicateRecord(moduleKey: string, id: string): Promise<ActionResult<{ id: string }>> {
  await requireSession();
  const def = getModule(moduleKey);
  if (!def) return fail("Unknown module");
  const supabase = await createClient();
  const { data: source, error } = await supabase.from(def.table).select("*").eq("id", id).single();
  if (error || !source) return fail("Record not found");
  const copy = { ...(source as Record<string, unknown>) };
  delete copy["id"];
  delete copy["created_at"];
  delete copy["updated_at"];
  copy["slug"] = `${copy["slug"]}-copy`;
  copy["is_published"] = false;
  if (def.titleField in copy) copy[def.titleField] = `${copy[def.titleField]} (copy)`;
  copy["sort_order"] = 0;
  const { data: row, error: insertError } = await supabase.from(def.table).insert(copy as never).select("id").single();
  if (insertError) return fail(friendlyDbError(insertError.message));
  revalidatePath(`/admin/${def.key}`);
  return { ok: true, data: { id: row.id }, message: "Duplicated as a draft" };
}

function friendlyDbError(message: string): string {
  if (/duplicate key value.*slug/i.test(message)) return "That slug is already in use. Choose another.";
  if (/row-level security/i.test(message)) return "You don't have permission to do that.";
  return message;
}
