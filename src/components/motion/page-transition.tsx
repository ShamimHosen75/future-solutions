"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "./gsap";
import { useMotion } from "./motion-provider";

const WIPE_IN = 0.55;
const WIPE_OUT = 0.7;

/**
 * Gradient wipe between routes. Internal link clicks are intercepted: the
 * panel sweeps up, we navigate, and once the new pathname renders the panel
 * sweeps away. Modifier clicks, hashes, downloads and external links pass through.
 */
export function PageTransition() {
  const ref = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { reducedMotion, lenis } = useMotion();
  const pending = React.useRef<string | null>(null);
  const covering = React.useRef(false);

  // Intercept link clicks.
  React.useEffect(() => {
    if (reducedMotion) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download") || anchor.dataset["noTransition"] !== undefined) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // hash or same page
      if (url.pathname.startsWith("/admin")) return;

      e.preventDefault();
      if (covering.current) return;
      covering.current = true;
      pending.current = url.pathname + url.search;

      const panel = ref.current;
      if (!panel) {
        router.push(pending.current);
        return;
      }
      gsap.killTweensOf(panel);
      gsap.set(panel, { clipPath: "inset(100% 0 0 0)", pointerEvents: "auto" });
      gsap.to(panel, {
        clipPath: "inset(0% 0 0 0)",
        duration: WIPE_IN,
        ease: "power4.inOut",
        onComplete: () => {
          if (pending.current) router.push(pending.current);
        },
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router, reducedMotion]);

  // Reveal the new page.
  React.useEffect(() => {
    const panel = ref.current;
    if (!panel || !covering.current) return;
    covering.current = false;
    pending.current = null;
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    gsap.to(panel, {
      clipPath: "inset(0 0 100% 0)",
      duration: WIPE_OUT,
      ease: "power4.inOut",
      delay: 0.05,
      onComplete: () => gsap.set(panel, { clipPath: "inset(100% 0 0 0)", pointerEvents: "none" }),
    });
  }, [pathname, lenis]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="page-wipe pointer-events-none fixed inset-0 z-[90]"
      style={{ clipPath: "inset(100% 0 0 0)" }}
    >
      <div className="absolute inset-0 bg-bg" />
      <div className="absolute inset-x-0 top-0 h-[18vh] bg-brand-gradient opacity-90 blur-2xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="label text-silver">Future Solutions</span>
      </div>
    </div>
  );
}
