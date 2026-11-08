import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

export function AdminPageHeader({
  title,
  description,
  crumbs,
  actions,
  className,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1 text-xs text-muted">
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight className="size-3" aria-hidden /> : null}
                {c.href ? (
                  <Link href={c.href} data-no-transition className="hover:text-white">{c.label}</Link>
                ) : (
                  <span className="text-silver">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="truncate font-display text-2xl font-semibold text-white md:text-3xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
