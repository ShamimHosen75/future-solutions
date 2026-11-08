import type { Metadata } from "next";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
};

/** Builds consistent metadata (canonical, Open Graph, Twitter) for a public page. */
export function pageMetadata({ title, description, path, image, type = "website", noIndex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl("/opengraph-image");
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

type JsonLdValue = Record<string, unknown>;

/** Renders one or more schema.org objects as JSON-LD. */
export function JsonLd({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // JSON-LD is data, not HTML; escape "<" to prevent breaking out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationJsonLd(input: { description: string; phone: string; email: string; address: string; socials: Record<string, string> }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/brand/logo-mark.svg"),
    description: input.description,
    slogan: site.tagline,
    email: input.email,
    telephone: input.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Road 13, Sector 13, Uttara",
      addressLocality: "Dhaka",
      postalCode: "1230",
      addressCountry: "BD",
    },
    sameAs: Object.values(input.socials).filter(Boolean),
    contactPoint: [
      { "@type": "ContactPoint", contactType: "sales", telephone: input.phone, email: input.email, availableLanguage: ["en", "bn"] },
    ],
  };
}

export function websiteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    description,
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
