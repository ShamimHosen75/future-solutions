import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { CoverImage } from "@/components/ui/cover-image";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { asObjectArray, asStringArray, type Metric } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/content";

export function FeaturedWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="py-24 md:py-32" aria-labelledby="work-heading">
      <Container>
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            title={
              <span id="work-heading">
                Results our clients <span className="text-gradient">measure.</span>
              </span>
            }
            description="Case studies from e-commerce, healthcare, logistics and fashion — each one shipped, measured and still running."
          />
          <Button href="/portfolio" variant="outline" className="shrink-0">
            View portfolio
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </Reveal>

        <Reveal as="ul" stagger={0.12} className="mt-14 grid gap-5 md:grid-cols-2">
          {projects.map((project, i) => {
            const metrics = asObjectArray<Metric>(project.metrics).slice(0, 2);
            const stack = asStringArray(project.tech_stack).slice(0, 3);
            const large = i === 0;
            return (
              <li key={project.id} className={cn(large && "md:col-span-2")}>
                <Link href={`/portfolio/${project.slug}`} className="group block h-full" data-cursor="Case study">
                  <TiltCard as="article" intensity={4} className="h-full p-2" innerClassName={cn(large && "lg:grid lg:grid-cols-2")}>
                    <CoverImage
                      src={project.cover_image}
                      alt={`${project.title} cover`}
                      title={project.title}
                      sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                      className={cn("aspect-[16/10] rounded-[calc(var(--radius-lg)-0.5rem)]", large && "lg:aspect-auto lg:h-full lg:min-h-[360px]")}
                    />
                    <div className="flex flex-col gap-5 p-5 md:p-7">
                      <div className="flex items-center gap-3 text-xs text-muted">
                        {project.industry ? <span className="label">{project.industry}</span> : null}
                        {project.year ? <span className="tabular">{project.year}</span> : null}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-white md:text-2xl">{project.title}</h3>
                      <p className="text-sm leading-relaxed text-muted md:text-base">{project.summary}</p>
                      {metrics.length > 0 ? (
                        <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-border pt-5">
                          {metrics.map((m) => (
                            <div key={m.label}>
                              <dt className="label">{m.label}</dt>
                              <dd className="tabular mt-1 text-2xl text-white">{m.value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                      <div className="flex items-center justify-between gap-4">
                        <ul className="flex flex-wrap gap-2">
                          {stack.map((t) => (
                            <li key={t} className="rounded-full border border-border px-2.5 py-0.5 text-[0.7rem] text-muted">
                              {t}
                            </li>
                          ))}
                        </ul>
                        <ArrowUpRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" aria-hidden />
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
