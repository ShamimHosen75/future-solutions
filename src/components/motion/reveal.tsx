"use client";

import * as React from "react";
import { gsap } from "./gsap";
import { useMotion } from "./motion-provider";
import { cn } from "@/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  /** Delay in seconds. */
  delay?: number;
  /** Stagger direct children instead of the wrapper. */
  stagger?: number;
  y?: number;
  as?: "div" | "section" | "ul" | "li" | "article";
};

/** Fade/slide-in on scroll. Use `stagger` to animate children one by one. */
export function Reveal({ children, className, delay = 0, stagger, y = 32, as: Tag = "div", ...rest }: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();

  React.useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const targets = stagger !== undefined ? Array.from(el.children) : [el];
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          delay,
          stagger: stagger ?? 0,
          clearProps: "transform",
          onStart: () => el.classList.add("is-revealed"),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, stagger, y, reducedMotion]);

  const Element = Tag as unknown as React.ElementType;
  return (
    <Element
      ref={ref}
      className={cn("reveal-block", className)}
      data-stagger={stagger !== undefined ? "" : undefined}
      {...rest}
    >
      {children}
    </Element>
  );
}
