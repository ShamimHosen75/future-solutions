"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";
import { rateLimit } from "@/lib/security/rate-limit";
import { requestFingerprint } from "@/lib/security/request";
import { absoluteUrl } from "@/lib/utils";

export type AuthState = { status: "idle" | "error" | "success"; message?: string; email?: string };

const credentials = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  next: z.string().optional(),
});

function safeNext(value: string | undefined): string {
  return value && value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin";
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasSupabaseEnv()) return { status: "error", message: "Supabase is not configured. Add the project keys to .env.local." };
  const fp = await requestFingerprint();
  const limited = rateLimit(`login:${fp.ipHash}`, 10, 15 * 60 * 1000);
  if (!limited.ok) return { status: "error", message: "Too many attempts. Please wait a few minutes and try again." };

  const email = String(formData.get("email") ?? "");
  const parsed = credentials.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input", email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  // React resets the form after an action; echo the email back so the user only retypes the password.
  if (error) return { status: "error", message: "Incorrect email or password.", email };

  // Users without an active profile are signed out immediately.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("is_active").eq("id", user.id).maybeSingle();
    if (profile && !profile.is_active) {
      await supabase.auth.signOut();
      return { status: "error", message: "This account has been deactivated. Contact an administrator.", email };
    }
  }
  redirect(safeNext(parsed.data.next));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function requestPasswordReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasSupabaseEnv()) return { status: "error", message: "Supabase is not configured." };
  const fp = await requestFingerprint();
  if (!rateLimit(`reset:${fp.ipHash}`, 5, 15 * 60 * 1000).ok) return { status: "error", message: "Too many requests. Try again later." };
  const email = z.string().trim().email().safeParse(formData.get("email"));
  if (!email.success) return { status: "error", message: "Enter a valid email." };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: absoluteUrl("/admin/reset-password") });
  // Always succeed to avoid leaking which emails exist.
  return { status: "success", message: "If that email belongs to an account, a reset link is on its way." };
}

export async function updatePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const schema = z
    .object({ password: z.string().min(8, "At least 8 characters"), confirm: z.string() })
    .refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input" };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { status: "error", message: error.message };
  redirect("/admin?notice=password-updated");
}
