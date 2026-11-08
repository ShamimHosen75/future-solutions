import { createPublicClient } from "@/lib/supabase/public";
import type { Course } from "@/types/content";
import { cached, tags } from "./cache";

async function fetchAll(): Promise<Course[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("[courses] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

async function fetchFeatured(limit: number): Promise<Course[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) {
    console.warn("[courses] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

async function fetchBySlug(slug: string): Promise<Course | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    console.warn("[courses] query failed:", error.message);
    return null;
  }
  return data;
}

export const getCourseBySlug = cached(fetchBySlug, ["courses", "by-slug"], [tags.courses]);

export const getPublishedCourses = cached(fetchAll, ["courses", "published"], [tags.courses]);
export const getFeaturedCourses = cached(fetchFeatured, ["courses", "featured"], [tags.courses]);
