import { createPublicClient } from "@/lib/supabase/public";
import type { Testimonial } from "@/types/content";
import { cached, tags } from "./cache";

async function fetchAll(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("[testimonials] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

async function fetchFeatured(limit: number): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) {
    console.warn("[testimonials] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

export const getApprovedTestimonials = cached(fetchAll, ["testimonials", "published"], [tags.testimonials]);
export const getFeaturedTestimonials = cached(fetchFeatured, ["testimonials", "featured"], [tags.testimonials]);
