"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const revealOffsets: Record<string, { x: number; y: number; scale: number }> = {
  left: { x: -60, y: 0, scale: 1 },
  right: { x: 60, y: 0, scale: 1 },
  scale: { x: 0, y: 24, scale: 0.9 },
  blur: { x: 0, y: 16, scale: 1 },
};
const revealFrom = (el: HTMLElement) => revealOffsets[el.dataset.reveal ?? ""] ?? { x: 0, y: 40, scale: 1 };

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Global motion layer:
 * - Lenis smooth scrolling on fine-pointer devices, synced to GSAP's ticker
 * - `[data-split]` headings: words slide up from a mask when they enter the viewport
 * - `[data-reveal]` elements: fade in, staggered when they enter together. The value picks the direction:
 *   "" (rise), "left", "right", "scale" or "blur"
 * - `[data-clip]` media: wiped in from the bottom while the content inside settles from a slight zoom
 * - `[data-parallax="0.2"]` decoration: drifts against the scroll at the given speed
 * - `[data-zoom]` blocks: grow from 90% to full size as they scroll into view
 * - `[data-kinetic]` text: words light up one by one as the block scrolls past
 * - `[data-progress-line]` elements: scale from 0 to 1 along X as their parent scrolls through view
 * - `[data-scroll-progress]` bar: fills with page scroll
 * - `[data-magnetic]` elements: pull gently toward the pointer
 * Scroll animations are rebuilt on every route change. Everything is skipped under prefers-reduced-motion.
 */
export const MotionProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth scrolling: set up once for the whole session.
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
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
          rotation: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.055,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            {
              opacity: 0,
              x: (_: number, el: HTMLElement) => revealFrom(el).x,
              y: (_: number, el: HTMLElement) => revealFrom(el).y,
              scale: (_: number, el: HTMLElement) => revealFrom(el).scale,
              filter: (_: number, el: HTMLElement) => (el.dataset.reveal === "blur" ? "blur(14px)" : "blur(0px)"),
            },
            { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", duration: 1, ease: "power3.out", stagger: 0.09, overwrite: true, clearProps: "filter" },
          ),
      });

      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 1.25rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", duration: 1.2, ease: "expo.out" });
        if (el.firstElementChild) tl.fromTo(el.firstElementChild, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0);
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.15;
        gsap.fromTo(
          el,
          { y: () => -speed * window.innerHeight * 0.5 },
          { y: () => speed * window.innerHeight * 0.5, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-zoom]").forEach((el) => {
        gsap.fromTo(el, { scale: 0.9, borderRadius: "3rem" }, { scale: 1, borderRadius: "1.75rem", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true } });
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

      gsap.utils.toArray<HTMLElement>("[data-scroll-progress]").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
      });

      // Hero logo: rises and settles on first paint.
      gsap.utils.toArray<HTMLElement>("[data-hero-logo]").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 120, scale: 0.8, rotation: -8 }, { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1.6, ease: "expo.out", delay: 0.3 });
      });
    });

    // Magnetic buttons and cards (fine pointers only).
    const magnets = window.matchMedia("(pointer: fine)").matches ? gsap.utils.toArray<HTMLElement>("[data-magnetic]") : [];
    const cleanups = magnets.map((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const strength = Number(el.dataset.magnetic) || 0.3;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * strength);
        yTo((e.clientY - r.top - r.height / 2) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        gsap.set(el, { x: 0, y: 0 });
      };
    });

    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    // Fonts and images can shift layout after first paint.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", refresh);
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [pathname]);

  return <>{children}</>;
};
