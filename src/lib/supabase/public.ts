import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseEnv, requireSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

let publicClient: SupabaseClient<Database> | undefined;

/**
 * Anonymous, cookie-less client for public content. Safe inside
 * `unstable_cache` (no dynamic request APIs) and only ever sees rows that RLS
 * exposes to `anon` (published content).
 */
export function createPublicClient(): SupabaseClient<Database> | null {
  if (!hasSupabaseEnv()) return null;
  if (publicClient) return publicClient;
  const { url, anonKey } = requireSupabaseEnv();
  publicClient = createSupabaseClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return publicClient;
}
