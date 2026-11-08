import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Globe, Link2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Prose } from "@/components/ui/prose";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { TiltCard } from "@/components/motion/tilt-card";
import { CTA } from "@/components/sections/cta";
import { getSettings } from "@/lib/data/settings";
import { getPublishedTeam } from "@/lib/data/team";
import { asStringArray, initials } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Future Solutions is a Dhaka-based software company and IT training institute. Meet the team, our story, mission and values.",
  path: "/about",
});

const socialIcon = (key: string) => (key === "website" ? Globe : Link2);

export default async function AboutPage() {
  const [settings, team] = await Promise.all([getSettings(), getPublishedTeam()]);
  const { about, homepage } = settings;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHeader eyebrow="About us" title={"Built in Dhaka.\nBuilt to last."} highlight={["last."]} description={about.intro} />

      <Container className="flex flex-col gap-24 pb-8">
        <Reveal as="ul" stagger={0.1} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {homepage.stats.map((s) => (
            <li key={s.label}>
              <GlassCard padding="sm" className="h-full">
                <p className="tabular text-3xl font-semibold text-white md:text-4xl"><Counter value={s.value} suffix={s.suffix} /></p>
                <p className="label mt-2">{s.label}</p>
              </GlassCard>
            </li>
          ))}
        </Reveal>

        <section className="grid gap-12 lg:grid-cols-12" aria-labelledby="story-heading">
          <div className="lg:col-span-5">
            <Reveal><SectionHeading eyebrow="Our story" title={<span id="story-heading">From a two-person studio to a team that teaches.</span>} /></Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal><Prose html={about.story} /></Reveal>
            <Reveal className="mt-10 grid gap-4 sm:grid-cols-2">
              <GlassCard padding="sm"><p className="label">Mission</p><p className="mt-3 text-silver">{about.mission}</p></GlassCard>
              <GlassCard padding="sm"><p className="label">Vision</p><p className="mt-3 text-silver">{about.vision}</p></GlassCard>
            </Reveal>
          </div>
        </section>

        {about.values.length > 0 ? (
          <section aria-labelledby="values-heading">
            <Reveal><SectionHeading eyebrow="Values" title={<span id="values-heading">How we work.</span>} /></Reveal>
            <Reveal as="ul" stagger={0.08} className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {about.values.map((v, i) => (
                <li key={v.title}>
                  <TiltCard intensity={4} className="flex h-full flex-col gap-3 p-6">
                    <span className="tabular text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-lg font-semibold text-white">{v.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{v.description}</p>
                  </TiltCard>
                </li>
              ))}
            </Reveal>
          </section>
        ) : null}

        {about.milestones.length > 0 ? (
          <section aria-labelledby="timeline-heading">
            <Reveal><SectionHeading eyebrow="Milestones" title={<span id="timeline-heading">The journey so far.</span>} /></Reveal>
            <Reveal as="ul" className="relative mt-10 flex flex-col gap-8 border-l border-border pl-8" stagger={0.1}>
              {about.milestones.map((m) => (
                <li key={m.year} className="relative">
                  <span aria-hidden className="absolute top-1.5 -left-[2.3rem] size-3 rounded-full bg-brand-gradient ring-4 ring-bg" />
                  <p className="tabular text-sm text-cyan">{m.year}</p>
                  <p className="mt-1 text-silver md:text-lg">{m.title}</p>
                </li>
              ))}
            </Reveal>
          </section>
        ) : null}

        {team.length > 0 ? (
          <section aria-labelledby="team-heading">
            <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <SectionHeading eyebrow="Team" title={<span id="team-heading">The people behind the work.</span>} />
              <Button href="/careers" variant="outline" className="shrink-0">Join the team <ArrowRight className="size-4" aria-hidden /></Button>
            </Reveal>
            <Reveal as="ul" stagger={0.08} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => {
                const socials = Object.entries((member.socials ?? {}) as Record<string, string>).filter(([, url]) => Boolean(url));
                return (
                  <li key={member.id}>
                    <TiltCard as="article" intensity={5} className="flex h-full flex-col gap-4 p-6">
                      {member.avatar_url ? (
                        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)]"><Image src={member.avatar_url} alt={member.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" /></div>
                      ) : (
                        <div className="flex aspect-square items-center justify-center rounded-[var(--radius-md)] bg-surface-2"><span className="font-display text-4xl font-bold text-gradient">{initials(member.name)}</span></div>
                      )}
                      <div><h3 className="font-display text-lg font-semibold text-white">{member.name}</h3><p className="text-sm text-cyan">{member.role}</p></div>
                      {member.bio ? <p className="text-sm leading-relaxed text-muted">{member.bio}</p> : null}
                      <ul className="mt-auto flex flex-wrap gap-1.5">
                        {asStringArray(member.skills).slice(0, 4).map((s) => (<li key={s} className="rounded-full border border-border px-2.5 py-0.5 text-[0.65rem] text-silver">{s}</li>))}
                      </ul>
                      {socials.length > 0 ? (
                        <ul className="flex gap-2">
                          {socials.map(([key, url]) => { const Icon = socialIcon(key); return (<li key={key}><a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on ${key}`} className="flex size-8 items-center justify-center rounded-full border border-border text-muted hover:text-white"><Icon className="size-3.5" aria-hidden /></a></li>); })}
                        </ul>
                      ) : null}
                    </TiltCard>
                  </li>
                );
              })}
            </Reveal>
          </section>
        ) : null}
      </Container>
      <CTA whatsapp={settings.contact.whatsapp} />
    </>
  );
}
