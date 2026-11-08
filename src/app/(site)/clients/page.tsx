import type { Metadata } from "next";
import Image from "next/image";
import { Quote } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { ReviewForm } from "@/components/forms/review-form";
import { getPublishedClients } from "@/lib/data/clients";
import { getApprovedTestimonials } from "@/lib/data/testimonials";
import { initials } from "@/lib/content";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import type { Client } from "@/types/content";

export const metadata: Metadata = pageMetadata({
  title: "Clients & Reviews",
  description: "Companies that trust Future Solutions, our technology partners, and verified reviews from clients and academy graduates.",
  path: "/clients",
});

function LogoTile({ client }: { client: Client }) {
  const inner = client.logo_url ? (
    <Image src={client.logo_url} alt={client.name} width={160} height={48} className="h-9 w-auto object-contain opacity-80 grayscale transition group-hover:opacity-100 group-hover:grayscale-0" />
  ) : (
    <span className="font-label text-center text-[0.65rem] tracking-[0.18em] text-silver uppercase transition group-hover:text-white">{client.name}</span>
  );
  const classes = "group glass flex min-h-24 items-center justify-center rounded-[var(--radius-md)] px-5 py-4 transition hover:border-border-strong";
  return client.website_url ? (
    <a href={client.website_url} target="_blank" rel="noopener noreferrer" className={classes} aria-label={client.name}>{inner}</a>
  ) : (
    <div className={classes}>{inner}</div>
  );
}

export default async function ClientsPage() {
  const [clients, testimonials] = await Promise.all([getPublishedClients(), getApprovedTestimonials()]);
  const partners = clients.filter((c) => c.type === "partner");
  const customers = clients.filter((c) => c.type === "client");
  const average = testimonials.length ? testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length : 0;

  const jsonLd = testimonials.length
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        aggregateRating: { "@type": "AggregateRating", ratingValue: average.toFixed(1), reviewCount: testimonials.length, bestRating: 5, worstRating: 1 },
        review: testimonials.slice(0, 10).map((t) => ({
          "@type": "Review",
          author: { "@type": "Person", name: t.author_name },
          reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
          reviewBody: t.content,
          datePublished: t.created_at.slice(0, 10),
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Clients & Reviews", path: "/clients" }]), ...(jsonLd ? [jsonLd] : [])]} />
      <PageHeader eyebrow="Clients & reviews" title={"Trusted by teams\nwho measure results."} highlight={["measure", "results."]} description="From neighbourhood clinics to logistics fleets, we build for businesses across Bangladesh and partner with the platforms that power them.">
        {testimonials.length > 0 ? (
          <div className="flex items-center gap-4">
            <span className="tabular font-display text-4xl font-semibold text-white">{average.toFixed(1)}</span>
            <div><Stars rating={average} size={16} /><p className="mt-1 text-xs text-muted">from {testimonials.length} verified reviews</p></div>
          </div>
        ) : null}
      </PageHeader>

      <Container className="flex flex-col gap-24 pb-8">
        {customers.length > 0 ? (
          <section aria-labelledby="clients-heading">
            <Reveal><SectionHeading eyebrow="Clients" title={<span id="clients-heading">Companies we work with.</span>} /></Reveal>
            <Reveal as="ul" stagger={0.05} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {customers.map((c) => (<li key={c.id}><LogoTile client={c} /></li>))}
            </Reveal>
          </section>
        ) : null}

        {partners.length > 0 ? (
          <section aria-labelledby="partners-heading">
            <Reveal><SectionHeading eyebrow="Partners" title={<span id="partners-heading">Technology partners.</span>} description="Platforms we build on and integrate every week." /></Reveal>
            <Reveal as="ul" stagger={0.05} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((c) => (<li key={c.id}><LogoTile client={c} /></li>))}
            </Reveal>
          </section>
        ) : null}

        <section aria-labelledby="reviews-heading">
          <Reveal><SectionHeading eyebrow="Reviews" title={<span id="reviews-heading">In their words.</span>} /></Reveal>
          {testimonials.length > 0 ? (
            <Reveal as="ul" stagger={0.08} className="mt-10 columns-1 gap-5 md:columns-2 lg:columns-3 [&>li]:mb-5 [&>li]:break-inside-avoid">
              {testimonials.map((t) => (
                <li key={t.id}>
                  <TiltCard as="article" intensity={4} className="flex flex-col gap-5 p-6">
                    <div className="flex items-center justify-between"><Stars rating={t.rating} /><Quote className="size-5 text-muted/60" aria-hidden /></div>
                    <blockquote className="text-sm leading-relaxed text-silver md:text-base">“{t.content}”</blockquote>
                    <footer className="flex items-center gap-3 border-t border-border pt-5">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-display text-xs font-bold text-white">{initials(t.author_name)}</span>
                      <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{t.author_name}</p><p className="truncate text-xs text-muted">{[t.author_role, t.author_company].filter(Boolean).join(" · ")}</p></div>
                      {t.source ? <span className="ml-auto shrink-0 text-[0.65rem] tracking-wider text-muted uppercase">{t.source}</span> : null}
                    </footer>
                  </TiltCard>
                </li>
              ))}
            </Reveal>
          ) : (
            <p className="mt-10 text-muted">Be the first to leave a review.</p>
          )}
        </section>

        <section id="review" aria-labelledby="review-heading" className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5"><SectionHeading eyebrow="Leave a review" title={<span id="review-heading">Worked with us? Tell others.</span>} description="Reviews are checked by our team before they appear, so please use the same name you worked with us under." /></div>
          <div className="lg:col-span-7"><GlassCard><ReviewForm /></GlassCard></div>
        </section>
      </Container>
    </>
  );
}
