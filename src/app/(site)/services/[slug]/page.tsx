import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/prose";
import { Faq } from "@/components/ui/faq";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { ContactForm } from "@/components/forms/contact-form";
import { getPublishedServices, getServiceBySlug } from "@/lib/data/services";
import { getPublishedProjects } from "@/lib/data/projects";
import { asObjectArray, asStringArray } from "@/lib/content";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

type Params = { slug: string };
type Step = { title: string; description: string };

export const dynamicParams = true;

export async function generateStaticParams() {
  const services = await getPublishedServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return pageMetadata({
    title: service.seo_title ?? service.title,
    description: service.seo_description ?? service.short_description,
    path: `/services/${service.slug}`,
    image: service.cover_image,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [service, services, projects] = await Promise.all([getServiceBySlug(slug), getPublishedServices(), getPublishedProjects()]);
  if (!service) notFound();

  const features = asStringArray(service.features);
  const steps = asObjectArray<Step>(service.process_steps);
  const deliverables = asStringArray(service.deliverables);
  const stack = asStringArray(service.tech_stack);
  const faqs = asObjectArray<{ q: string; a: string }>(service.faqs);
  const related = projects.filter((p) => p.service_id === service.id).slice(0, 2);
  const others = services.filter((s) => s.id !== service.id).slice(0, 3);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.short_description,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": `${site.url}/#organization` },
    areaServed: "BD",
    ...(service.starting_price
      ? { offers: { "@type": "Offer", price: Number(service.starting_price), priceCurrency: service.price_currency, url: absoluteUrl(`/services/${service.slug}`) } }
      : {}),
  };

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd,
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path: `/services/${service.slug}` }]),
          ...(faqs.length ? [faqJsonLd(faqs)] : []),
        ]}
      />
      <PageHeader eyebrow="Service" title={service.title} description={service.short_description}>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="#quote" size="lg">
            Get a quote
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          {service.starting_price ? (
            <span className="text-sm text-muted">
              Starting from{" "}
              <span className="tabular text-white">
                <span className="font-sans">৳</span>
                {Number(service.starting_price).toLocaleString()}
              </span>
            </span>
          ) : null}
        </div>
      </PageHeader>

      <Container className="grid gap-16 py-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-16 lg:col-span-8">
          <Reveal>
            <Prose html={service.description} />
          </Reveal>

          {features.length > 0 ? (
            <Reveal>
              <SectionHeading eyebrow="What's included" title="Built in, not bolted on." />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface/40 px-4 py-3 text-sm text-silver">
                    <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {steps.length > 0 ? (
            <Reveal>
              <SectionHeading eyebrow="How we work" title="A process you can see." />
              <ol className="mt-8 grid gap-4 sm:grid-cols-2">
                {steps.map((step, i) => (
                  <li key={step.title}>
                    <GlassCard padding="sm" className="h-full">
                      <span className="tabular text-xs text-muted">Step {String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-2 font-display text-lg font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm text-muted">{step.description}</p>
                    </GlassCard>
                  </li>
                ))}
              </ol>
            </Reveal>
          ) : null}

          {related.length > 0 ? (
            <Reveal>
              <SectionHeading eyebrow="Related work" title="Proof, not promises." />
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <li key={p.id}>
                    <Link href={`/portfolio/${p.slug}`} className="group block h-full">
                      <TiltCard className="h-full p-6">
                        <span className="label">{p.industry}</span>
                        <h3 className="mt-2 font-display text-lg font-semibold text-white">{p.title}</h3>
                        <p className="mt-2 text-sm text-muted">{p.summary}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm text-silver group-hover:text-white">
                          Read case study <ArrowRight className="size-4" aria-hidden />
                        </span>
                      </TiltCard>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {faqs.length > 0 ? (
            <Reveal>
              <SectionHeading eyebrow="FAQ" title="Common questions." />
              <Faq items={faqs} className="mt-8" />
            </Reveal>
          ) : null}
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-4">
          <Reveal>
            <GlassCard className="lg:sticky lg:top-24">
              {deliverables.length > 0 ? (
                <>
                  <h2 className="label">Deliverables</h2>
                  <ul className="mt-4 flex flex-col gap-2">
                    {deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-silver">
                        <Check className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
                        {d}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {stack.length > 0 ? (
                <>
                  <h2 className="label mt-8">Technology</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {stack.map((t) => (
                      <li key={t} className="rounded-full border border-border px-3 py-1 text-xs text-silver">
                        {t}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              <h2 className="label mt-8">Other services</h2>
              <ul className="mt-4 flex flex-col divide-y divide-border">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={`/services/${o.slug}`} className="flex items-center justify-between py-3 text-sm text-silver hover:text-white">
                      {o.title}
                      <ArrowRight className="size-4 text-muted" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </aside>
      </Container>

      <section id="quote" className="py-24" aria-labelledby="quote-heading">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Get a quote"
              title={<span id="quote-heading">Tell us about your {service.title.toLowerCase()} project.</span>}
              description="Share your goals and timeline. We'll reply within one business day with next steps and a ballpark."
            />
          </div>
          <div className="lg:col-span-7">
            <GlassCard>
              <ContactForm services={services.map((s) => ({ id: s.id, title: s.title }))} intent="quote" defaultServiceId={service.id} />
            </GlassCard>
          </div>
        </Container>
      </section>
    </>
  );
}
