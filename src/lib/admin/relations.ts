import { createClient } from "@/lib/supabase/server";
import type { ModuleDef, Option } from "./modules";

/** Loads label/value pairs for every relation field of a module. */
export async function loadRelationOptions(def: ModuleDef): Promise<Record<string, Option[]>> {
  const relations = def.fields.filter((f) => f.type === "relation" && f.relation);
  if (relations.length === 0) return {};
  const supabase = await createClient();
  const entries = await Promise.all(
    relations.map(async (f) => {
      const { table, labelColumn } = f.relation!;
      const { data } = await supabase.from(table).select(`id, ${labelColumn}`).order(labelColumn, { ascending: true }).limit(500);
      const options: Option[] = ((data ?? []) as unknown as Record<string, string>[]).map((r) => ({ value: r["id"]!, label: r[labelColumn] ?? r["id"]! }));
      return [f.name, options] as const;
    }),
  );
  return Object.fromEntries(entries);
}
