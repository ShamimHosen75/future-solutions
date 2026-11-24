import Link from "next/link";
import type { ReactNode } from "react";
import { Container, Eyebrow, SplitText } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

type Crumb = { label: string; href?: string };

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  align?: "left" | "center";
  children?: ReactNode;
  /** Drop the bottom padding so the next dark section continues the hero. */
  flush?: boolean;
  className?: string;
};

/** Dark hero used at the top of every inner page, with the same glows and grid as the homepage hero. */
export const PageHero = ({ eyebrow, title, intro, crumbs, align = "center", children, flush, className }: PageHeroProps) => (
  <section
    data-tone="dark"
    className={cn("relative overflow-hidden bg-ink pt-32 text-white sm:pt-40", flush ? "pb-0" : "pb-20 sm:pb-24", className)}
  >
    <HeroGlow />
    {flush ? <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink" /> : null}
    <Container className={cn("relative", align === "center" && "text-center")}>
      {crumbs ? <Breadcrumbs crumbs={crumbs} align={align} /> : null}
      {eyebrow ? <Eyebrow className="mb-5 text-orange-400">{eyebrow}</Eyebrow> : null}
      <SplitText
        as="h1"
        text={title}
        className={cn(
          "max-w-4xl text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]",
          align === "center" && "mx-auto",
        )}
      />
      {intro ? (
        <p data-reveal className={cn("mt-6 max-w-2xl text-base text-pretty text-muted-dark sm:text-lg", align === "center" && "mx-auto")}>
          {intro}
        </p>
      ) : null}
      {children}
    </Container>
  </section>
);

export const HeroGlow = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0">
    <div className="absolute -top-48 left-1/2 h-[460px] w-[860px] -translate-x-1/2 rounded-full bg-orange-600/20 blur-[120px]" />
    <div className="absolute -bottom-32 left-[8%] h-[340px] w-[480px] rounded-full bg-blue-600/25 blur-[120px]" />
    <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
  </div>
);

const Breadcrumbs = ({ crumbs, align }: { crumbs: Crumb[]; align: "left" | "center" }) => (
  <nav aria-label="Breadcrumb" data-reveal className="mb-6">
    <ol className={cn("flex flex-wrap items-center gap-2 text-xs text-white/55", align === "center" && "justify-center")}>
      <li>
        <Link href="/" className="hover:text-white">
          Home
        </Link>
      </li>
      {crumbs.map((c) => (
        <li key={c.label} className="flex items-center gap-2">
          <span aria-hidden>/</span>
          {c.href ? (
            <Link href={c.href} className="hover:text-white">
              {c.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-white/85">
              {c.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
