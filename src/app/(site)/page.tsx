import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { LogoMark } from "@/components/ui/logo";
import { ServiceIcon } from "@/components/ui/service-icon";
import { getSettings } from "@/lib/data/settings";
import { getPublishedServices } from "@/lib/data/services";
import { hasSupabaseEnv } from "@/lib/env";
import Link from "next/link";

/**
 * Phase 1 home: a static, on-brand hero and the services grid, driven by
 * Supabase. The 3D hero, pinned sections and counters arrive in Phase 2.
 */
export default async function HomePage() {
  const [settings, services] = await Promise.all([getSettings(), getPublishedServices()]);
  const { homepage } = settings;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-vignette absolute inset-0" />
        <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000,transparent)]" />
        <Container className="relative grid min-h-[calc(100dvh-var(--header-h))] items-center gap-12 py-20 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <span className="label inline-flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-brand-gradient" />
              {homepage.heroEyebrow}
            </span>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98] font-bold">
              <span className="text-silver-gradient">Smart Solutions.</span>
              <br />
              <span className="text-gradient animate-gradient-shift">Lasting Impact.</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted">{homepage.heroSubtitle}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/contact?intent=quote" size="lg">
                Start a project
                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                Explore services
              </Button>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {homepage.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="label order-2">{stat.label}</dt>
                  <dd className="tabular order-1 text-3xl font-semibold text-white">
                    {stat.value.toLocaleString()}
                    <span className="text-gradient">{stat.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Static mark — replaced by the 3D canvas in Phase 2 */}
          <div className="relative hidden lg:col-span-5 lg:block">
            <div aria-hidden className="absolute inset-0 -z-10 rounded-full bg-blue/20 blur-[120px]" />
            <div aria-hidden className="absolute right-0 bottom-0 -z-10 size-2/3 rounded-full bg-orange/15 blur-[120px]" />
            <GlassCard border="animated" padding="none" className="mx-auto flex aspect-square max-w-md items-center justify-center">
              <LogoMark size={260} className="animate-float drop-shadow-[0_30px_60px_rgba(18,200,255,0.25)]" />
            </GlassCard>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-24 md:py-32" aria-labelledby="services-heading">
        <Container>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="What we do"
              title={
                <span id="services-heading">
                  Six disciplines. <span className="text-gradient">One partner.</span>
                </span>
              }
              description="From first pixel to production, every service is delivered by the same team that trains the next generation of engineers in our academy."
            />
            <Button href="/services" variant="outline" className="shrink-0">
              All services
            </Button>
          </div>

          {services.length === 0 ? (
            <EmptyState configured={hasSupabaseEnv()} />
          ) : (
            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <li key={service.id}>
                  <Link href={`/services/${service.slug}`} className="group block h-full">
                    <GlassCard className="flex h-full flex-col gap-5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.04] text-cyan ring-1 ring-border">
                          <ServiceIcon name={service.icon} className="size-5" />
                        </span>
                        <span className="tabular text-xs text-muted">0{i + 1}</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-white">{service.title}</h3>
                      <p className="text-sm leading-relaxed text-muted">{service.short_description}</p>
                      <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-silver transition-colors group-hover:text-white">
                        Learn more
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </GlassCard>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}

function EmptyState({ configured }: { configured: boolean }) {
  return (
    <GlassCard className="mt-14 text-center">
      <p className="font-display text-lg text-white">
        {configured ? "No published services yet." : "Supabase isn't connected yet."}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        {configured
          ? "Publish services from the admin dashboard and they'll appear here."
          : "Add your project keys to .env.local, run the migrations and seed, and this grid fills itself from the database."}
      </p>
    </GlassCard>
  );
}
