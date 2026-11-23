"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * The glowing logo mark, floating and tilting toward the pointer.
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
    <div className="relative mx-auto -mb-24 w-[min(88vw,560px)] sm:-mb-32">
      <div aria-hidden className="absolute inset-[18%] rounded-full bg-[conic-gradient(from_200deg,#fd4d00,#ffb547,#00d4ff,#006bc8,#fd4d00)] opacity-40 blur-[80px] motion-safe:animate-[spin_18s_linear_infinite]" />
      <div ref={ref} className="relative transition-transform duration-700 ease-out will-change-transform">
        <div className="motion-safe:animate-[float_7s_ease-in-out_infinite]">
          <Image
            src="/brand/logo-hero.webp"
            alt="Future Solutions logo mark"
            width={1152}
            height={768}
            priority
            sizes="(max-width: 640px) 88vw, 560px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
};
