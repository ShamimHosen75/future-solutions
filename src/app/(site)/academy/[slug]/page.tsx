import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Check, Clock, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Prose } from "@/components/ui/prose";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { EnrollmentForm } from "@/components/forms/enrollment-form";
import { getCourseBySlug, getPublishedCourses } from "@/lib/data/courses";
import { getPublishedTeam } from "@/lib/data/team";
import { asObjectArray, asStringArray, initials, type Batch } from "@/lib/content";
import { site } from "@/lib/site";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

type Params = { slug: string };
type Module = { module: string; topics: string[] };
export const dynamicParams = true;

export async function generateStaticParams() {
  const courses = await getPublishedCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return pageMetadata({ title: course.seo_title ?? course.title, description: course.seo_description ?? course.short_description, path: `/academy/${course.slug}`, image: course.cover_image });
}

export default async function CoursePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [course, courses, team] = await Promise.all([getCourseBySlug(slug), getPublishedCourses(), getPublishedTeam()]);
  if (!course) notFound();

  const curriculum = asObjectArray<Module>(course.curriculum);
  const outcomes = asStringArray(course.outcomes);
  const prerequisites = asStringArray(course.prerequisites);
  const batches = asObjectArray<Batch>(course.batches);
  const instructor = team.find((t) => t.id === course.instructor_id);
  const enrollable = courses.map((c) => ({ id: c.id, title: c.title, batches: asObjectArray<Batch>(c.batches) }));
  const price = course.discount_price ?? course.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.short_description,
    url: absoluteUrl(`/academy/${course.slug}`),
    provider: { "@type": "Organization", name: `${site.name} Academy`, "@id": `${site.url}/#organization` },
    educationalLevel: course.level,
    ...(price ? { offers: { "@type": "Offer", price: Number(price), priceCurrency: course.currency, category: "Paid" } } : {}),
    hasCourseInstance: batches.map((b) => ({
      "@type": "CourseInstance",
      name: b.name,
      courseMode: course.format === "online" ? "Online" : course.format === "offline" ? "Onsite" : "Blended",
      startDate: b.starts_on,
      courseSchedule: { "@type": "Schedule", repeatFrequency: "Weekly", description: b.schedule },
      ...(course.duration_weeks ? { courseWorkload: `P${course.duration_weeks}W` } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Academy", path: "/academy" }, { name: course.title, path: `/academy/${course.slug}` }])]} />
      <PageHeader eyebrow="Course" title={course.title} description={course.short_description}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="capitalize">{course.level}</Badge>
          <Badge className="capitalize">{course.format}</Badge>
          {course.duration_weeks ? <Badge><Clock className="size-3" aria-hidden /> {course.duration_weeks} weeks</Badge> : null}
          <Button href="#enroll" size="md" className="ml-2">Enroll now <ArrowRight className="size-4" aria-hidden /></Button>
        </div>
      </PageHeader>

      <Container className="grid gap-12 py-8 lg:grid-cols-12">
        <div className="flex flex-col gap-16 lg:col-span-8">
          <Reveal><Prose html={course.description} /></Reveal>

          {outcomes.length > 0 ? (
            <Reveal>
              <SectionHeading eyebrow="Outcomes" title="What you'll be able to do." />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {outcomes.map((o) => (<li key={o} className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface/40 px-4 py-3 text-sm text-silver"><Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />{o}</li>))}
              </ul>
            </Reveal>
          ) : null}

          {curriculum.length > 0 ? (
            <Reveal>
              <SectionHeading eyebrow="Curriculum" title="Module by module." />
              <ol className="mt-8 flex flex-col gap-3">
                {curriculum.map((m, i) => (
                  <li key={m.module}>
                    <details className="group rounded-[var(--radius-md)] border border-border bg-surface/40" open={i === 0}>
                      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <span className="tabular text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 font-display font-semibold text-white">{m.module}</span>
                        <span className="text-xs text-muted">{m.topics?.length ?? 0} topics</span>
                        <span aria-hidden className="text-muted transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <ul className="flex flex-wrap gap-2 px-5 pb-5">
                        {(m.topics ?? []).map((t) => (<li key={t} className="rounded-full border border-border px-3 py-1 text-xs text-silver">{t}</li>))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ol>
            </Reveal>
          ) : null}

          {batches.length > 0 ? (
            <Reveal>
              <SectionHeading eyebrow="Batches" title="Pick a start date." />
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {batches.map((b) => (
                  <li key={b.name}>
                    <GlassCard padding="sm" className="flex h-full flex-col gap-3">
                      <div className="flex items-center justify-between"><h3 className="font-display font-semibold text-white">{b.name}</h3>{b.status === "enrolling" ? <Badge tone="cyan">Enrolling</Badge> : <Badge className="capitalize">{b.status}</Badge>}</div>
                      <p className="flex items-center gap-2 text-sm text-silver"><CalendarDays className="size-4 text-muted" aria-hidden /> Starts {formatDate(b.starts_on)}</p>
                      <p className="flex items-center gap-2 text-sm text-silver"><Clock className="size-4 text-muted" aria-hidden /> {b.schedule}</p>
                      <p className="flex items-center gap-2 text-sm text-silver"><Users className="size-4 text-muted" aria-hidden /> {b.seats_left} of {b.seats} seats left</p>
                    </GlassCard>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>

        <aside className="lg:col-span-4">
          <Reveal>
            <GlassCard className="lg:sticky lg:top-24">
              <p className="label">Course fee</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="tabular font-display text-3xl font-semibold text-white">{price ? (<><span className="font-sans text-xl text-muted">৳</span>{Number(price).toLocaleString()}</>) : "Free"}</span>
                {course.discount_price && course.price ? <span className="tabular text-sm text-muted line-through">৳{Number(course.price).toLocaleString()}</span> : null}
              </p>
              <p className="mt-1 text-xs text-muted">Installments available · Seats confirmed on payment</p>
              <Button href="#enroll" className="mt-6 w-full">Reserve a seat</Button>
              {prerequisites.length > 0 ? (<><h2 className="label mt-8">Prerequisites</h2><ul className="mt-3 flex flex-col gap-2 text-sm text-silver">{prerequisites.map((p) => (<li key={p} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />{p}</li>))}</ul></>) : null}
              {instructor ? (
                <>
                  <h2 className="label mt-8">Instructor</h2>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient font-display text-xs font-bold text-white">{initials(instructor.name)}</span>
                    <div><p className="text-sm font-semibold text-white">{instructor.name}</p><p className="text-xs text-muted">{instructor.role}</p></div>
                  </div>
                  {instructor.bio ? <p className="mt-3 text-xs leading-relaxed text-muted">{instructor.bio}</p> : null}
                </>
              ) : null}
            </GlassCard>
          </Reveal>
        </aside>
      </Container>

      <section id="enroll" className="py-24" aria-labelledby="enroll-heading">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5"><SectionHeading eyebrow="Enroll" title={<span id="enroll-heading">Join {course.title}.</span>} description="We'll call you within a day to confirm your batch and share payment options." /></div>
          <div className="lg:col-span-7"><GlassCard><EnrollmentForm courses={enrollable} defaultCourseId={course.id} /></GlassCard></div>
        </Container>
      </section>
    </>
  );
}
