import type { Metadata } from "next";
import { about } from "@/content/about";
import { caseStudies, caseStudyHref } from "@/content/work";
import { PageHero } from "@/components/page/page-hero";
import { WorkCard } from "@/components/page/work-card";
import { Avatar, Button, Container, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { NamedIcon } from "@/components/ui/icon-map";
import { LinkedIn } from "@/components/ui/icons";
import { Counter } from "@/components/motion/counter";
import { Marquee } from "@/components/motion/marquee";
import { Partners } from "@/components/sections/partners";
import { ClientProof } from "@/components/sections/client-proof";
import { Recognition } from "@/components/sections/recognition";
import { Contact } from "@/components/sections/contact";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About us",
  description: about.intro,
};

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero + stats */}
      <PageHero eyebrow={about.eyebrow} title={about.title} intro={about.intro} crumbs={[{ label: "About" }]}>
        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4 border-t border-white/10 pt-10">
          {about.stats.map((s) => (
            <div key={s.label} data-reveal>
              <dd className="text-3xl font-semibold tracking-tight sm:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-1 text-xs text-muted-dark sm:text-sm">{s.label}</dt>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* 2. Mission */}
      <Section tone="light">
        <Container>
          <SectionHeading
            eyebrow={about.mission.eyebrow}
            title={about.mission.title}
            intro={about.mission.intro}
            action={<Button href="/contact">Work with us</Button>}
          />
          <ol className="grid gap-4 md:grid-cols-3">
            {about.mission.principles.map((p, i) => (
              <li key={p.title} data-reveal="scale" className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-7 text-white">
                <span aria-hidden className="absolute -right-4 -top-6 text-[7rem] leading-none font-semibold text-white/[0.05]">
                  {i + 1}
                </span>
                <span className="text-sm font-medium tabular-nums text-orange-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-10 text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-dark">{p.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 3. Partners */}
      <Partners />

      {/* 4. Team marquee + kinetic headline */}
      <section data-tone="dark" className="overflow-hidden bg-ink py-20 text-white sm:py-28">
        <Marquee duration={50} gapClass="gap-4">
          {about.team.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={
                "flex h-56 w-44 shrink-0 flex-col justify-end rounded-[var(--radius-card)] p-4 sm:h-64 sm:w-52 " +
                (i % 2 ? "bg-[linear-gradient(160deg,#00d4ff,#003a80)]" : "bg-[linear-gradient(160deg,#ffb547,#fd4d00)]")
              }
            >
              {/* Placeholder: replace with team photos */}
              <span className="text-sm font-semibold">{m.name}</span>
              <span className="text-xs text-white/75">{m.role}</span>
            </div>
          ))}
        </Marquee>
        <Container>
          <p data-kinetic className="mx-auto mt-20 max-w-4xl text-center text-3xl leading-[1.15] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
            {about.kinetic.split(" ").map((w, i) => (
              <span key={i} className="kinetic-word">
                {w}{" "}
              </span>
            ))}
          </p>
        </Container>
      </section>

      {/* 5. Differentiators */}
      <Section tone="light">
        <Container>
          <SectionHeading eyebrow="What makes us different" title="Six reasons clients stay with us" />
          <ol className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {about.differentiators.map((d, i) => (
              <li key={d.title} data-reveal className="border-t border-line py-7">
                <span className="text-sm font-medium tabular-nums text-orange-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 6. Story */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Our story" title="How we got here" />
          <div className="relative">
            <div aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-line md:block" />
            <div aria-hidden data-progress-line className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-gradient-orange md:block" />
            <ol className="relative grid gap-8 md:grid-cols-4">
              {about.story.map((s) => (
                <li key={s.year} data-reveal>
                  <span className="relative z-10 block size-[15px] rounded-full border-[3px] border-white bg-orange-500 ring-1 ring-orange-500" />
                  <p className="mt-5 text-4xl font-semibold tracking-tight text-gradient-brand">{s.year}</p>
                  <h3 className="mt-2 font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 7. Founder */}
      <Section tone="dark">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div data-clip className="relative aspect-[4/5] max-w-md overflow-hidden rounded-[calc(var(--radius-card)*1.4)] bg-[radial-gradient(120%_120%_at_20%_0%,#ffb547_0%,#fe6b01_40%,#003a80_100%)]">
            {/* Placeholder: replace with founder photo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar name={about.founder.name} className="size-32 text-3xl ring-4 ring-white/20" />
            </div>
          </div>
          <div>
            <Eyebrow className="text-orange-400">Meet the founder</Eyebrow>
            <h2 data-reveal className="mt-4 flex items-center gap-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              {about.founder.name}
              <a href={site.socials.linkedin} aria-label={`${about.founder.name} on LinkedIn`} className="text-blue-400 hover:text-blue-300">
                <LinkedIn className="size-6" />
              </a>
            </h2>
            <p data-reveal className="mt-2 text-muted-dark">
              {about.founder.role}
            </p>
            <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
              {about.founder.bio}
            </p>
            <dl data-reveal className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {about.founder.stats.map((s) => (
                <div key={s.label} className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <dt className="order-2 mt-1 text-xs text-muted-dark">{s.label}</dt>
                  <dd className="text-2xl font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      {/* 8. Values */}
      <Section tone="light">
        <Container>
          <SectionHeading eyebrow="Our values" title="What we believe in" align="center" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <li key={v.title} data-reveal="scale" className="group rounded-[var(--radius-card)] border border-line bg-white p-6 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-orange text-white transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-6deg]">
                  <NamedIcon name={v.icon} className="size-7" />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 9. Selected work */}
      <Section tone="light" className="pt-0 sm:pt-0">
        <Container>
          <SectionHeading
            eyebrow="Selected work"
            title="Some of what we have built"
            action={
              <Button href="/work" variant="outline-light">
                See all work
              </Button>
            }
          />
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
            {caseStudies.slice(0, 4).map((p) => (
              <WorkCard key={p.slug} {...p} href={caseStudyHref(p.slug)} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 10. Testimonials + recognition */}
      <ClientProof />
      <Recognition />

      {/* 11. Team grid + careers */}
      <Section tone="light" id="team">
        <Container>
          <SectionHeading eyebrow="Meet the team" title="The people behind your product" />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {about.team.map((m, i) => (
              <li key={`${m.role}-${i}`} data-reveal="scale" className="group">
                <div
                  className={
                    "flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[var(--radius-card)] transition-transform duration-500 group-hover:-translate-y-1 " +
                    (i % 2 ? "bg-[linear-gradient(160deg,#cdf3ff,#7fd8f5)]" : "bg-[linear-gradient(160deg,#ffe6cc,#e9c9a2)]")
                  }
                >
                  <Avatar name={m.name} hue={i % 2 ? "blue" : "orange"} className="size-20 text-xl" />
                </div>
                <p className="mt-3 font-semibold">{m.name}</p>
                <p className="text-sm text-muted">{m.role}</p>
              </li>
            ))}
          </ul>

          <div
            id="careers"
            data-reveal
            className="mt-16 flex scroll-mt-28 flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] border border-line bg-white p-8 sm:flex-row sm:items-center"
          >
            <div>
              <p className="text-2xl font-semibold tracking-tight">{about.careers.title}</p>
              <p className="mt-2 max-w-lg text-sm text-muted">{about.careers.text}</p>
            </div>
            <Button href={`mailto:${site.email}?subject=Career%20application`}>{about.careers.cta}</Button>
          </div>
        </Container>
      </Section>

      {/* 12. Contact */}
      <Contact />
    </>
  );
}
