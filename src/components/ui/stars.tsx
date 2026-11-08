import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ rating, className, size = 14 }: { rating: number; className?: string; size?: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          aria-hidden
          className={i < value ? "fill-amber text-amber" : "fill-transparent text-muted/50"}
        />
      ))}
    </span>
  );
}
