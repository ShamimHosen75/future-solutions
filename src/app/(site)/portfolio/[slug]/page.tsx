import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/prose";
import { GlassCard } from "@/components/ui/glass-card";
import { CoverImage } from "@/components/ui/cover-image";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { CTA } from "@/components/sections/cta";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data/projects";
import { getPublishedServices } from "@/lib/data/services";
import { getSettings } from "@/lib/data/settings";
import { asObjectArray, asStringArray, type Metric } from "@/lib/content";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

type Params = { slug: string };
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Case study not found" };
  return pageMetadata({ title: project.seo_title ?? project.title, description: project.seo_description ?? project.summary, path: `/portfolio/${project.slug}`, image: project.cover_image, type: "article" });
}

/** Parses "68%" / "+24%" / "-41%" / "2x" / "6,000+" into a number + affixes for the counter. */
function splitMetric(value: string): { prefix: string; number: number; suffix: string } | null {
  const m = value.replace(/,/g, "").match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { prefix: m[1] ?? "", number: Number(m[2]), suffix: m[3] ?? "" };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [project, projects, services, settings] = await Promise.all([getProjectBySlug(slug), getPublishedProjects(), getPublishedServices(), getSettings()]);
  if (!project) notFound();

  const metrics = asObjectArray<Metric>(project.metrics);
  const stack = asStringArray(project.tech_stack);
  const gallery = asStringArray(project.gallery);
  const service = services.find((s) => s.id === project.service_id);
  const index = projects.findIndex((p) => p.id === project.id);
  const next = projects[(index + 1) % projects.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: absoluteUrl(`/portfolio/${project.slug}`),
    author: { "@id": `${site.url}/#organization` },
    dateCreated: project.year ? `${project.year}` : undefined,
    about: project.industry ?? undefined,
    ...(project.cover_image ? { image: project.cover_image } : {}),
  };

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }, { name: project.title, path: `/portfolio/${project.slug}` }])]} />
      <PageHeader eyebrow={[project.industry, project.year].filter(Boolean).join(" · ") || "Case study"} title={project.title} description={project.summary}>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          {project.client_name ? <span>Client: <span className="text-white">{project.client_name}</span></span> : null}
          {service ? (
            <Link href={`/services/${service.slug}`} className="rounded-full border border-border px-3 py-1 text-xs text-silver hover:text-white">{service.title}</Link>
          ) : null}
          {project.live_url ? (
            <Button href={project.live_url} variant="ghost" size="sm">Visit live site <ExternalLink className="size-3.5" aria-hidden /></Button>
          ) : null}
        </div>
      </PageHeader>

      <Container className="flex flex-col gap-16 py-8">
        <Reveal>
          <CoverImage src={project.cover_image} alt={`${project.title} cover`} title={project.title} className="aspect-[21/9] rounded-[var(--radius-xl)]" sizes="100vw" priority />
        </Reveal>

        {metrics.length > 0 ? (
          <Reveal as="ul" stagger={0.1} className="grid gap-4 sm:grid-cols-3">
            {metrics.map((m) => {
              const parsed = splitMetric(m.value);
              return (
                <li key={m.label}>
                  <GlassCard className="text-center">
                    <p className="tabular text-4xl font-semibold text-white md:text-5xl">
                      {parsed ? <Counter value={parsed.number} prefix={parsed.prefix} suffix={parsed.suffix} /> : m.value}
                    </p>
                    <p className="label mt-3">{m.label}</p>
                  </GlassCard>
                </li>
              );
            })}
          </Reveal>
        ) : null}

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-12 lg:col-span-8">
            {[
              ["The challenge", project.challenge],
              ["What we built", project.solution],
              ["The results", project.results],
            ]
              .filter(([, body]) => Boolean(body))
              .map(([title, body]) => (
                <Reveal key={title}>
                  <h2 className="label mb-4">{title}</h2>
                  <Prose html={body!.startsWith("<") ? body! : `<p>${body}</p>`} className="text-lg text-silver" />
                </Reveal>
              ))}
            {gallery.length > 0 ? (
              <Reveal as="ul" stagger={0.08} className="grid gap-4 sm:grid-cols-2">
                {gallery.map((src, i) => (
                  <li key={src}><CoverImage src={src} alt={`${project.title} screenshot ${i + 1}`} title={project.title} className="aspect-[16/10] rounded-[var(--radius-md)]" /></li>
                ))}
              </Reveal>
            ) : null}
          </div>
          <aside className="lg:col-span-4">
            <Reveal>
              <GlassCard className="lg:sticky lg:top-24">
                <dl className="flex flex-col gap-5 text-sm">
                  {project.client_name ? (<div><dt className="label">Client</dt><dd className="mt-1 text-white">{project.client_name}</dd></div>) : null}
                  {project.industry ? (<div><dt className="label">Industry</dt><dd className="mt-1 text-white">{project.industry}</dd></div>) : null}
                  {project.year ? (<div><dt className="label">Year</dt><dd className="tabular mt-1 text-white">{project.year}</dd></div>) : null}
                  {service ? (<div><dt className="label">Service</dt><dd className="mt-1"><Link href={`/services/${service.slug}`} className="text-white hover:text-cyan">{service.title}</Link></dd></div>) : null}
                  {stack.length > 0 ? (
                    <div>
                      <dt className="label">Technology</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">{stack.map((t) => (<span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-silver">{t}</span>))}</dd>
                    </div>
                  ) : null}
                </dl>
                <Button href="/contact?intent=quote" className="mt-8 w-full">Start a similar project <ArrowRight className="size-4" aria-hidden /></Button>
              </GlassCard>
            </Reveal>
          </aside>
        </div>

        <Reveal className="flex flex-col items-start justify-between gap-6 border-t border-border pt-10 sm:flex-row sm:items-center">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white"><ArrowLeft className="size-4" aria-hidden /> All case studies</Link>
          {next && next.id !== project.id ? (
            <Link href={`/portfolio/${next.slug}`} className="group text-right">
              <span className="label">Next case study</span>
              <span className="mt-1 flex items-center gap-2 font-display text-lg text-white group-hover:text-cyan">{next.title} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden /></span>
            </Link>
          ) : null}
        </Reveal>
      </Container>
      <CTA whatsapp={settings.contact.whatsapp} />
    </>
  );
}
