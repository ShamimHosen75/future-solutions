import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, serviceShared, services, servicesByGroup } from "@/content/services";
import { caseStudies, caseStudyHref } from "@/content/work";
import { site } from "@/content/site";
import { HeroGlow } from "@/components/page/page-hero";
import { ServiceCard } from "@/components/page/service-card";
import { WorkCard } from "@/components/page/work-card";
import { CtaBand } from "@/components/page/cta-band";
import { Button, Container, Eyebrow, Section, SectionHeading, SplitText } from "@/components/ui/primitives";
import { MockVisual } from "@/components/ui/mock-visual";
import { NamedIcon } from "@/components/ui/icon-map";
import { Check } from "@/components/ui/icons";
import { Partners } from "@/components/sections/partners";
import { ByTheNumbers } from "@/components/sections/by-the-numbers";
import { WhyUs } from "@/components/sections/why-us";
import { Faq } from "@/components/sections/faq";
import Link from "next/link";

type Params = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return { title: `${service.title} services`, description: service.summary };
}

export default async function ServicePage({ params }: Params) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === service.slug);
  const work = [0, 1, 2].map((o) => caseStudies[(index + o) % caseStudies.length]!);
  const related = servicesByGroup(service.group).filter((s) => s.slug !== service.slug).slice(0, 3);
  const { problem, process, fit } = serviceShared;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    provider: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      {/* 1. Hero */}
      <section data-tone="dark" className="relative overflow-hidden bg-ink pt-32 pb-20 text-white sm:pt-40 sm:pb-28">
        <HeroGlow />
        <Container className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" data-reveal className="mb-6 text-xs text-white/55">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white/85">{service.title}</span>
            </nav>
            <Eyebrow className="mb-5 text-orange-400">{service.group} services</Eyebrow>
            <SplitText as="h1" text={`${service.title} that grows your business`} className="text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-6xl" />
            <p data-reveal className="mt-6 max-w-xl text-base text-pretty text-muted-dark sm:text-lg">
              {service.intro}
            </p>
            <div data-reveal className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" size="lg">
                Book a free call
              </Button>
              <Button href="/pricing" size="lg" variant="outline-dark">
                See pricing
              </Button>
            </div>
            <ul data-reveal className="mt-9 grid gap-3 sm:grid-cols-2">
              {service.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-white/85">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-orange">
                    <Check className="size-3 text-white" strokeWidth={3} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="right" className="relative">
            <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-[conic-gradient(from_120deg,rgb(254_107_1/0.35),rgb(0_212_255/0.35),rgb(254_107_1/0.35))] opacity-60 blur-2xl" />
            <MockVisual theme={service.theme} device={service.device} className="relative aspect-[4/3.4] rounded-[calc(var(--radius-card)*1.4)] ring-1 ring-white/10" />
          </div>
        </Container>
      </section>

      {/* 2. Partners */}
      <div className="pt-16 sm:pt-20 bg-paper">
        <Partners />
      </div>

      {/* 3. Problem */}
      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div data-reveal="left">
            <Eyebrow>{problem.eyebrow}</Eyebrow>
            <p className="mt-6 text-[7rem] leading-none font-semibold tracking-[-0.05em] text-gradient-brand sm:text-[9rem]">{problem.stat}</p>
            <p className="mt-4 max-w-sm text-lg text-muted">{problem.statText}</p>
          </div>
          <ol className="grid gap-4">
            {problem.points.map((p, i) => (
              <li key={p.title} data-reveal="right" className="flex gap-5 rounded-[var(--radius-card)] border border-line bg-paper p-6">
                <span className="text-2xl font-medium tabular-nums text-orange-500">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 4. What we offer */}
      <Section tone="light">
        <Container>
          <SectionHeading
            eyebrow="What we offer"
            title={`Our ${service.title.toLowerCase()} services`}
            intro="Every engagement is shaped around your goals. These are the building blocks we combine for your project."
            action={<Button href="/contact">Discuss your project</Button>}
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.offers.map((o, i) => (
              <li
                key={o.title}
                data-reveal="scale"
                className="group rounded-[var(--radius-card)] border border-line bg-white p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgb(4_7_13/0.35)]"
              >
                <div className="flex items-center justify-between">
                  <NamedIcon name={service.icon} className="size-8 text-orange-500 transition-transform duration-500 group-hover:rotate-[-8deg]" />
                  <span className="text-sm tabular-nums text-muted/70">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-8 text-lg font-semibold">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 5. Selected work */}
      <Section tone="light" className="pt-0 sm:pt-0">
        <Container>
          <SectionHeading
            eyebrow="Selected work"
            title="Recent projects"
            action={
              <Button href="/work" variant="outline-light">
                See all work
              </Button>
            }
          />
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {work.map((p) => (
              <WorkCard key={p.slug} {...p} href={caseStudyHref(p.slug)} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. Process timeline */}
      <Section tone="dark" className="overflow-hidden">
        <div aria-hidden data-parallax="0.3" className="pointer-events-none absolute -right-40 top-0 size-[480px] rounded-full bg-orange-600/15 blur-[120px]" />
        <Container className="relative">
          <SectionHeading eyebrow="Our process" title="From first call to launch" intro="A clear, phased process with a fixed timeline. You see progress every week." tone="dark" />
          <div className="relative">
            <div aria-hidden className="absolute left-0 right-0 top-[22px] hidden h-px bg-white/10 lg:block" />
            <div aria-hidden data-progress-line className="absolute left-0 right-0 top-[22px] hidden h-px origin-left bg-gradient-orange lg:block" />
            <ol className="relative grid gap-4 lg:grid-cols-5">
              {process.map((step, i) => (
                <li key={step.title} data-reveal className="relative">
                  <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-white/15 bg-ink-2 text-sm font-semibold tabular-nums text-orange-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-5 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-blue-400">{step.week}</p>
                    <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-dark">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] border border-orange-500/30 bg-orange-500/10 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-semibold">Need it faster?</p>
              <p className="mt-1 text-sm text-white/70">We can add people to your project to hit an urgent deadline.</p>
            </div>
            <Button href="/contact">Talk to us</Button>
          </div>
        </Container>
      </Section>

      {/* 7. Fit */}
      <Section tone="light">
        <Container>
          <div data-zoom className="grid gap-10 rounded-[calc(var(--radius-card)*1.4)] bg-[linear-gradient(135deg,#cdf3ff,#ffe6cc)] p-8 sm:p-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <Eyebrow>Are we a fit?</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">We work best with teams who</h2>
              <Button href="/contact" variant="dark" className="mt-8">
                Book a free call
              </Button>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {fit.map((f) => (
                <li key={f} className="flex items-start gap-3 rounded-xl bg-white/70 p-4 text-sm font-medium text-ink">
                  <Check className="mt-0.5 size-4 shrink-0 text-orange-600" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* 8-9. Numbers and why us */}
      <ByTheNumbers />
      <WhyUs />

      {/* 10. FAQ */}
      <Faq eyebrow="FAQs" title={`${service.title} questions`} items={serviceShared.faqs(service.title)} />

      {/* Related services */}
      {related.length ? (
        <Section tone="light" className="pt-0 sm:pt-0">
          <Container>
            <SectionHeading eyebrow={`More ${service.group.toLowerCase()} services`} title="Related services" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <CtaBand title={`Let's talk about your ${service.title.toLowerCase()} project`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
