"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/motion-provider";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/service-icon";
import { TiltCard } from "@/components/motion/tilt-card";
import { asStringArray } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/content";

/**
 * Pinned services showcase. On large screens the section pins while cards
 * enter one by one, stacking behind each other; smaller screens and
 * reduced-motion get a plain grid.
 */
export function ServicesPinned({ services }: { services: Service[] }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [index, setIndex] = React.useState(0);
  const { reducedMotion } = useMotion();
  const count = services.length;

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section || count < 2 || reducedMotion) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]", section);
      const progress = section.querySelector<HTMLElement>("[data-progress]");

      gsap.set(cards, { yPercent: (i) => (i === 0 ? 0 : 130), rotateX: (i) => (i === 0 ? 0 : -12), opacity: (i) => (i === 0 ? 1 : 0) });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${(count - 1) * 90}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(count - 1, Math.round(self.progress * (count - 1)));
            setIndex(i);
            if (progress) progress.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.to(cards[i - 1]!, { scale: 0.9, yPercent: -10, opacity: 0.18, filter: "blur(3px)", duration: 1 }, i - 1)
          .to(card, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1 }, i - 1);
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, [count, reducedMotion]);

  // Re-measure after fonts/images load.
  React.useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, []);

  if (count === 0) return null;
  const current = services[index] ?? services[0]!;

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 lg:h-dvh lg:min-h-[720px] lg:py-0"
      aria-labelledby="services-heading"
    >
      <Container className="grid gap-12 lg:h-full lg:grid-cols-12 lg:items-center">
        {/* Left: sticky copy */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <span className="label inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-6 bg-brand-gradient" />
            What we do
          </span>
          <h2 id="services-heading" className="font-display text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.05] font-semibold">
            Six disciplines. <span className="text-gradient animate-gradient-shift">One partner.</span>
          </h2>
          <p className="max-w-md text-muted">
            From first pixel to production, every service is delivered by the same team that trains the next
            generation of engineers in our academy.
          </p>

          <div className="hidden lg:block">
            <div className="mt-4 flex items-center gap-4">
              <span className="tabular text-sm text-silver">
                {String(index + 1).padStart(2, "0")}
                <span className="text-muted"> / {String(count).padStart(2, "0")}</span>
              </span>
              <span className="relative h-px flex-1 bg-border">
                <span data-progress className="absolute inset-0 origin-left bg-brand-gradient" style={{ transform: "scaleX(0)" }} />
              </span>
            </div>
            <p key={current.id} className="mt-6 font-display text-lg text-white transition-opacity">
              {current.title}
            </p>
          </div>

          <div className="mt-2">
            <Button href="/services" variant="outline">
              All services
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        {/* Right: card stack (desktop) / grid (mobile) */}
        <div className="lg:col-span-7">
          <ul
            className={cn(
              "grid gap-5 sm:grid-cols-2",
              "lg:relative lg:block lg:h-[min(520px,70vh)] lg:[perspective:1400px]",
            )}
          >
            {services.map((service, i) => (
              <li key={service.id} data-service-card className="lg:absolute lg:inset-0 lg:will-change-transform">
                <ServiceCard service={service} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const features = asStringArray(service.features).slice(0, 4);
  return (
    <Link href={`/services/${service.slug}`} className="group block h-full" data-cursor="View">
      <TiltCard as="article" className="flex h-full flex-col gap-6 p-6 md:p-8 lg:p-10">
        <div className="flex items-start justify-between">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.04] text-cyan ring-1 ring-border md:size-14">
            <ServiceIcon name={service.icon} className="size-6" />
          </span>
          <span className="tabular text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-display text-xl font-semibold text-white md:text-2xl">{service.title}</h3>
          <p className="text-sm leading-relaxed text-muted md:text-base">{service.short_description}</p>
        </div>
        {features.length > 0 ? (
          <ul className="hidden flex-wrap gap-2 lg:flex">
            {features.map((f) => (
              <li key={f} className="rounded-full border border-border px-3 py-1 text-xs text-silver">
                {f}
              </li>
            ))}
          </ul>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-silver transition-colors group-hover:text-white">
          {service.starting_price ? (
            <>
              From <span className="tabular text-white"><span className="font-sans">৳</span>{Number(service.starting_price).toLocaleString()}</span>
            </>
          ) : (
            "Learn more"
          )}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </TiltCard>
    </Link>
  );
}
