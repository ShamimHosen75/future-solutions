import { createPublicClient } from "@/lib/supabase/public";
import type { TeamMember } from "@/types/content";
import { cached, tags } from "./cache";

async function fetchTeam(): Promise<TeamMember[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("[team_members] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

export const getPublishedTeam = cached(fetchTeam, ["team_members", "published"], [tags.team_members]);
