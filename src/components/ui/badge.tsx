import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wider uppercase",
  {
    variants: {
      tone: {
        neutral: "border-border text-muted",
        cyan: "border-cyan/30 bg-cyan/10 text-cyan",
        amber: "border-amber/30 bg-amber/10 text-amber",
        orange: "border-orange/30 bg-orange/10 text-orange",
        white: "border-border-strong bg-white/5 text-white",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({ className, tone, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
