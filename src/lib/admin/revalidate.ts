import { revalidatePath, revalidateTag } from "next/cache";
import type { ModuleDef } from "./modules";

/** Invalidate the cache tag for a table and the public paths that render it. */
export function revalidateModule(def: ModuleDef, slugs: Array<string | null | undefined>) {
  revalidateTag(def.tag);
  const paths = new Set<string>();
  for (const slug of slugs) for (const p of def.publicPaths(slug ?? "")) paths.add(p);
  for (const p of paths) {
    if (!p.endsWith("/") || p === "/") revalidatePath(p);
  }
  revalidatePath("/sitemap.xml");
}

export function revalidateSettings() {
  revalidateTag("settings");
  revalidatePath("/", "layout");
}
