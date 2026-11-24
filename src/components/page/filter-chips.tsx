"use client";

import { cn } from "@/lib/cn";

/** Pill-shaped single-choice filter, used on the Work and Blog pages. */
export const FilterChips = ({
  options,
  value,
  onChange,
  label,
  counts,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  counts?: Record<string, number>;
}) => (
  <div role="group" aria-label={label} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
    {options.map((option) => {
      const active = option === value;
      return (
        <button
          key={option}
          type="button"
          aria-pressed={active}
          onClick={() => onChange(option)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-[background-color,border-color,color] duration-300 active:scale-[0.97]",
            active ? "border-ink bg-ink text-white" : "border-line bg-white text-text/80 hover:border-text/40",
          )}
        >
          {option}
          {counts?.[option] !== undefined ? (
            <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", active ? "bg-white/15" : "bg-paper text-muted")}>{counts[option]}</span>
          ) : null}
        </button>
      );
    })}
  </div>
);
