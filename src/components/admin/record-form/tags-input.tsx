"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type TagsInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  id?: string;
  invalid?: boolean;
};

/** Chip input: Enter or comma adds, Backspace on empty removes the last item. */
export function TagsInput({ value, onChange, placeholder = "Type and press Enter", id, invalid }: TagsInputProps) {
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commit = () => {
    const items = draft.split(",").map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    onChange([...value, ...items.filter((i) => !value.includes(i))]);
    setDraft("");
  };

  return (
    <div
      className={cn(
        "flex min-h-11 flex-wrap items-center gap-1.5 rounded-[var(--radius-md)] border border-border bg-surface/60 px-2 py-1.5 focus-within:border-cyan/60",
        invalid && "border-orange/70",
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span key={`${tag}-${i}`} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 py-0.5 pr-1 pl-2.5 text-xs text-silver">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded-full p-0.5 text-muted hover:text-white" aria-label={`Remove ${tag}`}>
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && draft === "" && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-32 flex-1 bg-transparent px-1.5 py-1 text-sm text-white placeholder:text-muted/70 focus:outline-none"
      />
    </div>
  );
}
