import Link from "next/link";
import { services } from "@/content/home";
import { serviceHref } from "@/content/services";
import { Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Marquee } from "@/components/motion/marquee";
import { MockVisual } from "@/components/ui/mock-visual";

export const ServicesCarousel = () => (
  <Section id="services" tone="dark" className="pt-4 sm:pt-8">
    <Container>
      <SectionHeading
        eyebrow={services.eyebrow}
        title={services.title}
        intro={services.intro}
        tone="dark"
        action={
          <Button href={services.cta.href} variant="outline-dark">
            {services.cta.label}
          </Button>
        }
      />
    </Container>
    <div data-reveal>
      <Marquee duration={55} gapClass="gap-5">
        {services.items.map((item) => (
          <Link key={item.title} href={serviceHref(item.slug)} className="group block w-[260px] shrink-0 sm:w-[300px]">
            <div className="relative overflow-hidden rounded-t-[var(--radius-card)]">
              <MockVisual theme={item.theme} device={item.device} className="aspect-[4/4.2] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-5">
                <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{item.title}</h3>
              </div>
            </div>
            <div className="flex min-h-20 flex-wrap content-start gap-1.5 rounded-b-[var(--radius-card)] border border-t-0 border-white/10 bg-ink-2 p-4">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] text-white/75 ring-1 ring-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </Marquee>
    </div>
  </Section>
);
