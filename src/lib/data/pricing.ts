import { createPublicClient } from "@/lib/supabase/public";
import type { PricingPlan } from "@/types/content";
import { cached, tags } from "./cache";

async function fetchPlans(): Promise<PricingPlan[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.warn("[pricing_plans] query failed:", error.message);
    return [];
  }
  return data ?? [];
}

export const getPublishedPlans = cached(fetchPlans, ["pricing_plans", "published"], [tags.pricing_plans]);
