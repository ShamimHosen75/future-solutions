import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Infinite CSS marquee. Children are rendered twice and the track slides by -50%,
 * so the loop is seamless. Pauses on hover; stops under reduced motion.
 */
export const Marquee = ({
  children,
  reverse = false,
  duration = 40,
  className,
  gapClass = "gap-4",
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
  gapClass?: string;
}) => (
  <div className={cn("pause-on-hover mask-fade-x overflow-hidden", className)}>
    <div
      className={cn("flex w-max", reverse ? "animate-marquee-reverse" : "animate-marquee")}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className={cn("flex shrink-0 items-stretch pr-4", gapClass)}>{children}</div>
      <div className={cn("flex shrink-0 items-stretch pr-4", gapClass)} aria-hidden>
        {children}
      </div>
    </div>
  </div>
);
