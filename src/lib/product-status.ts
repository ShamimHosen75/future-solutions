import type { Product } from "@/types/content";

export const statusLabel: Record<Product["status"], string> = { live: "Live", beta: "Beta", coming_soon: "Coming soon" };
export const statusTone: Record<Product["status"], "cyan" | "amber" | "neutral"> = { live: "cyan", beta: "amber", coming_soon: "neutral" };
