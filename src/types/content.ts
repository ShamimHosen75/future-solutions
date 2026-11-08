import type { Tables } from "@/types/database";

export type Service = Tables<"services">;
export type Product = Tables<"products">;
export type Project = Tables<"projects">;
export type PricingPlan = Tables<"pricing_plans">;
export type Course = Tables<"courses">;
export type Client = Tables<"clients">;
export type Testimonial = Tables<"testimonials">;
export type TeamMember = Tables<"team_members">;
export type Lead = Tables<"leads">;
export type MediaItem = Tables<"media">;
export type Setting = Tables<"settings">;
export type BlogPost = Tables<"blog_posts">;
export type Profile = Tables<"profiles">;

/** Shape of the `settings` table once flattened by key. */
export type SiteSettings = {
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    mapQuery: string;
    mapEmbedUrl: string;
  };
  socials: {
    facebook: string;
    linkedin: string;
    instagram: string;
    youtube: string;
    github: string;
  };
  seo: {
    title: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  homepage: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    stats: { label: string; value: number; suffix: string }[];
  };
  announcement: {
    enabled: boolean;
    text: string;
    href: string;
  };
};

export type SettingsKey = keyof SiteSettings;
