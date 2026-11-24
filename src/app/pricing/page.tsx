import type { Metadata } from "next";
import { pricing } from "@/content/pricing";
import { PageHero } from "@/components/page/page-hero";
import { PricingPlans } from "@/components/page/pricing-plans";
import { CtaBand } from "@/components/page/cta-band";
import { Container, Section, SectionHeading, Stars } from "@/components/ui/primitives";
import { Check } from "@/components/ui/icons";
import { Faq } from "@/components/sections/faq";
import { Partners } from "@/components/sections/partners";

export const metadata: Metadata = {
  title: "Pricing",
  description: pricing.intro,
};

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow={pricing.eyebrow} title={pricing.title} intro={pricing.intro} crumbs={[{ label: "Pricing" }]}>
        <p data-reveal className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-orange-400 opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-orange-500" />
          </span>
          {pricing.badge}
        </p>
        <ul data-reveal className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/75">
          {pricing.trust.map((t, i) => (
            <li key={t} className="flex items-center gap-2">
              {i === 0 ? <Stars /> : <Check className="size-4 text-orange-400" strokeWidth={2.5} />}
              {t}
            </li>
          ))}
        </ul>
      </PageHero>

      <Section tone="light">
        <Container>
          <PricingPlans />
        </Container>
      </Section>

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Everything included" title="No extras, no surprises" intro="Every plan and project comes with the essentials below as standard." align="center" />
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {pricing.included.map((item) => (
              <li key={item} data-reveal className="flex items-center gap-3 border-b border-line pb-4 text-[15px]">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-orange">
                  <Check className="size-3.5 text-white" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <div className="bg-paper pt-16">
        <Partners />
      </div>
      <Faq eyebrow="Pricing FAQs" title="Questions about pricing" items={pricing.faqs} />
      <CtaBand title="Not sure which option fits?" text="Book a free call. We will recommend the most cost-effective way to reach your goals." />
    </>
  );
}
