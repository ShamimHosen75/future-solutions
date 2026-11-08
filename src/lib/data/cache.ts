import { unstable_cache } from "next/cache";

/**
 * Cache tags, one per content table. Server actions call
 * `revalidateTag(tags.services)` after a save so every page that read that
 * table is regenerated.
 */
export const tags = {
  services: "services",
  products: "products",
  projects: "projects",
  pricing_plans: "pricing_plans",
  courses: "courses",
  clients: "clients",
  testimonials: "testimonials",
  team_members: "team_members",
  settings: "settings",
  blog_posts: "blog_posts",
} as const;

export type CacheTag = (typeof tags)[keyof typeof tags];

/** Thin wrapper to keep call sites terse and consistently tagged. */
export function cached<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keyParts: string[],
  tagList: CacheTag[],
  revalidateSeconds = 3600,
) {
  return unstable_cache(fn, keyParts, { tags: tagList, revalidate: revalidateSeconds });
}
