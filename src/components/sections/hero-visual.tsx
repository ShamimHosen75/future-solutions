"use client";

import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/ui/logo-mark";

/**
 * The logo mark, floating and tilting toward the pointer.
 * The mark itself is a crisp vector; the soft glow sits on a separate layer behind it.
 * Sits at the bottom of the hero and is cropped by the section edge, like the reference.
 */
export const HeroVisual = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translate3d(${x * 16}px, ${y * 10}px, 0)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div data-hero-logo className="relative mx-auto -mb-16 w-[min(70vw,400px)] pt-6 sm:-mb-24">
      <div aria-hidden className="absolute inset-[8%] rounded-full bg-[conic-gradient(from_200deg,#fd4d00,#ffb547,#00d4ff,#006bc8,#fd4d00)] opacity-45 blur-[90px] motion-safe:animate-[spin_18s_linear_infinite]" />
      <div ref={ref} className="relative transition-transform duration-700 ease-out will-change-transform">
        <div className="motion-safe:animate-[float_7s_ease-in-out_infinite]">
          <LogoMark
            id="hero-logo"
            title="Future Solutions logo"
            className="h-auto w-full drop-shadow-[0_24px_48px_rgb(253_77_0/0.35)]"
          />
        </div>
      </div>
    </div>
  );
};
