import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TextReveal } from "@/components/motion/text-reveal";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { HeroCanvas } from "@/components/three/hero-canvas";
import type { SiteSettings } from "@/types/content";

export function Hero({ homepage }: { homepage: SiteSettings["homepage"] }) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div aria-hidden className="bg-vignette absolute inset-0" />
      <div
        aria-hidden
        className="bg-grid absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000,transparent)]"
      />
      <Container className="relative grid min-h-[calc(100dvh-var(--header-h))] items-center gap-10 py-16 lg:grid-cols-12 lg:gap-6 lg:py-20">
        <div className="order-2 flex flex-col gap-8 lg:order-1 lg:col-span-7">
          <Reveal delay={0.2} y={12}>
            <span className="label inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-brand-gradient" />
              {homepage.heroEyebrow}
            </span>
          </Reveal>

          <TextReveal
            as="h1"
            id="hero-heading"
            trigger="mount"
            delay={0.1}
            text={"Smart Solutions.\nLasting Impact."}
            highlight={["Lasting", "Impact"]}
            wordClassName="text-silver-gradient"
            className="font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] font-bold"
          />

          <Reveal delay={0.7}>
            <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg">{homepage.heroSubtitle}</p>
          </Reveal>

          <Reveal delay={0.85}>
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/contact?intent=quote" size="lg" data-cursor="Let's go">
                Start a project
                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                Explore services
              </Button>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <dl className="mt-2 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {homepage.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="label order-2">{stat.label}</dt>
                  <dd className="order-1 text-3xl font-semibold text-white">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="order-1 mx-auto w-full max-w-[280px] sm:max-w-sm lg:order-2 lg:col-span-5 lg:max-w-none">
          <HeroCanvas />
        </div>
      </Container>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </section>
  );
}
