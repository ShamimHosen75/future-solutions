"use client";

import * as React from "react";
import { gsap } from "./gsap";
import { useMotion } from "./motion-provider";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  /** Words (case-insensitive, punctuation ignored) that receive the gradient sweep. */
  highlight?: string[];
  /** Class applied to every non-highlighted word (e.g. a silver gradient). */
  wordClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Seconds to wait after `ready` before revealing. */
  delay?: number;
  /** Reveal on mount (hero) or when scrolled into view (default). */
  trigger?: "mount" | "view";
  id?: string;
};

/**
 * Word-by-word mask reveal. Each word sits in an overflow-hidden wrapper and
 * slides up from below; highlighted words get the animated brand gradient.
 */
export function TextReveal({
  text,
  highlight = [],
  as: Tag = "h2",
  className,
  delay = 0,
  trigger = "view",
  id,
  wordClassName,
}: TextRevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const { ready, reducedMotion } = useMotion();
  const highlightSet = React.useMemo(
    () => new Set(highlight.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase())),
    [highlight],
  );

  // Split into lines on "\n" and words on spaces so authors can control wraps.
  const lines = React.useMemo(() => text.split("\n").map((line) => line.split(/\s+/).filter(Boolean)), [text]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    if (reducedMotion) {
      gsap.set(words, { yPercent: 0, clearProps: "transform" });
      el.classList.add("is-revealed");
      return;
    }
    if (trigger === "mount" && !ready) return;

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        words,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.055,
          delay,
          onStart: () => el.classList.add("is-revealed"),
          onComplete: () => gsap.set(words, { clearProps: "transform" }),
          ...(trigger === "view"
            ? { scrollTrigger: { trigger: el, start: "top 85%", once: true } }
            : {}),
        },
      );
      return () => tween.kill();
    }, el);
    return () => ctx.revert();
  }, [ready, reducedMotion, delay, trigger]);

  return (
    <Tag ref={ref as React.RefObject<never>} id={id} className={cn("reveal-text", className)}>
      {lines.map((words, li) => (
        <span key={li} className="block">
          {words.map((word, wi) => {
            const clean = word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
            const isHighlight = highlightSet.has(clean);
            return (
              <span key={`${li}-${wi}`} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                <span
                  data-word
                  className={cn(
                    "reveal-word inline-block will-change-transform",
                    isHighlight ? "text-gradient animate-gradient-shift" : wordClassName,
                  )}
                >
                  {word}
                </span>
                {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
