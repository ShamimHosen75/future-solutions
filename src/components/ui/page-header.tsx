import { Container } from "@/components/ui/container";
import { TextReveal } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  highlight?: string[];
  description?: string;
  children?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

/** Consistent inner-page hero with the word-mask reveal. */
export function PageHeader({ eyebrow, title, highlight, description, children, align = "left", className }: PageHeaderProps) {
  return (
    <section className={cn("relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16", className)}>
      <div aria-hidden className="bg-vignette absolute inset-0" />
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(60%_80%_at_50%_0%,#000,transparent)]" />
      <Container className={cn("relative flex flex-col gap-6", align === "center" && "items-center text-center")}>
        <Reveal y={10}>
          <span className="label inline-flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-brand-gradient" />
            {eyebrow}
          </span>
        </Reveal>
        <TextReveal
          as="h1"
          trigger="mount"
          text={title}
          highlight={highlight}
          wordClassName="text-silver-gradient"
          className={cn(
            "max-w-4xl font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] font-bold",
            align === "center" && "mx-auto",
          )}
        />
        {description ? (
          <Reveal delay={0.4}>
            <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">{description}</p>
          </Reveal>
        ) : null}
        {children ? <Reveal delay={0.55}>{children}</Reveal> : null}
      </Container>
    </section>
  );
}
