import * as React from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="label inline-flex items-center gap-3">
          <span aria-hidden className="h-px w-6 bg-brand-gradient" />
          {eyebrow}
        </span>
      ) : null}
      <Tag
        className={cn(
          "font-display font-semibold text-white",
          Tag === "h1"
            ? "text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.02]"
            : "text-[clamp(1.75rem,4vw,3rem)] leading-[1.08]",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p className={cn("max-w-2xl text-base leading-relaxed text-muted md:text-lg")}>{description}</p>
      ) : null}
    </div>
  );
}
