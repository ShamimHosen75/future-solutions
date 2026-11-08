"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/field";
import type { MediaItem } from "@/types/content";

/** Lightweight grid of uploads for selecting an existing file. */
export function MediaPicker({ onSelect }: { onSelect: (url: string, item: MediaItem) => void }) {
  const [items, setItems] = React.useState<MediaItem[] | null>(null);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    createClient()
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        if (!cancelled) setItems(data ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = (items ?? []).filter((m) => `${m.alt ?? ""} ${m.path}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name…" className="pl-10" aria-label="Search media" />
      </div>
      {items === null ? (
        <div className="flex justify-center py-12 text-muted"><Loader2 className="size-5 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">No uploads yet.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {filtered.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => onSelect(m.url, m)} className="group relative block aspect-square w-full overflow-hidden rounded-[var(--radius-sm)] border border-border hover:border-cyan/60 focus:outline-2 focus:outline-cyan">
                {m.mime_type?.startsWith("image/") ? (
                  <Image src={m.url} alt={m.alt ?? ""} fill sizes="150px" className="object-cover transition group-hover:scale-105" />
                ) : (
                  <span className="flex size-full items-center justify-center text-xs text-muted">{m.mime_type}</span>
                )}
              </button>
              <p className="mt-1 truncate text-[0.65rem] text-muted">{m.alt ?? m.path.split("/").pop()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
