import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { asStringArray } from "@/lib/content";
import type { Product } from "@/types/content";
import { statusLabel } from "@/lib/product-status";


export function ProductsStrip({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="relative py-24 md:py-32" aria-labelledby="products-heading">
      <div aria-hidden className="absolute inset-0 -z-10 bg-surface/40 [mask-image:linear-gradient(to_bottom,transparent,#000_15%,#000_85%,transparent)]" />
      <Container>
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Our products"
            title={
              <span id="products-heading">
                Software we <span className="text-gradient">build and run.</span>
              </span>
            }
            description="Ready-made platforms for Bangladeshi businesses — launch in days, not months."
          />
          <Button href="/products" variant="outline" className="shrink-0">
            All products
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </Reveal>

        <Reveal as="ul" stagger={0.1} className="mt-14 grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.slug}`} className="group block h-full">
                <TiltCard as="article" className="flex h-full flex-col gap-5 p-6 md:p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-semibold text-white">{product.name}</span>
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-[0.65rem] tracking-wider text-muted uppercase">
                      {statusLabel[product.status]}
                    </span>
                  </div>
                  {product.tagline ? <p className="text-sm text-muted">{product.tagline}</p> : null}
                  <ul className="flex flex-col gap-2 text-sm text-silver">
                    {asStringArray(product.features)
                      .slice(0, 3)
                      .map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-brand-gradient" />
                          {f}
                        </li>
                      ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-silver group-hover:text-white">
                    {product.price ? (
                      <>
                        From <span className="tabular text-white"><span className="font-sans">৳</span>{Number(product.price).toLocaleString()}</span>
                        <span className="text-muted">/ month</span>
                      </>
                    ) : (
                      "Learn more"
                    )}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </TiltCard>
              </Link>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
