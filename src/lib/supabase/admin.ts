import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseEnv, serverEnv } from "@/lib/env";
import type { Database } from "@/types/database";

let adminClient: SupabaseClient<Database> | undefined;

/**
 * Service-role client. Bypasses RLS — server only, used for analytics
 * inserts, user management and revalidation hooks. Never import from the
 * browser; `serverEnv()` throws if that happens.
 */
export function createAdminClient(): SupabaseClient<Database> {
  if (adminClient) return adminClient;
  const { url } = requireSupabaseEnv();
  const { SUPABASE_SERVICE_ROLE_KEY } = serverEnv();
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
  }
  adminClient = createSupabaseClient<Database>(url, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return adminClient;
}
