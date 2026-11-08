"use client";

import * as React from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { detectMotionTier, prefersReducedMotion, type MotionTier } from "@/lib/motion/device";

type MotionContextValue = {
  lenis: Lenis | null;
  /** True once the preloader (if any) has finished and entrance animations may run. */
  ready: boolean;
  setReady: (value: boolean) => void;
  reducedMotion: boolean;
  tier: MotionTier;
  /** True once tier detection has run on the client. */
  hydrated: boolean;
};

const MotionContext = React.createContext<MotionContextValue>({
  lenis: null,
  ready: false,
  setReady: () => {},
  reducedMotion: false,
  tier: "static",
  hydrated: false,
});

export function useMotion() {
  return React.useContext(MotionContext);
}

/**
 * Owns Lenis smooth scrolling, keeps GSAP ScrollTrigger in sync with it and
 * exposes motion preferences to every animated component.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = React.useState<Lenis | null>(null);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [tier, setTier] = React.useState<MotionTier>("static");
  const [hydrated, setHydrated] = React.useState(false);
  // If the preloader is going to show, it flips `ready` itself; otherwise we're ready at once.
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const reduced = prefersReducedMotion();
    setReducedMotion(reduced);
    setTier(detectMotionTier());
    setHydrated(true);

    const willPreload = document.documentElement.dataset["preload"] === "1";
    if (!willPreload) setReady(true);

    if (reduced) return;

    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      anchors: true,
    });

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Fonts and images can shift layout after pinned sections measure themselves.
  React.useEffect(() => {
    if (!hydrated) return;
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, [hydrated]);

  const value = React.useMemo<MotionContextValue>(
    () => ({ lenis, ready, setReady, reducedMotion, tier, hydrated }),
    [lenis, ready, reducedMotion, tier, hydrated],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
