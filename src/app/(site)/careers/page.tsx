import type { Metadata } from "next";
import { Briefcase, Check, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { CareerForm } from "@/components/forms/career-form";
import { getSettings } from "@/lib/data/settings";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description: "Join Future Solutions in Uttara, Dhaka. Open roles for engineers, designers and marketers who want to ship real products and teach.",
  path: "/careers",
});

type SearchParams = Promise<{ role?: string }>;

export default async function CareersPage({ searchParams }: { searchParams: SearchParams }) {
  const [{ role }, settings] = await Promise.all([searchParams, getSettings()]);
  const { careers } = settings;
  const positions = careers.openings.map((o) => o.title);

  const jobsJsonLd = careers.openings.map((o) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: o.title,
    description: o.description,
    employmentType: o.type.toUpperCase().replace("-", "_"),
    hiringOrganization: { "@id": `${site.url}/#organization` },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" } },
    directApply: true,
  }));

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }]), ...jobsJsonLd]} />
      <PageHeader eyebrow="Careers" title={"Do the best work\nof your career."} highlight={["best", "work"]} description={careers.intro}>
        <Button href="#apply">Apply now</Button>
      </PageHeader>

      <Container className="flex flex-col gap-24 pb-8">
        <section aria-labelledby="openings-heading">
          <Reveal><SectionHeading eyebrow="Open roles" title={<span id="openings-heading">{careers.openings.length ? `${careers.openings.length} open position${careers.openings.length > 1 ? "s" : ""}.` : "No open roles right now."}</span>} description={careers.openings.length ? undefined : "We still read every open application and keep great people on file."} /></Reveal>
          <Reveal as="ul" stagger={0.08} className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {careers.openings.map((o) => (
              <li key={o.title}>
                <TiltCard as="article" intensity={4} className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center gap-2"><Badge tone="cyan"><Briefcase className="size-3" aria-hidden /> {o.type}</Badge></div>
                  <h3 className="font-display text-lg font-semibold text-white">{o.title}</h3>
                  <p className="flex items-center gap-1.5 text-xs text-muted"><MapPin className="size-3.5" aria-hidden /> {o.location}</p>
                  <p className="text-sm leading-relaxed text-muted">{o.description}</p>
                  <Button href={`/careers?role=${encodeURIComponent(o.title)}#apply`} variant="outline" size="sm" className="mt-auto w-fit" data-no-transition>Apply for this role</Button>
                </TiltCard>
              </li>
            ))}
          </Reveal>
        </section>

        {careers.perks.length > 0 ? (
          <section aria-labelledby="perks-heading" className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5"><Reveal><SectionHeading eyebrow="Why join" title={<span id="perks-heading">What you get.</span>} /></Reveal></div>
            <Reveal as="ul" stagger={0.06} className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {careers.perks.map((p) => (<li key={p} className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface/40 px-4 py-3 text-sm text-silver"><Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />{p}</li>))}
            </Reveal>
          </section>
        ) : null}

        <section aria-labelledby="apply-heading" className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5"><SectionHeading eyebrow="Apply" title={<span id="apply-heading">Introduce yourself.</span>} description="No cover-letter theatre. Tell us what you've built, link your work and say why this team." /></div>
          <div className="lg:col-span-7"><GlassCard><CareerForm positions={positions} defaultPosition={role && positions.includes(role) ? role : undefined} /></GlassCard></div>
        </section>
      </Container>
    </>
  );
}
