"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global motion layer:
 * - Lenis smooth scrolling on fine-pointer devices, synced to GSAP's ticker
 * - `[data-split]` headings: words slide up from a mask when they enter the viewport
 * - `[data-reveal]` elements: fade and rise, staggered when they share a parent
 * Everything is skipped under prefers-reduced-motion.
 */
export const MotionProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let lenis: Lenis | null = null;
    let removeAnchorHandler = () => {};
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (finePointer) {
      lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Smooth-scroll in-page anchor links.
      const onClick = (e: MouseEvent) => {
        const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        const hash = link?.getAttribute("href");
        if (!link || !hash || hash === "#") return;
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        lenis?.scrollTo(target as HTMLElement, { offset: -80 });
      };
      document.addEventListener("click", onClick);
      removeAnchorHandler = () => document.removeEventListener("click", onClick);
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        gsap.to(el.querySelectorAll(".word-inner"), {
          yPercent: 0,
          y: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(batch, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });
    });

    // Fonts and images can shift layout after first paint.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      ctx.revert();
      window.removeEventListener("load", refresh);
      removeAnchorHandler();
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
};
