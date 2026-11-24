import type { Metadata } from "next";
import { serviceGroups, servicesByGroup } from "@/content/services";
import { PageHero } from "@/components/page/page-hero";
import { ServiceCard } from "@/components/page/service-card";
import { CtaBand } from "@/components/page/cta-band";
import { Button, Container, Eyebrow, Section } from "@/components/ui/primitives";
import { HowWeWork } from "@/components/sections/how-we-work";
import { ClientProof } from "@/components/sections/client-proof";
import { Faq } from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "Services",
  description: "Website and app design, web and mobile development, e-commerce, custom software, AI automation, SEO and digital marketing.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Design, development and growth under one roof"
        intro="Everything your digital product needs, delivered by one senior team. Pick a single service or combine them into a complete product build."
        crumbs={[{ label: "Services" }]}
      >
        <div data-reveal className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href="/contact" size="lg">
            Book a free call
          </Button>
          <Button href="/pricing" size="lg" variant="outline-dark">
            See pricing
          </Button>
        </div>
      </PageHero>

      <Section tone="light">
        <Container className="space-y-20 sm:space-y-24">
          {serviceGroups.map(({ group, text }, i) => (
            <div key={group} id={group.toLowerCase()} className="scroll-mt-28 grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p data-reveal className="text-sm font-medium tabular-nums text-muted">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <Eyebrow className="mt-3">{group}</Eyebrow>
                <h2 data-reveal className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                  {group === "Design" ? "Design services" : group === "Build" ? "Development services" : "Growth services"}
                </h2>
                <p data-reveal className="mt-4 text-sm leading-relaxed text-muted">
                  {text}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {servicesByGroup(group).map((s) => (
                  <ServiceCard key={s.slug} service={s} />
                ))}
              </div>
            </div>
          ))}
        </Container>
      </Section>

      <HowWeWork />
      <ClientProof />
      <Faq />
      <CtaBand />
    </>
  );
}
