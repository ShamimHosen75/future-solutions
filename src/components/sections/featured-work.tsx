import Link from "next/link";
import { work } from "@/content/home";
import { Button, Container, Section, SectionHeading, Tag } from "@/components/ui/primitives";
import { MockVisual } from "@/components/ui/mock-visual";
import { ArrowUpRight } from "@/components/ui/icons";

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
          <Link key={project.title} href={project.href} data-reveal className="group block">
            <div className="relative overflow-hidden rounded-[var(--radius-card)]">
              <MockVisual theme={project.theme} device={project.device} className="aspect-[16/10] transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              <span className="absolute right-4 top-4 flex size-11 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-lg transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="size-5" />
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1.5px]">
                {project.title}
              </span>
              <span className="text-muted"> · {project.summary}</span>
            </h3>
          </Link>
        ))}
      </div>
    </Container>
  </Section>
);
