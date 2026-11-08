import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { CTA } from "@/components/sections/cta";
import { getPublishedProjects } from "@/lib/data/projects";
import { getPublishedServices } from "@/lib/data/services";
import { getSettings } from "@/lib/data/settings";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description: "Case studies from e-commerce, healthcare, logistics and fashion: websites, apps and software shipped by Future Solutions with measurable results.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const [projects, services, settings] = await Promise.all([getPublishedProjects(), getPublishedServices(), getSettings()]);
  const serviceNames = Object.fromEntries(services.map((s) => [s.id, s.title]));
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }])} />
      <PageHeader eyebrow="Portfolio" title={"Work that shipped,\nresults that stuck."} highlight={["stuck."]} description="A selection of client projects. Every case study lists the challenge, what we built and the numbers that changed." />
      <Container className="pb-8">
        <Reveal>
          <PortfolioGrid projects={projects} serviceNames={serviceNames} />
        </Reveal>
      </Container>
      <CTA whatsapp={settings.contact.whatsapp} />
    </>
  );
}
