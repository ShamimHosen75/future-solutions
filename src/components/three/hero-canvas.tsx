"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useMotion } from "@/components/motion/motion-provider";
import { HeroFallback } from "./hero-fallback";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false, loading: () => null });

/**
 * Chooses between the WebGL hero and the static fallback. Three.js is only
 * downloaded on capable desktops; rendering pauses while scrolled away.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const { tier, hydrated, reducedMotion } = useMotion();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(true);
  const [sceneReady, setSceneReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      rootMargin: "100px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // If WebGL context creation throws, fall back gracefully.
  React.useEffect(() => {
    const onError = (e: ErrorEvent) => {
      if (/WebGL|THREE/i.test(e.message)) setFailed(true);
    };
    window.addEventListener("error", onError);
    return () => window.removeEventListener("error", onError);
  }, []);

  const useScene = hydrated && tier === "full" && !failed;

  return (
    <div ref={wrapRef} className={cn("relative aspect-square w-full", className)}>
      {/* Fallback always renders first so there is never an empty frame; fades out once WebGL paints. */}
      <HeroFallback
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          useScene && sceneReady ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      />
      {useScene ? (
        <div className={cn("absolute inset-[-20%] transition-opacity duration-700", sceneReady ? "opacity-100" : "opacity-0")}>
          <HeroScene active={inView} reducedMotion={reducedMotion} onReady={() => setSceneReady(true)} />
        </div>
      ) : null}
    </div>
  );
}
