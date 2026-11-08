"use client";

import * as React from "react";
import { gsap } from "./gsap";
import { useMotion } from "./motion-provider";
import { hasFinePointer } from "@/lib/motion/device";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor]";

/**
 * Dot + ring cursor for fine-pointer devices. The ring eases behind the
 * pointer and grows over interactive elements; touch devices never mount it.
 */
export function CustomCursor() {
  const dotRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = React.useState(false);
  const { reducedMotion } = useMotion();

  React.useEffect(() => {
    setEnabled(hasFinePointer() && !reducedMotion);
  }, [reducedMotion]);

  React.useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    let visible = false;
    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
    };
    const hide = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      show();
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const target = (e.target as Element | null)?.closest(INTERACTIVE);
      const text = target?.getAttribute("data-cursor") ?? "";
      const isText = target && /^(input|textarea)$/i.test(target.tagName);
      label.textContent = text;
      gsap.to(ring, {
        scale: isText ? 0.5 : text ? 2.4 : target ? 1.7 : 1,
        duration: 0.35,
        ease: "power3.out",
      });
      ring.classList.toggle("is-label", Boolean(text));
      dot.style.opacity = text ? "0" : "1";
    };
    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.35 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} aria-hidden className="cursor-dot" />
      <div ref={ringRef} aria-hidden className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}
