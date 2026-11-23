import { whyUs } from "@/content/home";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { NamedIcon } from "@/components/ui/icon-map";
import { ArrowRight } from "@/components/ui/icons";

export const WhyUs = () => (
  <Section id="why-us" tone="light">
    <Container>
      <SectionHeading eyebrow={whyUs.eyebrow} title={whyUs.title} intro={whyUs.intro} />
      <ul className="grid border-line sm:grid-cols-2 lg:grid-cols-3 lg:[&>li:nth-child(-n+3)]:border-b lg:[&>li:not(:nth-child(3n))]:border-r">
        {whyUs.points.map((p) => (
          <li key={p.title} data-reveal className="group border-line px-0 py-8 sm:px-6 lg:px-8 lg:py-10 max-lg:border-b">
            <NamedIcon name={p.icon} className="size-10 text-orange-500 transition-transform duration-500 group-hover:-translate-y-1" />
            <p className="mt-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted line-through decoration-muted/50">{p.from}</span>
              <ArrowRight className="size-3.5 text-orange-500" />
              <span className="font-medium text-orange-600">{p.to}</span>
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
          </li>
        ))}
      </ul>
    </Container>
  </Section>
);
