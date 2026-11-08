"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, Mail, MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import { assignLead, deleteLead, updateLeadNotes, updateLeadStatus } from "@/app/actions/admin-leads";
import { ConfirmDialog } from "@/components/admin/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/admin/ui/dialog";
import { useToast } from "@/components/admin/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { cn, formatDate, whatsappLink } from "@/lib/utils";
import type { Lead, Profile } from "@/types/content";
import type { LeadStatus } from "@/types/database";

const statusTone: Record<LeadStatus, "cyan" | "amber" | "white" | "neutral"> = { new: "cyan", contacted: "amber", won: "white", lost: "neutral" };
const statuses: LeadStatus[] = ["new", "contacted", "won", "lost"];

type LeadsInboxProps = {
  leads: Lead[];
  team: Pick<Profile, "id" | "full_name" | "email">[];
  lookups: { services: Record<string, string>; courses: Record<string, string> };
};

export function LeadsInbox({ leads, team, lookups }: LeadsInboxProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | LeadStatus>("all");
  const [type, setType] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<Lead | null>(null);
  const [notes, setNotes] = React.useState("");
  const [confirm, setConfirm] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => setNotes(selected?.notes ?? ""), [selected]);

  const types = React.useMemo(() => Array.from(new Set(leads.map((l) => l.type))), [leads]);
  const filtered = leads.filter(
    (l) =>
      (status === "all" || l.status === status) &&
      (type === "all" || l.type === type) &&
      `${l.name} ${l.email} ${l.company ?? ""} ${l.subject ?? ""} ${l.message ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  );
  const counts = statuses.map((s) => [s, leads.filter((l) => l.status === s).length] as const);

  const run = (fn: () => Promise<{ ok: boolean; message?: string }>, success?: string) =>
    startTransition(async () => {
      const r = await fn();
      if (r.ok) {
        if (success || r.message) toast({ title: success ?? r.message ?? "Done" });
        router.refresh();
      } else toast({ title: r.message ?? "Something went wrong", tone: "error" });
    });

  const exportHref = `/admin/leads/export?status=${status}&type=${type}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {counts.map(([s, n]) => (
          <button key={s} type="button" onClick={() => setStatus(status === s ? "all" : s)} className={cn("rounded-[var(--radius-md)] border px-4 py-3 text-left transition-colors", status === s ? "border-cyan/50 bg-cyan/5" : "border-border bg-surface/40 hover:border-border-strong")}>
            <p className="label text-[0.6rem] capitalize">{s}</p>
            <p className="tabular mt-1 text-2xl font-semibold text-white">{n}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, company, message…" className="pl-10" aria-label="Search leads" />
        </div>
        <div className="w-full sm:w-40">
          <Select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
            <option value="all">All types</option>
            {types.map((t) => (<option key={t} value={t} className="capitalize">{t}</option>))}
          </Select>
        </div>
        <Button href={exportHref} variant="outline" data-no-transition download>
          <Download className="size-4" aria-hidden /> Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface/40">
        <div className="no-scrollbar overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface/60 text-left text-xs text-muted">
              <tr>{["Lead", "Type", "Subject", "Status", "Assigned", "Received"].map((h) => (<th key={h} className="px-4 py-3 font-medium">{h}</th>))}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} onClick={() => setSelected(l)} className="cursor-pointer hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{l.name}</p>
                    <p className="text-xs text-muted">{l.email}{l.company ? ` · ${l.company}` : ""}</p>
                  </td>
                  <td className="px-4 py-3"><Badge className="capitalize">{l.type}</Badge></td>
                  <td className="max-w-[18rem] truncate px-4 py-3 text-silver">{l.subject ?? l.message ?? "—"}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone[l.status]} className="capitalize">{l.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-muted">{team.find((t) => t.id === l.assigned_to)?.full_name ?? (l.assigned_to ? "Assigned" : "—")}</td>
                  <td className="tabular px-4 py-3 text-xs text-muted">{formatDate(l.created_at)}</td>
                </tr>
              ))}
              {filtered.length === 0 ? (<tr><td colSpan={6} className="px-4 py-12 text-center text-muted">{leads.length === 0 ? "No leads yet." : "Nothing matches your filters."}</td></tr>) : null}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-2 text-xs text-muted">{filtered.length} of {leads.length} leads</div>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        {selected ? (
          <DialogContent title={selected.name} description={`${selected.type} · received ${formatDate(selected.created_at)}`} size="lg">
            <div className="grid gap-6 md:grid-cols-5">
              <div className="flex flex-col gap-4 md:col-span-3">
                <dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
                  <dt className="text-muted">Email</dt><dd><a href={`mailto:${selected.email}`} className="text-cyan hover:underline">{selected.email}</a></dd>
                  {selected.phone ? (<><dt className="text-muted">Phone</dt><dd className="text-silver">{selected.phone}</dd></>) : null}
                  {selected.company ? (<><dt className="text-muted">Company</dt><dd className="text-silver">{selected.company}</dd></>) : null}
                  {selected.budget ? (<><dt className="text-muted">Budget</dt><dd className="text-silver">{selected.budget}</dd></>) : null}
                  {selected.service_id ? (<><dt className="text-muted">Service</dt><dd className="text-silver">{lookups.services[selected.service_id] ?? "—"}</dd></>) : null}
                  {selected.course_id ? (<><dt className="text-muted">Course</dt><dd className="text-silver">{lookups.courses[selected.course_id] ?? "—"}</dd></>) : null}
                  {selected.source ? (<><dt className="text-muted">Source</dt><dd className="text-silver">{selected.source}</dd></>) : null}
                </dl>
                {selected.subject ? <p className="font-medium text-white">{selected.subject}</p> : null}
                {selected.message ? <p className="rounded-[var(--radius-md)] border border-border bg-surface/60 p-4 text-sm leading-relaxed whitespace-pre-wrap text-silver">{selected.message}</p> : null}
                {selected.metadata && Object.keys(selected.metadata as object).length > 0 ? (
                  <details className="text-xs text-muted"><summary className="cursor-pointer">Extra details</summary><pre className="mt-2 overflow-x-auto rounded bg-surface-2 p-3 font-mono">{JSON.stringify(selected.metadata, null, 2)}</pre></details>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button href={`mailto:${selected.email}`} variant="secondary" size="sm"><Mail className="size-4" aria-hidden /> Email</Button>
                  {selected.phone ? (<><Button href={`tel:${selected.phone}`} variant="secondary" size="sm"><Phone className="size-4" aria-hidden /> Call</Button><Button href={whatsappLink(selected.phone, `Hi ${selected.name}, this is Future Solutions.`)} variant="secondary" size="sm"><MessageCircle className="size-4" aria-hidden /> WhatsApp</Button></>) : null}
                </div>
              </div>
              <div className="flex flex-col gap-4 md:col-span-2">
                <Field label="Status" htmlFor="lead-status">
                  <Select id="lead-status" value={selected.status} onChange={(e) => { const v = e.target.value as LeadStatus; setSelected({ ...selected, status: v }); run(() => updateLeadStatus(selected.id, v), `Marked as ${v}`); }}>
                    {statuses.map((s) => (<option key={s} value={s} className="capitalize">{s}</option>))}
                  </Select>
                </Field>
                <Field label="Assigned to" htmlFor="lead-assign">
                  <Select id="lead-assign" value={selected.assigned_to ?? ""} onChange={(e) => { const v = e.target.value || null; setSelected({ ...selected, assigned_to: v }); run(() => assignLead(selected.id, v), "Assignment saved"); }}>
                    <option value="">Unassigned</option>
                    {team.map((t) => (<option key={t.id} value={t.id}>{t.full_name ?? t.email}</option>))}
                  </Select>
                </Field>
                <Field label="Internal notes" htmlFor="lead-notes">
                  <Textarea id="lead-notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-32" placeholder="Call summary, next steps…" />
                </Field>
                <Button type="button" size="sm" disabled={pending} onClick={() => run(() => updateLeadNotes(selected.id, notes), "Notes saved")}>Save notes</Button>
                <Button type="button" variant="ghost" size="sm" className="mt-auto w-fit text-muted hover:text-orange" onClick={() => setConfirm(true)}><Trash2 className="size-4" aria-hidden /> Delete lead</Button>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
      <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Delete this lead?" description="The lead and its notes are permanently removed." confirmLabel="Delete" pending={pending} onConfirm={() => { if (!selected) return; const id = selected.id; setConfirm(false); setSelected(null); run(() => deleteLead(id)); }} />
    </div>
  );
}
