import { howWeWork } from "@/content/home";
import { Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { NamedIcon } from "@/components/ui/icon-map";

export const HowWeWork = () => (
  <Section id="how-we-work" tone="light" className="pt-4 sm:pt-8">
    <Container>
      <SectionHeading eyebrow={howWeWork.eyebrow} title={howWeWork.title} intro={howWeWork.intro} />
      <ol className="grid gap-4 md:grid-cols-3">
        {howWeWork.steps.map((step, i) => (
          <li
            key={step.title}
            data-reveal
            className="group rounded-[var(--radius-card)] border border-line bg-white p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgb(4_7_13/0.35)]"
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl font-medium text-muted/70 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <NamedIcon name={step.icon} className="size-8 text-orange-500 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" />
            </div>
            <h3 className="mt-10 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
      <div data-reveal className="mt-4 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6 sm:flex-row sm:items-center">
        <p className="text-xl font-semibold tracking-tight sm:text-2xl">{howWeWork.banner.title}</p>
        <Button href={howWeWork.banner.cta.href}>{howWeWork.banner.cta.label}</Button>
      </div>
    </Container>
  </Section>
);
