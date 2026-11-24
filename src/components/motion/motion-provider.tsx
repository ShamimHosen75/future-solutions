"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Global motion layer:
 * - Lenis smooth scrolling on fine-pointer devices, synced to GSAP's ticker
 * - `[data-split]` headings: words slide up from a mask when they enter the viewport
 * - `[data-reveal]` elements: fade and rise, staggered when they share a parent
 * - `[data-kinetic]` text: words light up one by one as the block scrolls past
 * - `[data-progress-line]` elements: scale from 0 to 1 along X as their parent scrolls through view
 * Scroll animations are rebuilt on every route change. Everything is skipped under prefers-reduced-motion.
 */
export const MotionProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth scrolling: set up once for the whole session.
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;

    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
    lenisRef.current = lenis;
    const tick = (time: number) => lenis.raf(time * 1000);
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
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll animations: rebuilt for each page.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      const target = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null;
      if (target) lenis.scrollTo(target, { offset: -80, immediate: true, force: true });
      else lenis.scrollTo(0, { immediate: true, force: true });
      lenis.resize();
    }
    if (prefersReducedMotion()) return;

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

      gsap.utils.toArray<HTMLElement>("[data-kinetic]").forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll(".kinetic-word"),
          { opacity: 0.15 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-progress-line]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top 75%", end: "bottom 50%", scrub: true } },
        );
      });
    });

    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    // Fonts and images can shift layout after first paint.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [pathname]);

  return <>{children}</>;
};
