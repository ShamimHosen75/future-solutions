"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSession } from "@/lib/admin/auth";
import { serverEnv } from "@/lib/env";
import { absoluteUrl } from "@/lib/utils";
import type { ActionResult } from "./content";

const roleSchema = z.enum(["admin", "editor"]);

export async function updateUserRole(userId: string, role: string): Promise<ActionResult> {
  const session = await requireSession("admin");
  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) return { ok: false, message: "Invalid role" };
  if (userId === session.userId && parsed.data !== "admin") return { ok: false, message: "You cannot remove your own admin role." };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role: parsed.data }).eq("id", userId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/users");
  return { ok: true, message: "Role updated" };
}

export async function setUserActive(userId: string, isActive: boolean): Promise<ActionResult> {
  const session = await requireSession("admin");
  if (userId === session.userId && !isActive) return { ok: false, message: "You cannot deactivate yourself." };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", userId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/users");
  return { ok: true, message: isActive ? "User activated" : "User deactivated" };
}

/** Sends a Supabase invite email. Requires the service-role key on the server. */
export async function inviteUser(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireSession("admin");
  if (!serverEnv().SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, message: "Set SUPABASE_SERVICE_ROLE_KEY to invite users from the dashboard, or invite them from the Supabase Auth console." };
  }
  const schema = z.object({ email: z.string().trim().email(), full_name: z.string().trim().max(120).optional(), role: roleSchema });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: { full_name: parsed.data.full_name ?? null, role: parsed.data.role },
    redirectTo: absoluteUrl("/admin/reset-password"),
  });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/users");
  return { ok: true, message: `Invitation sent to ${parsed.data.email}` };
}

export async function updateOwnProfile(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const session = await requireSession();
  const schema = z.object({ full_name: z.string().trim().max(120) });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Invalid name" };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ full_name: parsed.data.full_name || null }).eq("id", session.userId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Profile updated" };
}
