import * as React from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Show a static gradient border (default) or an animated rotating one. */
  border?: "static" | "animated" | "none";
  padding?: "none" | "sm" | "md" | "lg";
};

const paddings = { none: "", sm: "p-5", md: "p-6 md:p-8", lg: "p-8 md:p-10" } as const;

export function GlassCard({
  className,
  border = "static",
  padding = "md",
  children,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-[var(--radius-lg)]",
        border === "static" && "gradient-border [--gb-opacity:0.35] hover:[--gb-opacity:0.9]",
        border === "animated" && "gradient-border-animated",
        paddings[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
