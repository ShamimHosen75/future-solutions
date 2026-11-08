import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/service-icon";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { CTA } from "@/components/sections/cta";
import { getPublishedServices } from "@/lib/data/services";
import { getSettings } from "@/lib/data/settings";
import { asStringArray } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Website design & development, e-commerce, mobile apps, custom software, digital marketing & SEO and AI automation — delivered by one team in Dhaka.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getPublishedServices(), getSettings()]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <PageHeader
        eyebrow="Services"
        title={"Everything you need\nto build and grow."}
        highlight={["grow."]}
        description="Six disciplines under one roof, so strategy, design, engineering and marketing pull in the same direction."
      />
      <Container className="pb-8">
        <Reveal as="ul" stagger={0.08} className="grid gap-5 md:grid-cols-2">
          {services.map((service, i) => {
            const features = asStringArray(service.features).slice(0, 5);
            return (
              <li key={service.id}>
                <Link href={`/services/${service.slug}`} className="group block h-full" data-cursor="View">
                  <TiltCard as="article" intensity={4} className="flex h-full flex-col gap-6 p-7 md:p-9">
                    <div className="flex items-start justify-between">
                      <span className="flex size-14 items-center justify-center rounded-2xl bg-white/[0.04] text-cyan ring-1 ring-border">
                        <ServiceIcon name={service.icon} className="size-6" />
                      </span>
                      <span className="tabular text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-white">{service.title}</h2>
                      <p className="mt-3 leading-relaxed text-muted">{service.short_description}</p>
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-silver">
                          <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-brand-gradient" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
                      <span className="text-sm text-muted">
                        {service.starting_price ? (
                          <>
                            From{" "}
                            <span className="tabular text-white">
                              <span className="font-sans">৳</span>
                              {Number(service.starting_price).toLocaleString()}
                            </span>
                          </>
                        ) : (
                          "Custom quote"
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-silver group-hover:text-white">
                        Details
                        <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                      </span>
                    </div>
                  </TiltCard>
                </Link>
              </li>
            );
          })}
        </Reveal>
        {services.length === 0 ? (
          <p className="text-center text-muted">Services will appear here once published from the dashboard.</p>
        ) : null}
        <Reveal className="mt-16 text-center">
          <p className="text-muted">Not sure which service fits? Tell us the problem and we&apos;ll recommend the path.</p>
          <Button href="/contact" variant="outline" className="mt-5">
            Talk to us
          </Button>
        </Reveal>
      </Container>
      <CTA whatsapp={settings.contact.whatsapp} />
    </>
  );
}
