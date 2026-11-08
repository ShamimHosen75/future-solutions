"use client";

import * as React from "react";
import { gsap } from "./gsap";
import { useMotion } from "./motion-provider";
import { cn } from "@/lib/utils";

type TiltCardProps = React.HTMLAttributes<HTMLElement> & {
  /** Max tilt in degrees. */
  intensity?: number;
  /** Render the rotating gradient border on hover. */
  glowBorder?: boolean;
  /** Classes for the inner wrapper that holds the children (e.g. grid layouts). */
  innerClassName?: string;
  as?: "div" | "article" | "li";
};

/**
 * Glass card with 3D tilt, cursor spotlight and a moving gradient border.
 * The spotlight is driven by the --mx/--my CSS variables set on pointer move.
 */
export function TiltCard({
  children,
  className,
  intensity = 7,
  glowBorder = true,
  innerClassName,
  as: Tag = "div",
  ...rest
}: TiltCardProps) {
  const ref = React.useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();

  React.useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
    gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      rx((0.5 - py) * intensity * 2);
      ry((px - 0.5) * intensity * 2);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [intensity, reducedMotion]);

  const Element = Tag as unknown as React.ElementType;
  return (
    <Element
      ref={ref}
      className={cn(
        "tilt-card glass group/card relative rounded-[var(--radius-lg)]",
        glowBorder && "gradient-border-animated [--gba-opacity:0] hover:[--gba-opacity:1]",
        className,
      )}
      {...rest}
    >
      <span aria-hidden className="spotlight pointer-events-none absolute inset-0 rounded-[inherit]" />
      <div className={cn("relative h-full", innerClassName)} style={{ transform: "translateZ(24px)" }}>
        {children}
      </div>
    </Element>
  );
}
