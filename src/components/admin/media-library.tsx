"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Copy, FileText, Loader2, Search, Trash2, Upload } from "lucide-react";
import { deleteMedia, updateMediaAlt } from "@/app/actions/media";
import { uploadMedia } from "@/lib/admin/upload";
import { ConfirmDialog } from "@/components/admin/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/admin/ui/dialog";
import { useToast } from "@/components/admin/ui/toast";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { formatDate } from "@/lib/utils";
import type { MediaItem } from "@/types/content";

function formatBytes(n: number | null) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [folder, setFolder] = React.useState("all");
  const [selected, setSelected] = React.useState<MediaItem | null>(null);
  const [confirm, setConfirm] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [alt, setAlt] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const folders = React.useMemo(() => Array.from(new Set(items.map((m) => m.folder))).sort(), [items]);
  const filtered = items.filter((m) => (folder === "all" || m.folder === folder) && `${m.alt ?? ""} ${m.path}`.toLowerCase().includes(query.toLowerCase()));

  React.useEffect(() => setAlt(selected?.alt ?? ""), [selected]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) await uploadMedia(file, "uploads");
      toast({ title: `${files.length} file${files.length > 1 ? "s" : ""} uploaded` });
      router.refresh();
    } catch (e) {
      toast({ title: "Upload failed", description: e instanceof Error ? e.message : String(e), tone: "error" });
    } finally {
      setUploading(false);
    }
  };

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void handleFiles(e.dataTransfer.files); }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files…" className="pl-10" aria-label="Search media" />
        </div>
        <div className="w-full sm:w-44">
          <Select value={folder} onChange={(e) => setFolder(e.target.value)} aria-label="Filter by folder">
            <option value="all">All folders</option>
            {folders.map((f) => (<option key={f} value={f}>{f}</option>))}
          </Select>
        </div>
        <Button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />} Upload
        </Button>
        <input ref={inputRef} type="file" multiple accept="image/*,application/pdf,video/mp4" className="sr-only" onChange={(e) => void handleFiles(e.target.files)} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border px-6 py-20 text-center text-sm text-muted">
          {items.length === 0 ? "No uploads yet. Drop files anywhere on this page or use the Upload button." : "Nothing matches your search."}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => setSelected(m)} className="group relative block aspect-square w-full overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface/60 hover:border-cyan/60 focus:outline-2 focus:outline-cyan">
                {m.mime_type?.startsWith("image/") ? (
                  <Image src={m.url} alt={m.alt ?? ""} fill sizes="(min-width:1024px) 16vw, 33vw" className="object-cover transition group-hover:scale-105" />
                ) : (
                  <span className="flex size-full flex-col items-center justify-center gap-2 text-muted"><FileText className="size-6" /> <span className="text-[0.65rem]">{m.mime_type}</span></span>
                )}
              </button>
              <p className="mt-1.5 truncate text-xs text-silver">{m.alt ?? m.path.split("/").pop()}</p>
              <p className="tabular text-[0.65rem] text-muted">{formatBytes(m.size_bytes)}{m.width ? ` · ${m.width}×${m.height}` : ""}</p>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        {selected ? (
          <DialogContent title={selected.path.split("/").pop() ?? "File"} description={`${selected.folder} · ${formatBytes(selected.size_bytes)} · ${formatDate(selected.created_at)}`} size="lg">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-2">
                {selected.mime_type?.startsWith("image/") ? <Image src={selected.url} alt={selected.alt ?? ""} fill sizes="400px" className="object-contain" /> : <span className="flex size-full items-center justify-center text-muted"><FileText className="size-10" /></span>}
              </div>
              <div className="flex flex-col gap-4">
                <Field label="Alt text" htmlFor="alt" hint="Describe the image for screen readers and SEO.">
                  <Input id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} />
                </Field>
                <Button type="button" variant="secondary" size="sm" className="w-fit" disabled={pending} onClick={() => startTransition(async () => { const r = await updateMediaAlt(selected.id, alt); toast({ title: r.ok ? "Alt text saved" : r.message, tone: r.ok ? "success" : "error" }); router.refresh(); })}>
                  Save alt text
                </Button>
                <Field label="Public URL" htmlFor="url">
                  <div className="flex gap-2">
                    <Input id="url" readOnly value={selected.url} className="font-mono text-xs" />
                    <Button type="button" variant="outline" size="icon" aria-label="Copy URL" onClick={() => void copy(selected.url)}>
                      {copied ? <Check className="size-4 text-cyan" /> : <Copy className="size-4" />}
                    </Button>
                  </div>
                </Field>
                <dl className="grid grid-cols-2 gap-2 text-xs text-muted">
                  <dt>Type</dt><dd className="text-silver">{selected.mime_type ?? "—"}</dd>
                  <dt>Dimensions</dt><dd className="tabular text-silver">{selected.width ? `${selected.width} × ${selected.height}` : "—"}</dd>
                  <dt>Path</dt><dd className="truncate font-mono text-silver">{selected.path}</dd>
                </dl>
                <Button type="button" variant="ghost" size="sm" className="mt-auto w-fit text-muted hover:text-orange" onClick={() => setConfirm(true)}>
                  <Trash2 className="size-4" aria-hidden /> Delete file
                </Button>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Delete this file?" description="The file is removed from storage. Pages still referencing it will show a broken image." confirmLabel="Delete" pending={pending} onConfirm={() => startTransition(async () => { if (!selected) return; const r = await deleteMedia(selected.id); setConfirm(false); setSelected(null); toast({ title: r.ok ? "File deleted" : r.message, tone: r.ok ? "success" : "error" }); router.refresh(); })} />
    </div>
  );
}
