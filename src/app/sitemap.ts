import type { MetadataRoute } from "next";
import { getPublishedServices } from "@/lib/data/services";
import { getPublishedProducts } from "@/lib/data/products";
import { getPublishedProjects } from "@/lib/data/projects";
import { getPublishedCourses } from "@/lib/data/courses";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, products, projects, courses] = await Promise.all([
    getPublishedServices(),
    getPublishedProducts(),
    getPublishedProjects(),
    getPublishedCourses(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/products", priority: 0.8, changeFrequency: "monthly" },
    { path: "/portfolio", priority: 0.8, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/academy", priority: 0.9, changeFrequency: "weekly" },
    { path: "/clients", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/careers", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ].map(({ path, ...rest }) => ({ url: absoluteUrl(path), lastModified: new Date(), ...rest }) as MetadataRoute.Sitemap[number]);

  const dynamic = [
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified: new Date(s.updated_at), priority: 0.8 })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), lastModified: new Date(p.updated_at), priority: 0.7 })),
    ...projects.map((p) => ({ url: absoluteUrl(`/portfolio/${p.slug}`), lastModified: new Date(p.updated_at), priority: 0.6 })),
    ...courses.map((c) => ({ url: absoluteUrl(`/academy/${c.slug}`), lastModified: new Date(c.updated_at), priority: 0.8 })),
  ];

  return [...staticRoutes, ...dynamic];
}
