"use client";

import * as React from "react";
import { gsap } from "./gsap";
import { useMotion } from "./motion-provider";
import { cn } from "@/lib/utils";

type CounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  locale?: string;
};

/** Animates from 0 to `value` the first time it scrolls into view. */
export function Counter({ value, suffix = "", prefix = "", duration = 2, className, locale = "en-US" }: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const { reducedMotion } = useMotion();
  const formatter = React.useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }), [locale]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      el.textContent = formatter.format(value);
      return;
    }
    const state = { n: 0 };
    const tween = gsap.to(state, {
      n: value,
      duration,
      ease: "power3.out",
      paused: true,
      onUpdate: () => {
        el.textContent = formatter.format(Math.round(state.n));
      },
    });
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          tween.play();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      tween.kill();
    };
  }, [value, duration, reducedMotion, formatter]);

  return (
    <span className={cn("tabular", className)}>
      {prefix}
      <span ref={ref} aria-label={formatter.format(value)}>
        {reducedMotion ? formatter.format(value) : 0}
      </span>
      {suffix ? <span className="text-gradient">{suffix}</span> : null}
    </span>
  );
}
