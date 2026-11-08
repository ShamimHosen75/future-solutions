import { createPublicClient } from "@/lib/supabase/public";
import type { Service } from "@/types/content";
import { cached, tags } from "./cache";

const columns =
  "id, slug, title, short_description, description, icon, cover_image, features, process_steps, deliverables, tech_stack, faqs, starting_price, price_currency, seo_title, seo_description, is_featured, sort_order, is_published, created_at, updated_at";

async function fetchPublishedServices(): Promise<Service[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("services")
    .select(columns)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("[services] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("services")
    .select(columns)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    console.warn("[services] query failed:", error.message);
    return null;
  }
  return data;
}

export const getPublishedServices = cached(fetchPublishedServices, ["services", "published"], [tags.services]);

export const getServiceBySlug = cached(fetchServiceBySlug, ["services", "by-slug"], [tags.services]);

/** Narrow a jsonb column to a string array safely. */
export function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}
