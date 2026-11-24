"use client";

import { useMemo, useState } from "react";
import { caseStudies, caseStudyHref, workCategories } from "@/content/work";
import { FilterChips } from "./filter-chips";
import { WorkCard } from "./work-card";

/** Filterable case-study grid. Cards re-animate with a CSS fade each time the filter changes. */
export const WorkGrid = () => {
  const [category, setCategory] = useState("All");
  const counts = useMemo(
    () => Object.fromEntries(workCategories.map((c) => [c, c === "All" ? caseStudies.length : caseStudies.filter((p) => p.category === c).length])),
    [],
  );
  const visible = category === "All" ? caseStudies : caseStudies.filter((p) => p.category === category);

  return (
    <>
      <div data-reveal className="mb-10">
        <FilterChips label="Filter projects by category" options={workCategories} value={category} onChange={setCategory} counts={counts} />
      </div>
      <div key={category} className="grid gap-x-6 gap-y-12 md:grid-cols-2">
        {visible.map((p, i) => (
          <WorkCard
            key={p.slug}
            {...p}
            href={caseStudyHref(p.slug)}
            reveal={false}
            className="motion-safe:animate-[fade-in_0.6s_ease-out_both]"
            style={{ animationDelay: `${i * 70}ms` }}
          />
        ))}
      </div>
    </>
  );
};
