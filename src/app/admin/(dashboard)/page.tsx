import Link from "next/link";
import { Eye, FileText, Inbox, MessageSquareQuote, Star, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { BarChart, StatCard } from "@/components/admin/stats";
import { Badge } from "@/components/ui/badge";
import { requireSession } from "@/lib/admin/auth";
import { modules } from "@/lib/admin/modules";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

type SearchParams = Promise<{ error?: string; notice?: string }>;

export default async function OverviewPage({ searchParams }: { searchParams: SearchParams }) {
  const [{ error, notice }, session] = await Promise.all([searchParams, requireSession()]);
  const supabase = await createClient();
  const isAdmin = session.profile.role === "admin";
  const since30 = new Date(Date.now() - 30 * 86400000).toISOString();
  const since7 = new Date(Date.now() - 7 * 86400000).toISOString();

  const [counts, pending, leadsNew, leadsWeek, views, recentLeads, recentReviews] = await Promise.all([
    Promise.all(modules.map(async (m) => {
      const [{ count: total }, { count: published }] = await Promise.all([
        supabase.from(m.table).select("id", { count: "exact", head: true }),
        supabase.from(m.table).select("id", { count: "exact", head: true }).eq("is_published", true),
      ]);
      return { key: m.key, label: m.label, total: total ?? 0, published: published ?? 0 };
    })),
    supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("is_approved", false),
    isAdmin ? supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new") : Promise.resolve({ count: null }),
    isAdmin ? supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since7) : Promise.resolve({ count: null }),
    isAdmin ? supabase.from("page_views").select("created_at").gte("created_at", since30).limit(50000) : Promise.resolve({ data: [] as { created_at: string }[] }),
    isAdmin ? supabase.from("leads").select("id, name, email, type, status, subject, created_at").order("created_at", { ascending: false }).limit(6) : Promise.resolve({ data: [] }),
    supabase.from("testimonials").select("id, author_name, author_company, rating, content, created_at").eq("is_approved", false).order("created_at", { ascending: false }).limit(4),
  ]);

  // Group views per day for the last 30 days.
  const days: { day: string; count: number }[] = [];
  const byDay = new Map<string, number>();
  for (const v of views.data ?? []) {
    const d = v.created_at.slice(5, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + 1);
  }
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(5, 10);
    days.push({ day: d, count: byDay.get(d) ?? 0 });
  }
  const totalViews = days.reduce((s, d) => s + d.count, 0);
  const publishedTotal = counts.reduce((s, c) => s + c.published, 0);

  return (
    <>
      <AdminPageHeader title={`Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, ${session.profile.full_name?.split(" ")[0] ?? "there"}`} description="Here's what's happening across the site." />
      {error === "forbidden" ? <p role="alert" className="mb-6 rounded-[var(--radius-md)] border border-orange/30 bg-orange/10 px-4 py-3 text-sm text-orange">That area is for administrators only.</p> : null}
      {notice === "password-updated" ? <p role="status" className="mb-6 rounded-[var(--radius-md)] border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm text-cyan">Your password has been updated.</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isAdmin ? <StatCard label="New leads" value={leadsNew.count ?? 0} hint={`${leadsWeek.count ?? 0} received this week`} icon={Inbox} href="/admin/leads" tone="cyan" /> : null}
        <StatCard label="Reviews awaiting approval" value={pending.count ?? 0} icon={MessageSquareQuote} href="/admin/testimonials" tone="amber" />
        <StatCard label="Published items" value={publishedTotal} hint={`across ${counts.length} content types`} icon={FileText} />
        {isAdmin ? <StatCard label="Page views · 30 days" value={totalViews} hint={totalViews === 0 ? "Tracking starts once the site is live" : undefined} icon={Eye} /> : <StatCard label="Your role" value="Editor" hint="Content and media access" icon={Users} />}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {isAdmin ? <div className="xl:col-span-2"><BarChart data={days} label="Page views, last 30 days" /></div> : null}
        <div className={isAdmin ? "" : "xl:col-span-3"}>
          <div className="h-full rounded-[var(--radius-lg)] border border-border bg-surface/40 p-5">
            <h2 className="text-sm text-silver">Content health</h2>
            <ul className="mt-4 divide-y divide-border">
              {counts.map((c) => (
                <li key={c.key} className="flex items-center justify-between py-2.5 text-sm">
                  <Link href={`/admin/${c.key}`} data-no-transition className="text-silver hover:text-white">{c.label}</Link>
                  <span className="tabular text-xs text-muted"><span className="text-white">{c.published}</span> / {c.total} published</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {isAdmin ? (
          <section className="rounded-[var(--radius-lg)] border border-border bg-surface/40 p-5" aria-labelledby="recent-leads">
            <div className="flex items-center justify-between"><h2 id="recent-leads" className="text-sm text-silver">Recent leads</h2><Link href="/admin/leads" data-no-transition className="text-xs text-cyan hover:underline">View inbox</Link></div>
            <ul className="mt-4 divide-y divide-border">
              {(recentLeads.data ?? []).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div className="min-w-0"><p className="truncate font-medium text-white">{l.name}</p><p className="truncate text-xs text-muted">{l.subject ?? l.email}</p></div>
                  <div className="flex shrink-0 items-center gap-2"><Badge className="capitalize">{l.type}</Badge><span className="tabular text-xs text-muted">{formatDate(l.created_at)}</span></div>
                </li>
              ))}
              {(recentLeads.data ?? []).length === 0 ? <li className="py-6 text-center text-sm text-muted">No leads yet.</li> : null}
            </ul>
          </section>
        ) : null}
        <section className="rounded-[var(--radius-lg)] border border-border bg-surface/40 p-5" aria-labelledby="pending-reviews">
          <div className="flex items-center justify-between"><h2 id="pending-reviews" className="text-sm text-silver">Reviews to approve</h2><Link href="/admin/testimonials" data-no-transition className="text-xs text-cyan hover:underline">Moderate</Link></div>
          <ul className="mt-4 divide-y divide-border">
            {(recentReviews.data ?? []).map((r) => (
              <li key={r.id} className="py-3 text-sm">
                <div className="flex items-center justify-between"><p className="font-medium text-white">{r.author_name}{r.author_company ? <span className="text-muted"> · {r.author_company}</span> : null}</p><span className="inline-flex items-center gap-1 text-amber"><Star className="size-3.5 fill-amber" aria-hidden /> <span className="tabular text-silver">{r.rating}</span></span></div>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{r.content}</p>
              </li>
            ))}
            {(recentReviews.data ?? []).length === 0 ? <li className="py-6 text-center text-sm text-muted">All caught up.</li> : null}
          </ul>
        </section>
      </div>
    </>
  );
}
