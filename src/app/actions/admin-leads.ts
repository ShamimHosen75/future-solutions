"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/admin/auth";
import type { ActionResult } from "./content";

const statusSchema = z.enum(["new", "contacted", "won", "lost"]);

export async function updateLeadStatus(id: string, status: string): Promise<ActionResult> {
  await requireSession("admin");
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, message: "Invalid status" };
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status: parsed.data }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateLeadNotes(id: string, notes: string): Promise<ActionResult> {
  await requireSession("admin");
  const parsed = z.string().max(5000).safeParse(notes);
  if (!parsed.success) return { ok: false, message: "Notes are too long" };
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ notes: parsed.data || null }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/leads");
  return { ok: true, message: "Notes saved" };
}

export async function assignLead(id: string, userId: string | null): Promise<ActionResult> {
  await requireSession("admin");
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ assigned_to: userId }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  await requireSession("admin");
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true, message: "Lead deleted" };
}
