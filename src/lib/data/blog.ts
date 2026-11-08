import { createPublicClient } from "@/lib/supabase/public";
import type { BlogPost } from "@/types/content";
import { cached, tags } from "./cache";

async function fetchPosts(): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("[blog_posts] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (error) {
    console.warn("[blog_posts] query failed:", error.message);
    return null;
  }
  return data;
}

export const getPublishedPosts = cached(fetchPosts, ["blog_posts", "published"], [tags.blog_posts]);
export const getPostBySlug = cached(fetchPostBySlug, ["blog_posts", "by-slug"], [tags.blog_posts]);
