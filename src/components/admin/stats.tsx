import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, hint, icon: Icon, href, tone = "neutral" }: { label: string; value: string | number; hint?: string; icon: LucideIcon; href?: string; tone?: "neutral" | "cyan" | "amber" }) {
  const body = (
    <div className={cn("group relative flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface/40 p-5 transition-colors", href && "hover:border-border-strong")}>
      <div className="flex items-center justify-between">
        <span className={cn("flex size-9 items-center justify-center rounded-xl ring-1 ring-border", tone === "cyan" && "bg-cyan/10 text-cyan", tone === "amber" && "bg-amber/10 text-amber", tone === "neutral" && "bg-white/[0.04] text-silver")}><Icon className="size-4" aria-hidden /></span>
        {href ? <ArrowUpRight className="size-4 text-muted transition group-hover:text-white" aria-hidden /> : null}
      </div>
      <p className="tabular text-3xl font-semibold text-white">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <div><p className="text-sm text-silver">{label}</p>{hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}</div>
    </div>
  );
  return href ? <Link href={href} data-no-transition className="block h-full">{body}</Link> : body;
}

/** Simple CSS bar chart for daily counts (no charting library). */
export function BarChart({ data, label }: { data: { day: string; count: number }[]; label: string }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <figure className="rounded-[var(--radius-lg)] border border-border bg-surface/40 p-5">
      <figcaption className="flex items-baseline justify-between"><span className="text-sm text-silver">{label}</span><span className="tabular text-xs text-muted">{total.toLocaleString()} total</span></figcaption>
      <div className="mt-5 flex h-36 items-end gap-1" role="img" aria-label={`${label}: ${total} over ${data.length} days`}>
        {data.map((d) => (
          <div key={d.day} className="group relative flex-1">
            <div className="w-full rounded-t-sm bg-brand-gradient opacity-70 transition group-hover:opacity-100" style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }} />
            <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-surface-2 px-1.5 py-0.5 text-[0.6rem] whitespace-nowrap text-white group-hover:block">{d.day}: {d.count}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[0.6rem] text-muted"><span>{data[0]?.day}</span><span>{data[data.length - 1]?.day}</span></div>
    </figure>
  );
}
