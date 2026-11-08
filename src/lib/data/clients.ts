import { createPublicClient } from "@/lib/supabase/public";
import type { Client } from "@/types/content";
import type { ClientType } from "@/types/database";
import { cached, tags } from "./cache";

async function fetchClients(type?: ClientType): Promise<Client[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  let query = supabase.from("clients").select("*").eq("is_published", true).order("sort_order", { ascending: true });
  if (type) query = query.eq("type", type);
  const { data, error } = await query;
  if (error) {
    console.warn("[clients] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

export const getPublishedClients = cached(fetchClients, ["clients", "published"], [tags.clients]);
