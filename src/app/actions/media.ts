"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/admin/auth";
import type { ActionResult } from "./content";
import type { MediaItem } from "@/types/content";

const registerSchema = z.object({
  path: z.string().min(1),
  url: z.string().url(),
  alt: z.string().max(300).optional().nullable(),
  folder: z.string().max(80).default("uploads"),
  mime_type: z.string().max(100).optional().nullable(),
  size_bytes: z.number().int().nonnegative().optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
});

/** Records an uploaded storage object in the media table (upload itself happens client-side). */
export async function registerMedia(input: z.infer<typeof registerSchema>): Promise<ActionResult<MediaItem>> {
  const session = await requireSession();
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid media payload" };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .upsert({ ...parsed.data, bucket: "media", uploaded_by: session.userId }, { onConflict: "bucket,path" })
    .select("*")
    .single();
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/media");
  return { ok: true, data };
}

export async function updateMediaAlt(id: string, alt: string): Promise<ActionResult> {
  await requireSession();
  const supabase = await createClient();
  const { error } = await supabase.from("media").update({ alt: alt.slice(0, 300) || null }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/media");
  return { ok: true, message: "Alt text saved" };
}

/** Deletes the storage object and its row. */
export async function deleteMedia(id: string): Promise<ActionResult> {
  await requireSession();
  const supabase = await createClient();
  const { data: item } = await supabase.from("media").select("bucket, path").eq("id", id).maybeSingle();
  if (!item) return { ok: false, message: "Media not found" };
  const { error: storageError } = await supabase.storage.from(item.bucket).remove([item.path]);
  if (storageError) return { ok: false, message: storageError.message };
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/media");
  return { ok: true, message: "File deleted" };
}
