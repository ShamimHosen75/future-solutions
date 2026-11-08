import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { CoverImage } from "@/components/ui/cover-image";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { CTA } from "@/components/sections/cta";
import { getPublishedProducts } from "@/lib/data/products";
import { getSettings } from "@/lib/data/settings";
import { asStringArray } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { statusLabel, statusTone } from "@/lib/product-status";

export const metadata: Metadata = pageMetadata({
  title: "Products",
  description: "Ready-made software from Future Solutions: ShopFlow e-commerce, EduHub school management and LeadPilot AI WhatsApp assistant.",
  path: "/products",
});


export default async function ProductsPage() {
  const [products, settings] = await Promise.all([getPublishedProducts(), getSettings()]);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }])} />
      <PageHeader
        eyebrow="Our products"
        title={"Software we build,\nrun and stand behind."}
        highlight={["stand", "behind."]}
        description="Platforms we created for Bangladeshi businesses after seeing the same problems again and again. Launch in days, with local payments and support built in."
      />
      <Container className="pb-8">
        <Reveal as="ul" stagger={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.slug}`} className="group block h-full" data-cursor="View">
                <TiltCard as="article" intensity={4} className="flex h-full flex-col p-2">
                  <CoverImage src={product.cover_image} alt={`${product.name} preview`} title={product.name} className="aspect-[16/10] rounded-[calc(var(--radius-lg)-0.5rem)]" />
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-display text-xl font-semibold text-white">{product.name}</h2>
                      <Badge tone={statusTone[product.status]}>{statusLabel[product.status]}</Badge>
                    </div>
                    {product.tagline ? <p className="text-sm text-muted">{product.tagline}</p> : null}
                    <ul className="flex flex-wrap gap-2">
                      {asStringArray(product.features).slice(0, 3).map((f) => (
                        <li key={f} className="rounded-full border border-border px-2.5 py-0.5 text-[0.7rem] text-silver">
                          {f}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center justify-between pt-3 text-sm">
                      <span className="text-muted">
                        {product.price ? (
                          <>
                            From <span className="tabular text-white"><span className="font-sans">৳</span>{Number(product.price).toLocaleString()}</span>
                            {product.pricing_model === "subscription" ? " / month" : ""}
                          </>
                        ) : (
                          "Contact for pricing"
                        )}
                      </span>
                      <ArrowRight className="size-4 text-muted transition group-hover:translate-x-1 group-hover:text-white" aria-hidden />
                    </span>
                  </div>
                </TiltCard>
              </Link>
            </li>
          ))}
        </Reveal>
        {products.length === 0 ? <p className="text-center text-muted">Products will appear here once published.</p> : null}
      </Container>
      <CTA whatsapp={settings.contact.whatsapp} />
    </>
  );
}
