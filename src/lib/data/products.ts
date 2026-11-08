import { createPublicClient } from "@/lib/supabase/public";
import type { Product } from "@/types/content";
import { cached, tags } from "./cache";

async function fetchAll(): Promise<Product[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("[products] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

async function fetchFeatured(limit: number): Promise<Product[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) {
    console.warn("[products] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

async function fetchBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    console.warn("[products] query failed:", error.message);
    return null;
  }
  return data;
}

export const getProductBySlug = cached(fetchBySlug, ["products", "by-slug"], [tags.products]);

export const getPublishedProducts = cached(fetchAll, ["products", "published"], [tags.products]);
export const getFeaturedProducts = cached(fetchFeatured, ["products", "featured"], [tags.products]);
