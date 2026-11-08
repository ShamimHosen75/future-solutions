"use client";

import * as React from "react";
import { useMotion } from "./motion-provider";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  /** Pixels per second. */
  speed?: number;
  /** Speed multiplier while hovered. */
  hoverFactor?: number;
  direction?: "left" | "right";
  className?: string;
  gap?: string;
};

/**
 * Infinite marquee driven by requestAnimationFrame so speed can ease smoothly
 * when the pointer hovers (CSS duration changes would jump).
 */
export function Marquee({
  children,
  speed = 60,
  hoverFactor = 0.2,
  direction = "left",
  className,
  gap = "3rem",
}: MarqueeProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotion();
  const hovered = React.useRef(false);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    let x = 0;
    let current = speed;
    let raf = 0;
    let last = performance.now();
    const dir = direction === "left" ? -1 : 1;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const target = hovered.current ? speed * hoverFactor : speed;
      current += (target - current) * Math.min(1, dt * 6);
      const half = track.scrollWidth / 2;
      x += dir * current * dt;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      track.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [speed, hoverFactor, direction, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className={cn("flex flex-wrap items-center justify-center", className)} style={{ gap }}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]",
        className,
      )}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <div ref={trackRef} className="flex w-max items-center will-change-transform" style={{ gap }}>
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" style={{ gap }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
