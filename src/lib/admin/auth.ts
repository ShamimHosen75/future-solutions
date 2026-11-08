import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/content";
import type { UserRole } from "@/types/database";

export type Session = { userId: string; email: string; profile: Profile };

/** Current signed-in dashboard user with their profile row, or null. Cached per request. */
export const getSession = cache(async (): Promise<Session | null> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (!profile || !profile.is_active) return null;
    return { userId: user.id, email: user.email ?? profile.email, profile };
  } catch {
    return null;
  }
});

/** Redirects to login when signed out, or to the overview when the role is insufficient. */
export async function requireSession(role?: UserRole): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (role === "admin" && session.profile.role !== "admin") redirect("/admin?error=forbidden");
  return session;
}

export function canManageContent(role: UserRole) {
  return role === "admin" || role === "editor";
}
