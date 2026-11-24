"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Sticky numbered index for long pages (case studies, blog posts).
 * Highlights the chapter currently in view.
 */
export const ChapterNav = ({ chapters, title = "Overview", numbered = true }: { chapters: { id: string; label: string }[]; title?: string; numbered?: boolean }) => {
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav aria-label={title} className="sticky top-28">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{title}</p>
      <ol className="space-y-1 border-l border-line">
        {chapters.map((c, i) => {
          const isActive = active === c.id;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "-ml-px flex gap-3 border-l-2 py-1.5 pl-4 text-sm transition-colors duration-300",
                  isActive ? "border-orange-500 font-medium text-ink" : "border-transparent text-muted hover:text-ink",
                )}
              >
                {numbered ? <span className="tabular-nums text-muted/70">{String(i + 1).padStart(2, "0")}</span> : null}
                {c.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
