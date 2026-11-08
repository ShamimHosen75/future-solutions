import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Prose } from "@/components/ui/prose";
import { GlassCard } from "@/components/ui/glass-card";
import { CoverImage } from "@/components/ui/cover-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { getProductBySlug, getPublishedProducts } from "@/lib/data/products";
import { getPublishedServices } from "@/lib/data/services";
import { asStringArray } from "@/lib/content";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { statusLabel, statusTone } from "@/lib/product-status";

type Params = { slug: string };
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return pageMetadata({
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? product.tagline ?? `${product.name} by ${site.name}`,
    path: `/products/${product.slug}`,
    image: product.cover_image,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [product, services] = await Promise.all([getProductBySlug(slug), getPublishedServices()]);
  if (!product) notFound();

  const features = asStringArray(product.features);
  const stack = asStringArray(product.tech_stack);
  const gallery = asStringArray(product.gallery);
  const links = [
    product.demo_url && { label: "Live demo", href: product.demo_url },
    product.website_url && { label: "Website", href: product.website_url },
    product.app_store_url && { label: "App Store", href: product.app_store_url },
    product.play_store_url && { label: "Google Play", href: product.play_store_url },
  ].filter((l): l is { label: string; href: string } => Boolean(l));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.tagline ?? product.seo_description ?? undefined,
    url: absoluteUrl(`/products/${product.slug}`),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    author: { "@id": `${site.url}/#organization` },
    ...(product.price ? { offers: { "@type": "Offer", price: Number(product.price), priceCurrency: product.price_currency } } : {}),
  };

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, { name: product.name, path: `/products/${product.slug}` }])]} />
      <PageHeader eyebrow="Product" title={product.name} description={product.tagline ?? undefined}>
        <div className="flex flex-wrap items-center gap-4">
          <Badge tone={statusTone[product.status]}>{statusLabel[product.status]}</Badge>
          {product.price ? (
            <span className="text-sm text-muted">
              From <span className="tabular text-white"><span className="font-sans">৳</span>{Number(product.price).toLocaleString()}</span>
              {product.pricing_model === "subscription" ? " / month" : ""}
            </span>
          ) : null}
          <Button href="#demo" size="md">
            Request a demo <ArrowRight className="size-4" aria-hidden />
          </Button>
          {links.map((l) => (
            <Button key={l.href} href={l.href} variant="ghost" size="sm">
              {l.label} <ExternalLink className="size-3.5" aria-hidden />
            </Button>
          ))}
        </div>
      </PageHeader>

      <Container className="grid gap-12 py-8 lg:grid-cols-12">
        <div className="flex flex-col gap-12 lg:col-span-8">
          <Reveal>
            <CoverImage src={product.cover_image} alt={`${product.name} screenshot`} title={product.name} className="aspect-[16/9] rounded-[var(--radius-lg)]" sizes="(min-width:1024px) 66vw, 100vw" priority />
          </Reveal>
          <Reveal>
            <Prose html={product.description} />
          </Reveal>
          {gallery.length > 0 ? (
            <Reveal as="ul" stagger={0.08} className="grid gap-4 sm:grid-cols-2">
              {gallery.map((src, i) => (
                <li key={src}>
                  <CoverImage src={src} alt={`${product.name} screenshot ${i + 1}`} title={product.name} className="aspect-[16/10] rounded-[var(--radius-md)]" />
                </li>
              ))}
            </Reveal>
          ) : null}
        </div>
        <aside className="lg:col-span-4">
          <Reveal>
            <GlassCard className="lg:sticky lg:top-24">
              {features.length > 0 ? (
                <>
                  <h2 className="label">Key features</h2>
                  <ul className="mt-4 flex flex-col gap-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-silver">
                        <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {stack.length > 0 ? (
                <>
                  <h2 className="label mt-8">Built with</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {stack.map((t) => (
                      <li key={t} className="rounded-full border border-border px-3 py-1 text-xs text-silver">{t}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </GlassCard>
          </Reveal>
        </aside>
      </Container>

      <section id="demo" className="py-24" aria-labelledby="demo-heading">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Request a demo" title={<span id="demo-heading">See {product.name} with your own data.</span>} description="We'll walk you through the product, answer questions and set up a trial if it's a fit." />
          </div>
          <div className="lg:col-span-7">
            <GlassCard>
              <ContactForm services={services.map((s) => ({ id: s.id, title: s.title }))} intent="quote" />
            </GlassCard>
          </div>
        </Container>
      </section>
    </>
  );
}
