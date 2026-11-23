"use client";

import { useEffect, useState } from "react";
import { clientProof } from "@/content/home";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Play } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const ROTATE_MS = 7000;

/** Client logo tabs on the left switch the video testimonial and quote. Auto-advances until the user picks one. */
export const ClientProof = () => {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const item = clientProof.items[active] ?? clientProof.items[0]!;

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % clientProof.items.length), ROTATE_MS);
    return () => clearTimeout(id);
  }, [active, auto]);

  return (
    <Section tone="dark" className="pt-8 sm:pt-12">
      <Container>
        <SectionHeading eyebrow={clientProof.eyebrow} title={clientProof.title} tone="dark" />
        <div data-reveal className="grid gap-6 md:grid-cols-[150px_minmax(0,300px)_1fr] md:items-start lg:gap-8">
          <div role="tablist" aria-label="Clients" className="no-scrollbar flex gap-3 overflow-x-auto md:flex-col">
            {clientProof.items.map((c, i) => (
              <button
                key={c.brand}
                role="tab"
                aria-selected={i === active}
                aria-controls="client-proof-panel"
                onClick={() => {
                  setActive(i);
                  setAuto(false);
                }}
                className={cn(
                  "relative flex h-16 min-w-32 items-center justify-center overflow-hidden rounded-xl border text-sm font-semibold transition-colors duration-300",
                  i === active ? "border-orange-500/60 bg-white/10 text-white" : "border-white/10 bg-white/[0.03] text-white/50 hover:text-white",
                )}
              >
                {c.brand}
                {i === active && auto ? (
                  <span
                    key={`progress-${active}`}
                    aria-hidden
                    className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-orange motion-safe:animate-[progress_linear_forwards]"
                    style={{ animationDuration: `${ROTATE_MS}ms` }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          <div id="client-proof-panel" role="tabpanel" className="contents">
            <div key={`video-${active}`} className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-gradient-blue motion-safe:animate-[fade-in_0.6s_ease-out]">
              <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,rgb(255_255_255/0.25),transparent)]" />
              <span className="absolute left-1/2 top-[38%] flex size-24 -translate-x-1/2 items-center justify-center rounded-full bg-ink/70 text-3xl font-semibold text-white ring-1 ring-white/20">
                {item.brand.slice(-1)}
              </span>
              <span className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 text-xs text-white/80">
                <span className="flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <Play className="ml-0.5 size-4" />
                </span>
                Video testimonial placeholder
              </span>
            </div>

            <div key={`quote-${active}`} className="motion-safe:animate-[fade-in_0.6s_ease-out]">
              <blockquote className="text-xl leading-snug font-medium tracking-tight text-pretty sm:text-2xl">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/75 ring-1 ring-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-6 font-semibold">{item.name}</p>
              <p className="text-sm text-muted-dark">{item.role}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
