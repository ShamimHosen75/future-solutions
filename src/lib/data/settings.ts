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
  about: {
    intro:
      "Future Solutions is a Dhaka-based software company and IT training institute. We build digital products for businesses and teach the engineers who build the next ones.",
    story:
      "<p>We started in Uttara with a simple belief: Bangladeshi businesses deserve software that is as well-crafted as anything built abroad, and local talent deserves a place to learn by shipping real work.</p><p>Today the same team that delivers client projects runs our academy, so every lesson is grounded in production experience and every project benefits from fresh perspectives.</p>",
    mission: "Deliver smart, durable software that creates lasting impact for the people who use it.",
    vision: "A Bangladesh where every ambitious business and every curious learner has access to world-class technology.",
    values: [
      { title: "Craft over shortcuts", description: "We build things properly the first time: accessible, fast and maintainable." },
      { title: "Radical clarity", description: "Plain-language proposals, honest timelines and weekly demos. No surprises." },
      { title: "Teach as we build", description: "Every project feeds the classroom and every student feeds the team." },
      { title: "Lasting impact", description: "We measure success by what still works and still matters a year later." },
    ],
    milestones: [
      { year: "2019", title: "Founded in Uttara as a two-person web studio" },
      { year: "2021", title: "Launched the IT training institute with the first full-stack batch" },
      { year: "2023", title: "Shipped our first SaaS product, ShopFlow" },
      { year: "2025", title: "100+ projects delivered, 500+ students trained" },
    ],
  },
  careers: {
    intro:
      "We are a small, senior team that cares about craft. If you want to ship products used by real people and help teach the next generation, we would love to hear from you.",
    perks: [
      "Hybrid work from our Uttara studio",
      "Learning budget and paid certifications",
      "Teach in the academy (optional, paid)",
      "Modern stack: Next.js, TypeScript, Supabase, AI tooling",
      "Festival bonuses and flexible hours",
    ],
    openings: [
      {
        title: "Full-Stack Engineer (Next.js)",
        type: "Full-time",
        location: "Uttara, Dhaka · Hybrid",
        description: "Build client products and our own SaaS with Next.js, TypeScript and Supabase. 2+ years of production React experience.",
      },
      {
        title: "UI/UX Designer",
        type: "Full-time",
        location: "Uttara, Dhaka · Hybrid",
        description: "Own design from research to high-fidelity UI and motion. Strong Figma skills and a portfolio of shipped work.",
      },
      {
        title: "Digital Marketing Executive",
        type: "Full-time",
        location: "Remote (Bangladesh)",
        description: "Run SEO and paid campaigns for our clients with rigorous tracking. Google Ads and GA4 certification preferred.",
      },
    ],
  },
  legal: {
    privacy:
      "<h2>Information we collect</h2><p>When you contact us, request a quote, enroll in a course or leave a review, we collect the details you provide: name, email, phone, company and your message. We also collect anonymised analytics about how our site is used.</p><h2>How we use it</h2><p>We use your information to respond to your request, deliver our services and improve our website. We never sell your data.</p><h2>Storage and security</h2><p>Data is stored securely with our infrastructure providers (Supabase, Vercel, Resend) and protected by row-level security and encryption in transit.</p><h2>Your rights</h2><p>You can ask us to access, correct or delete your personal data at any time by emailing hello@futuresolution.online.</p>",
    terms:
      "<h2>Services</h2><p>Project scope, timelines and fees are defined in a written proposal. Work begins once the proposal is signed and the initial payment is received.</p><h2>Payments</h2><p>Unless otherwise agreed, projects are billed 50% upfront and 50% on delivery. Subscriptions and courses are billed in advance.</p><h2>Intellectual property</h2><p>On full payment, you own the deliverables created for your project. We retain the right to showcase the work in our portfolio unless agreed otherwise.</p><h2>Courses</h2><p>Course fees are refundable up to 7 days before the batch starts. Seats are confirmed on payment.</p><h2>Liability</h2><p>Our liability is limited to the fees paid for the specific service in question.</p>",
    updatedAt: "2026-01-01",
  },
  pricing: {
    intro:
      "Transparent packages for websites and growth, plus custom quotes for e-commerce, apps and software. Prices in Bangladeshi Taka, exclusive of VAT.",
    comparisonNote: "Every plan includes a kickoff workshop, weekly progress demos and a handover session.",
    faqs: [
      { q: "Which plan is right for me?", a: "Starter suits new businesses that need a professional presence quickly. Business is our most popular choice for companies that want to generate leads and rank on Google. Enterprise is for e-commerce, apps and custom software." },
      { q: "What does the monthly price include?", a: "Monthly plans spread the project cost over 12 months and include hosting, maintenance, security updates and small content changes." },
      { q: "Do you offer payment plans?", a: "Yes. One-time projects are split 50/50, and we can arrange milestone-based payments for larger engagements." },
      { q: "Can I upgrade later?", a: "Absolutely. Everything we build is designed to grow; you only pay the difference when you move up." },
      { q: "Is there a contract?", a: "Monthly plans run for 12 months. Growth Marketing is month-to-month after an initial 3 months." },
    ],
  },
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

const getCachedSettings = cached(fetchSettings, ["settings", "v2"], [tags.settings]);

/**
 * Always layer the (possibly stale-cached) stored settings over current
 * defaults so a newly added section can never be undefined at render time.
 */
export async function getSettings(): Promise<SiteSettings> {
  const stored = await getCachedSettings();
  const merged = { ...defaultSettings };
  for (const key of Object.keys(defaultSettings) as SettingsKey[]) {
    (merged as Record<string, unknown>)[key] = mergeSection(key, stored[key]);
  }
  return merged;
}
