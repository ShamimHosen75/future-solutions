import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: string };

/** Native <details> accordion: keyboard accessible with no JS. */
export function Faq({ items, className }: { items: FaqItem[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <div className={cn("divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface/40", className)}>
      {items.map((item, i) => (
        <details key={i} className="group" name="faq">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left font-medium text-white transition-colors hover:text-cyan [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <Plus
              aria-hidden
              className="size-5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45 group-open:text-cyan"
            />
          </summary>
          <div className="px-6 pb-6 text-sm leading-relaxed text-muted md:text-base">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
