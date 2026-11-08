"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/admin/auth";
import { revalidateSettings } from "@/lib/admin/revalidate";
import { defaultSettings } from "@/lib/data/settings";
import type { SettingsKey } from "@/types/content";
import type { Json } from "@/types/database";
import type { ActionResult } from "./content";

const text = z.string().trim();
const optionalUrl = text.url().or(z.literal(""));

const sectionSchemas: Record<SettingsKey, z.ZodTypeAny> = {
  contact: z.object({
    email: text.email(),
    phone: text.min(5),
    whatsapp: text.min(8),
    address: text.min(5),
    mapQuery: text,
    mapEmbedUrl: optionalUrl,
  }),
  socials: z.object({ facebook: optionalUrl, linkedin: optionalUrl, instagram: optionalUrl, youtube: optionalUrl, github: optionalUrl }),
  seo: z.object({
    title: text.min(3).max(90),
    titleTemplate: text.includes("%s", { message: "Must contain %s" }),
    description: text.min(20).max(300),
    keywords: z.array(text.min(1)).max(30),
    ogImage: text,
  }),
  homepage: z.object({
    heroEyebrow: text.max(120),
    heroTitle: text.max(120),
    heroSubtitle: text.max(400),
    stats: z.array(z.object({ label: text.min(1), value: z.coerce.number(), suffix: text.max(4) })).max(6),
  }),
  announcement: z.object({ enabled: z.coerce.boolean(), text: text.max(200), href: text.max(300) }),
  about: z.object({
    intro: text.max(600),
    story: text.max(20000),
    mission: text.max(400),
    vision: text.max(400),
    values: z.array(z.object({ title: text.min(1), description: text })).max(8),
    milestones: z.array(z.object({ year: text.min(2), title: text.min(1) })).max(20),
  }),
  careers: z.object({
    intro: text.max(600),
    perks: z.array(text.min(1)).max(12),
    openings: z.array(z.object({ title: text.min(1), type: text, location: text, description: text })).max(20),
  }),
  legal: z.object({ privacy: text.max(50000), terms: text.max(50000), updatedAt: text }),
  pricing: z.object({ intro: text.max(600), comparisonNote: text.max(300), faqs: z.array(z.object({ q: text.min(1), a: text.min(1) })).max(20) }),
};

export async function saveSettings(key: SettingsKey, value: unknown): Promise<ActionResult> {
  const session = await requireSession("admin");
  const schema = sectionSchemas[key];
  if (!schema || !(key in defaultSettings)) return { ok: false, message: "Unknown settings section" };
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) (fieldErrors[String(issue.path[0] ?? "form")] ??= []).push(issue.message);
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value: parsed.data as Json, updated_by: session.userId }, { onConflict: "key" });
  if (error) return { ok: false, message: error.message };
  revalidateSettings();
  return { ok: true, message: "Settings saved" };
}
