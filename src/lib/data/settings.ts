import { createPublicClient } from "@/lib/supabase/public";
import { site } from "@/lib/site";
import type { SiteSettings, SettingsKey } from "@/types/content";
import { cached, tags } from "./cache";

export const defaultSettings: SiteSettings = {
  contact: {
    email: site.contact.email,
    phone: site.contact.phone,
    whatsapp: site.contact.whatsapp,
    address: site.contact.address,
    mapQuery: site.contact.mapQuery,
    mapEmbedUrl: "",
  },
  socials: { ...site.socials },
  seo: {
    title: `${site.name} — ${site.tagline}`,
    titleTemplate: `%s · ${site.name}`,
    description: site.description,
    keywords: [
      "software company Dhaka",
      "web development Bangladesh",
      "e-commerce development",
      "mobile app development",
      "custom software",
      "AI automation",
      "digital marketing SEO",
      "IT training institute Uttara",
    ],
    ogImage: "/opengraph-image",
  },
  homepage: {
    heroEyebrow: "Software company & IT training institute · Dhaka",
    heroTitle: "Smart Solutions. Lasting Impact.",
    heroSubtitle:
      "We design, build and scale digital products — from high-converting websites and e-commerce to mobile apps, custom software and AI automation.",
    stats: [
      { label: "Projects delivered", value: 120, suffix: "+" },
      { label: "Happy clients", value: 80, suffix: "+" },
      { label: "Students trained", value: 500, suffix: "+" },
      { label: "Years of experience", value: 6, suffix: "" },
    ],
  },
  announcement: { enabled: false, text: "", href: "" },
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Shallow-merge a stored JSON value over its default section. */
function mergeSection<K extends SettingsKey>(key: K, value: unknown): SiteSettings[K] {
  const base = defaultSettings[key];
  if (!isRecord(value)) return base;
  return { ...base, ...(value as Partial<SiteSettings[K]>) };
}

async function fetchSettings(): Promise<SiteSettings> {
  const supabase = createPublicClient();
  if (!supabase) return defaultSettings;

  const { data, error } = await supabase.from("settings").select("key, value");
  if (error || !data) {
    console.warn("[settings] falling back to defaults:", error?.message);
    return defaultSettings;
  }

  const merged = { ...defaultSettings };
  for (const row of data) {
    const key = row.key as SettingsKey;
    if (key in defaultSettings) {
      (merged as Record<string, unknown>)[key] = mergeSection(key, row.value);
    }
  }
  return merged;
}

export const getSettings = cached(fetchSettings, ["settings"], [tags.settings]);
