import { createPublicClient } from "@/lib/supabase/public";
import type { Project } from "@/types/content";
import { cached, tags } from "./cache";

async function fetchAll(): Promise<Project[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("[projects] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

async function fetchFeatured(limit: number): Promise<Project[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) {
    console.warn("[projects] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

async function fetchBySlug(slug: string): Promise<Project | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    console.warn("[projects] query failed:", error.message);
    return null;
  }
  return data;
}

export const getProjectBySlug = cached(fetchBySlug, ["projects", "by-slug"], [tags.projects]);

export const getPublishedProjects = cached(fetchAll, ["projects", "published"], [tags.projects]);
export const getFeaturedProjects = cached(fetchFeatured, ["projects", "featured"], [tags.projects]);
