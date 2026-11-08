import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Faq } from "@/components/ui/faq";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { PricingTable } from "@/components/sections/pricing-table";
import { CTA } from "@/components/sections/cta";
import { getPublishedPlans } from "@/lib/data/pricing";
import { getSettings } from "@/lib/data/settings";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description: "Transparent website and marketing packages in Bangladeshi Taka, with monthly, yearly and one-time options. Custom quotes for e-commerce, apps and software.",
  path: "/pricing",
});

export default async function PricingPage() {
  const [plans, settings] = await Promise.all([getPublishedPlans(), getSettings()]);
  const { pricing } = settings;
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }]), ...(pricing.faqs.length ? [faqJsonLd(pricing.faqs)] : [])]} />
      <PageHeader eyebrow="Pricing" title={"Clear prices.\nNo surprises."} highlight={["No", "surprises."]} description={pricing.intro} align="center" />
      <Container className="pb-8">
        <Reveal>
          <PricingTable plans={plans} comparisonNote={pricing.comparisonNote} />
        </Reveal>
        {pricing.faqs.length > 0 ? (
          <Reveal className="mx-auto mt-24 max-w-3xl">
            <SectionHeading eyebrow="FAQ" title="Questions about pricing." align="center" />
            <Faq items={pricing.faqs} className="mt-10" />
          </Reveal>
        ) : null}
      </Container>
      <CTA whatsapp={settings.contact.whatsapp} />
    </>
  );
}
