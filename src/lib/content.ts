import type { Json } from "@/types/database";

/** Narrow a jsonb column to a string array safely. */
export function asStringArray(value: Json | unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

/** Narrow a jsonb column to an array of plain objects. */
export function asObjectArray<T extends Record<string, unknown>>(value: Json | unknown): T[] {
  return Array.isArray(value)
    ? value.filter((v): v is T => typeof v === "object" && v !== null && !Array.isArray(v))
    : [];
}

export type Metric = { label: string; value: string };
export type Batch = {
  name: string;
  starts_on: string;
  schedule: string;
  seats: number;
  seats_left: number;
  status: "enrolling" | "upcoming" | "running" | "closed";
};

/** Pick a deterministic gradient for placeholder covers from a string. */
export function placeholderGradient(seed: string): string {
  const palettes = [
    "linear-gradient(135deg,#0A3DFF 0%,#12C8FF 100%)",
    "linear-gradient(135deg,#FF5A0A 0%,#FFA31A 100%)",
    "linear-gradient(135deg,#0A3DFF 0%,#FF5A0A 100%)",
    "linear-gradient(135deg,#12C8FF 0%,#FFA31A 100%)",
    "linear-gradient(135deg,#141927 0%,#0A3DFF 100%)",
  ];
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return palettes[hash % palettes.length] ?? palettes[0]!;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
