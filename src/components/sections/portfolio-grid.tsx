"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CoverImage } from "@/components/ui/cover-image";
import { TiltCard } from "@/components/motion/tilt-card";
import { asObjectArray, asStringArray, type Metric } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/content";

type PortfolioGridProps = {
  projects: Project[];
  serviceNames: Record<string, string>;
};

/** Filterable case-study grid. Filters by industry and by service. */
export function PortfolioGrid({ projects, serviceNames }: PortfolioGridProps) {
  const industries = React.useMemo(() => Array.from(new Set(projects.map((p) => p.industry).filter((v): v is string => Boolean(v)))).sort(), [projects]);
  const [industry, setIndustry] = React.useState<string>("All");
  const filtered = industry === "All" ? projects : projects.filter((p) => p.industry === industry);

  return (
    <div className="flex flex-col gap-10">
      {industries.length > 1 ? (
        <div role="tablist" aria-label="Filter by industry" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {["All", ...industries].map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={industry === item}
              onClick={() => setIndustry(item)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                industry === item ? "border-transparent bg-white text-bg" : "border-border text-muted hover:border-border-strong hover:text-white",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="grid gap-5 md:grid-cols-2" aria-live="polite">
        {filtered.map((project) => {
          const metrics = asObjectArray<Metric>(project.metrics).slice(0, 3);
          const stack = asStringArray(project.tech_stack).slice(0, 4);
          return (
            <li key={project.id}>
              <Link href={`/portfolio/${project.slug}`} className="group block h-full" data-cursor="Case study">
                <TiltCard as="article" intensity={4} className="flex h-full flex-col p-2">
                  <CoverImage src={project.cover_image} alt={`${project.title} cover`} title={project.title} className="aspect-[16/10] rounded-[calc(var(--radius-lg)-0.5rem)]" sizes="(min-width:768px) 50vw, 100vw" />
                  <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      {project.industry ? <span className="label">{project.industry}</span> : null}
                      {project.year ? <span className="tabular">{project.year}</span> : null}
                      {project.service_id && serviceNames[project.service_id] ? <span className="ml-auto rounded-full border border-border px-2 py-0.5">{serviceNames[project.service_id]}</span> : null}
                    </div>
                    <h2 className="font-display text-xl font-semibold text-white">{project.title}</h2>
                    <p className="text-sm leading-relaxed text-muted">{project.summary}</p>
                    {metrics.length > 0 ? (
                      <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-border pt-4">
                        {metrics.map((m) => (
                          <div key={m.label}>
                            <dt className="label text-[0.55rem]">{m.label}</dt>
                            <dd className="tabular mt-1 text-lg text-white">{m.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    <div className="flex items-center justify-between gap-4">
                      <ul className="flex flex-wrap gap-1.5">
                        {stack.map((t) => (
                          <li key={t} className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted">{t}</li>
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
      </ul>
      {filtered.length === 0 ? <p className="text-center text-muted">No projects in this category yet.</p> : null}
    </div>
  );
}
