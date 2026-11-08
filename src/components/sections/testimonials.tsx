import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { initials } from "@/lib/content";
import type { Testimonial } from "@/types/content";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  const average = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <section className="py-24 md:py-32" aria-labelledby="testimonials-heading">
      <Container>
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Client reviews"
            title={
              <span id="testimonials-heading">
                Don&apos;t take <span className="text-gradient">our word</span> for it.
              </span>
            }
          />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="tabular text-3xl font-semibold text-white">{average.toFixed(1)}</p>
              <Stars rating={average} />
            </div>
            <Button href="/clients#review" variant="outline" size="sm">
              Leave a review
            </Button>
          </div>
        </Reveal>

        <Reveal as="ul" stagger={0.1} className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.id}>
              <TiltCard as="article" intensity={5} className="flex h-full flex-col gap-5 p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <Stars rating={t.rating} />
                  <Quote className="size-5 text-muted/60" aria-hidden />
                </div>
                <blockquote className="text-sm leading-relaxed text-silver md:text-base">“{t.content}”</blockquote>
                <footer className="mt-auto flex items-center gap-3 border-t border-border pt-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-display text-xs font-bold text-white">
                    {initials(t.author_name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{t.author_name}</p>
                    <p className="truncate text-xs text-muted">
                      {[t.author_role, t.author_company].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </footer>
              </TiltCard>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
