import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/motion/reveal";
import { getSettings } from "@/lib/data/settings";
import { formatDate } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms of Service for Future Solutions, software company and IT training institute in Dhaka, Bangladesh.",
  path: "/terms",
});

export default async function Page() {
  const settings = await getSettings();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }])} />
      <PageHeader eyebrow="Legal" title="Terms of Service" description={`Last updated ${formatDate(settings.legal.updatedAt)}`} />
      <Container className="pb-24">
        <Reveal className="max-w-3xl">
          <Prose html={settings.legal.terms} />
        </Reveal>
      </Container>
    </>
  );
}
