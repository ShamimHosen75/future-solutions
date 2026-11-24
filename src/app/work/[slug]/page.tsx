import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, caseStudyHref, getCaseStudy } from "@/content/work";
import { site } from "@/content/site";
import { HeroGlow } from "@/components/page/page-hero";
import { ChapterNav } from "@/components/page/chapter-nav";
import { WorkCard } from "@/components/page/work-card";
import { CtaBand } from "@/components/page/cta-band";
import { Avatar, Button, Container, Section, SectionHeading, SplitText, Stars, Tag } from "@/components/ui/primitives";
import { MockVisual } from "@/components/ui/mock-visual";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Params = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => caseStudies.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getCaseStudy((await params).slug);
  if (!project) return {};
  return { title: `${project.title}: ${project.summary}`, description: project.intro };
}

const chapters = [
  { id: "introduction", label: "Introduction" },
  { id: "client", label: "The client" },
  { id: "challenge", label: "The challenge" },
  { id: "features", label: "Features" },
  { id: "impact", label: "Impact" },
];

const Chapter = ({ id, index, title, children }: { id: string; index: number; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-28 border-b border-line py-12 first:pt-0 last:border-0">
    <p data-reveal className="text-sm font-medium tabular-nums text-orange-600">
      {String(index).padStart(2, "0")}
    </p>
    <h2 data-reveal className="mt-2 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
      {title}
    </h2>
    <div className="mt-6">{children}</div>
  </section>
);

export default async function CaseStudyPage({ params }: Params) {
  const project = getCaseStudy((await params).slug);
  if (!project) notFound();

  const index = caseStudies.findIndex((c) => c.slug === project.slug);
  const related = [1, 2].map((offset) => caseStudies[(index + offset) % caseStudies.length]!);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.intro,
    dateCreated: project.year,
    creator: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <section data-tone="dark" className="relative overflow-hidden bg-ink pt-32 pb-40 text-white sm:pt-40 sm:pb-56">
        <HeroGlow />
        <Container className="relative">
          <nav aria-label="Breadcrumb" data-reveal className="mb-6 text-xs text-white/55">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/work" className="hover:text-white">
              Work
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/85">{project.title}</span>
          </nav>
          <div data-reveal className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <Tag key={t} tone="dark">
                {t}
              </Tag>
            ))}
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <SplitText as="h1" text={project.title} className="text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-7xl" />
              <p data-reveal className="mt-5 max-w-xl text-lg text-muted-dark sm:text-xl">
                {project.summary}
              </p>
            </div>
            <dl data-reveal className="grid grid-cols-3 gap-4 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03] p-5">
              {[
                ["Category", project.category],
                ["Year", project.year],
                ["Timeframe", project.duration],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-dark">{k}</dt>
                  <dd className="mt-1 text-sm font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {project.liveUrl ? (
            <div data-reveal className="mt-8">
              <Button href={project.liveUrl} variant="outline-dark">
                Check live site
              </Button>
            </div>
          ) : null}
        </Container>
      </section>

      <div className="relative bg-paper">
        <Container className="relative -mt-28 sm:-mt-44">
          <div data-clip className="overflow-hidden rounded-[calc(var(--radius-card)*1.4)] shadow-[0_40px_80px_-40px_rgb(4_7_13/0.6)]">
            <MockVisual theme={project.theme} device={project.device} className="aspect-[16/9]" />
          </div>
        </Container>
      </div>

      <Section tone="light" className="pt-16 sm:pt-24">
        <Container className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <ChapterNav chapters={chapters} />
          </aside>
          <div className="max-w-3xl">
            <Chapter id="introduction" index={1} title="Introduction">
              <p data-reveal className="text-lg leading-relaxed text-muted sm:text-xl">
                {project.intro}
              </p>
            </Chapter>
            <Chapter id="client" index={2} title="The client">
              <p data-reveal className="text-lg leading-relaxed text-muted">
                {project.client}
              </p>
            </Chapter>
            <Chapter id="challenge" index={3} title="The challenge">
              <ul className="grid gap-4">
                {project.challenges.map((c, i) => (
                  <li key={i} data-reveal={i % 2 ? "right" : "left"} className="grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-white sm:grid-cols-2">
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Problem</p>
                      <p className="mt-2 text-[15px] leading-relaxed">{c.problem}</p>
                    </div>
                    <div className="border-t border-line bg-[linear-gradient(135deg,rgb(254_107_1/0.06),rgb(0_150_230/0.06))] p-6 sm:border-l sm:border-t-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">Solution</p>
                      <p className="mt-2 text-[15px] leading-relaxed">{c.solution}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Chapter>
            <Chapter id="features" index={4} title="Features">
              <ul className="grid gap-6 sm:grid-cols-2">
                {project.features.map((f, i) => (
                  <li key={f.title} data-reveal className={i === 0 ? "sm:col-span-2" : undefined}>
                    <div data-clip className="overflow-hidden rounded-[var(--radius-card)]">
                      <MockVisual theme={f.theme} device={f.device} className="aspect-[16/10]" />
                    </div>
                    <p className="mt-4 font-semibold">{f.title}</p>
                    <p className="mt-1 text-sm text-muted">{f.text}</p>
                  </li>
                ))}
              </ul>
            </Chapter>
            <Chapter id="impact" index={5} title="Impact">
              <p data-reveal className="text-lg leading-relaxed text-muted">
                {project.impact}
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-3">
                {project.metrics.map((m, i) => (
                  <div
                    key={m.label}
                    data-reveal="scale"
                    className={cn("flex flex-col rounded-[var(--radius-card)] p-5 text-white", i === 0 ? "bg-gradient-orange" : "bg-ink")}
                  >
                    <dt className="order-2 mt-1 text-xs opacity-80 sm:text-sm">{m.label}</dt>
                    <dd className="text-2xl font-semibold tracking-tight sm:text-4xl">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <figure data-reveal className="mt-8 rounded-[var(--radius-card)] border border-line bg-white p-6 sm:p-8">
                <Stars />
                <blockquote className="mt-4 text-lg leading-relaxed text-pretty sm:text-xl">&ldquo;{project.testimonial.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Avatar name={project.testimonial.name} />
                  <span>
                    <span className="block text-sm font-semibold">{project.testimonial.name}</span>
                    <span className="block text-xs text-muted">{project.testimonial.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Chapter>
          </div>
        </Container>
      </Section>

      <section className="border-t border-line bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="More projects"
            title="Explore more of our work"
            action={
              <Button href="/work" variant="outline-light">
                All projects
              </Button>
            }
          />
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
            {related.map((p) => (
              <WorkCard key={p.slug} {...p} href={caseStudyHref(p.slug)} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title="Have a similar project in mind?" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
