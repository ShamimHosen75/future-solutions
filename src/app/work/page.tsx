import type { Metadata } from "next";
import { workPage } from "@/content/work";
import { PageHero } from "@/components/page/page-hero";
import { WorkGrid } from "@/components/page/work-grid";
import { CtaBand } from "@/components/page/cta-band";
import { Button, Container, Section } from "@/components/ui/primitives";
import { Partners } from "@/components/sections/partners";
import { ClientProof } from "@/components/sections/client-proof";

export const metadata: Metadata = {
  title: "Our work",
  description: workPage.intro,
};

export default function WorkPage() {
  return (
    <>
      <PageHero eyebrow={workPage.eyebrow} title={workPage.title} intro={workPage.intro} crumbs={[{ label: "Work" }]} />

      <Section tone="light">
        <Container>
          <WorkGrid />

          <div
            data-reveal
            className="mt-20 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] bg-[linear-gradient(135deg,#cdf3ff,#ffe6cc)] p-8 sm:flex-row sm:items-center sm:p-10"
          >
            <div>
              <p className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{workPage.midCta.title}</p>
              <p className="mt-2 max-w-md text-sm text-ink/70">{workPage.midCta.text}</p>
            </div>
            <Button href="/contact" variant="dark" size="lg">
              {workPage.midCta.cta}
            </Button>
          </div>
        </Container>
      </Section>

      <Partners />
      <ClientProof />
      <CtaBand />
    </>
  );
}
