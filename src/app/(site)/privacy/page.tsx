import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/motion/reveal";
import { getSettings } from "@/lib/data/settings";
import { formatDate } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for Future Solutions, software company and IT training institute in Dhaka, Bangladesh.",
  path: "/privacy",
});

export default async function Page() {
  const settings = await getSettings();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }])} />
      <PageHeader eyebrow="Legal" title="Privacy Policy" description={`Last updated ${formatDate(settings.legal.updatedAt)}`} />
      <Container className="pb-24">
        <Reveal className="max-w-3xl">
          <Prose html={settings.legal.privacy} />
        </Reveal>
      </Container>
    </>
  );
}
