import { work } from "@/content/home";
import { Button, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { WorkCard } from "@/components/page/work-card";

export const FeaturedWork = () => (
  <Section id="work" tone="light" className="pt-0 sm:pt-4">
    <Container>
      <SectionHeading
        eyebrow={work.eyebrow}
        title={work.title}
        action={
          <Button href={work.cta.href} variant="primary">
            {work.cta.label}
          </Button>
        }
      />
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
        {work.projects.map((project) => (
          <WorkCard key={project.slug} {...project} />
        ))}
      </div>
    </Container>
  </Section>
);
