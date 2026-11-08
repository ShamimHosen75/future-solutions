"use client";

import * as React from "react";
import { gsap } from "./gsap";
import { useMotion } from "./motion-provider";

export const PRELOAD_KEY = "fs:visited";
const F_PATH = "M52 56h84v26H82v34h46v26H82v58H52z";
const S_PATH =
  "M204 86c-6-16-21-27-44-27-26 0-45 14-45 36 0 20 13 30 40 37l10 3c13 4 17 8 17 15 0 8-8 14-21 14-14 0-24-7-27-19l-27 7c6 23 26 38 54 38 29 0 49-15 49-40 0-21-13-32-38-39l-12-3c-12-3-17-7-17-13 0-7 7-12 17-12 11 0 18 5 21 13z";

/**
 * First-visit preloader: the F and S strokes draw themselves, fill in, then
 * the overlay wipes away. The inline script in the root layout sets
 * `data-preload="1"` on <html> before paint when the visitor is new, and the
 * CSS keeps this overlay hidden otherwise, so returning visitors never see it.
 */
export function Preloader() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { setReady, lenis, reducedMotion } = useMotion();
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    const shouldRun = root.dataset["preload"] === "1";
    if (!shouldRun) return;

    const finish = () => {
      try {
        localStorage.setItem(PRELOAD_KEY, String(Date.now()));
      } catch {
        /* storage unavailable */
      }
      delete root.dataset["preload"];
      setActive(false);
      setReady(true);
      lenis?.start();
    };

    if (reducedMotion) {
      finish();
      return;
    }

    setActive(true);
    lenis?.stop();
    const el = ref.current;
    if (!el) {
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      const strokes = el.querySelectorAll<SVGPathElement>("[data-stroke]");
      const fills = el.querySelectorAll<SVGPathElement>("[data-fill]");
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      });
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(strokes, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.15 })
        .to(fills, { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
        .to(strokes, { opacity: 0, duration: 0.4 }, "<")
        .to(el.querySelector("[data-tagline]"), { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(el.querySelector("[data-logo]"), { scale: 0.9, y: -20, duration: 0.6, ease: "power3.in" }, "+=0.25")
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power4.inOut" }, "-=0.3");
    }, el);

    return () => ctx.revert();
  }, [setReady, lenis, reducedMotion]);

  return (
    <div
      ref={ref}
      aria-hidden={!active}
      role={active ? "status" : undefined}
      aria-label={active ? "Loading Future Solutions" : undefined}
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-bg"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      <div data-logo className="flex flex-col items-center gap-8">
        <svg viewBox="0 0 256 256" width="160" height="160" className="overflow-visible">
          <defs>
            <linearGradient id="pl-silver" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.35" stopColor="#D9DDE3" />
              <stop offset="0.6" stopColor="#8A93A3" />
              <stop offset="1" stopColor="#E8EBEF" />
            </linearGradient>
            <linearGradient id="pl-brand" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0A3DFF" />
              <stop offset="0.45" stopColor="#12C8FF" />
              <stop offset="0.7" stopColor="#FF5A0A" />
              <stop offset="1" stopColor="#FFA31A" />
            </linearGradient>
          </defs>
          <path data-fill d={F_PATH} fill="url(#pl-silver)" opacity="0" />
          <path data-fill d={S_PATH} fill="url(#pl-brand)" opacity="0" />
          <path data-stroke d={F_PATH} fill="none" stroke="url(#pl-silver)" strokeWidth="2" />
          <path data-stroke d={S_PATH} fill="none" stroke="url(#pl-brand)" strokeWidth="2" />
        </svg>
        <p data-tagline className="label translate-y-3 opacity-0" style={{ visibility: "hidden" }}>
          Smart Solutions. Lasting Impact.
        </p>
      </div>
    </div>
  );
}
