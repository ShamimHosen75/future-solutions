import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, GraduationCap, Laptop, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { EnrollmentForm } from "@/components/forms/enrollment-form";
import { getPublishedCourses } from "@/lib/data/courses";
import { getSettings } from "@/lib/data/settings";
import { asObjectArray, type Batch } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "IT Institute — Courses & Batches",
  description: "Project-based IT training in Uttara, Dhaka and online: full-stack web development, React Native, digital marketing & SEO and AI automation. Small batches, working mentors.",
  path: "/academy",
});

const highlights = [
  { icon: Laptop, title: "Learn by shipping", text: "Every module ends with a real deliverable you can show." },
  { icon: Users, title: "Small batches", text: "Max 25 seats so mentors know your code and your goals." },
  { icon: GraduationCap, title: "Working mentors", text: "Taught by the engineers delivering our client projects." },
];

export default async function AcademyPage() {
  const [courses, settings] = await Promise.all([getPublishedCourses(), getSettings()]);
  const enrollable = courses.map((c) => ({ id: c.id, title: c.title, batches: asObjectArray<Batch>(c.batches) }));
  const upcoming = courses
    .flatMap((c) => asObjectArray<Batch>(c.batches).map((b) => ({ ...b, course: c })))
    .filter((b) => b.status === "enrolling" || b.status === "upcoming")
    .sort((a, b) => a.starts_on.localeCompare(b.starts_on));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Academy", path: "/academy" }])} />
      <PageHeader eyebrow="Future Solutions Academy" title={"Learn from the team\nthat ships."} highlight={["ships."]} description="Hands-on IT training in Uttara and online. You'll build real projects, get code reviews from working engineers and leave with a portfolio, not just a certificate." />

      <Container className="flex flex-col gap-24 pb-8">
        <Reveal as="ul" stagger={0.1} className="grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <GlassCard padding="sm" className="flex h-full items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] text-amber ring-1 ring-border"><Icon className="size-5" aria-hidden /></span>
                <div><h2 className="font-display text-base font-semibold text-white">{title}</h2><p className="mt-1 text-sm text-muted">{text}</p></div>
              </GlassCard>
            </li>
          ))}
        </Reveal>

        <section aria-labelledby="courses-heading">
          <Reveal><SectionHeading eyebrow="Courses" title={<span id="courses-heading">Choose your track.</span>} /></Reveal>
          <Reveal as="ul" stagger={0.1} className="mt-10 grid gap-5 md:grid-cols-2">
            {courses.map((course) => {
              const batches = asObjectArray<Batch>(course.batches);
              const open = batches.find((b) => b.status === "enrolling");
              return (
                <li key={course.id}>
                  <Link href={`/academy/${course.slug}`} className="group block h-full" data-cursor="View">
                    <TiltCard as="article" intensity={4} className="flex h-full flex-col gap-5 p-7">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge className="capitalize">{course.level}</Badge>
                          <Badge className="capitalize">{course.format}</Badge>
                        </div>
                        {open ? <Badge tone="cyan"><span aria-hidden className="size-1.5 animate-pulse rounded-full bg-cyan" /> Enrolling</Badge> : null}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-white">{course.title}</h3>
                      <p className="text-sm leading-relaxed text-muted">{course.short_description}</p>
                      <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-5 text-xs text-silver">
                        {course.duration_weeks ? <li className="flex items-center gap-1.5"><Clock className="size-3.5 text-muted" aria-hidden /> {course.duration_weeks} weeks</li> : null}
                        {open ? <li className="flex items-center gap-1.5"><CalendarDays className="size-3.5 text-muted" aria-hidden /> {open.name} · {formatDate(open.starts_on)}</li> : null}
                        {open ? <li className="flex items-center gap-1.5"><Users className="size-3.5 text-muted" aria-hidden /> {open.seats_left} seats left</li> : null}
                      </ul>
                      <div className="flex items-center justify-between">
                        <span className="tabular text-lg text-white">
                          {course.discount_price ? (<><span className="font-sans">৳</span>{Number(course.discount_price).toLocaleString()} <span className="text-xs text-muted line-through"><span className="font-sans">৳</span>{Number(course.price).toLocaleString()}</span></>) : course.price ? (<><span className="font-sans">৳</span>{Number(course.price).toLocaleString()}</>) : "Free"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm text-silver group-hover:text-white">Syllabus <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden /></span>
                      </div>
                    </TiltCard>
                  </Link>
                </li>
              );
            })}
          </Reveal>
          {courses.length === 0 ? <p className="mt-10 text-center text-muted">Courses will appear here once published.</p> : null}
        </section>

        {upcoming.length > 0 ? (
          <section aria-labelledby="batches-heading">
            <Reveal><SectionHeading eyebrow="Batches" title={<span id="batches-heading">Upcoming start dates.</span>} /></Reveal>
            <Reveal className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-border">
              <div className="no-scrollbar overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <caption className="sr-only">Upcoming batches</caption>
                  <thead className="bg-surface/60 text-left text-muted">
                    <tr>
                      {["Course", "Batch", "Starts", "Schedule", "Seats"].map((h) => (<th key={h} scope="col" className="px-5 py-4 font-medium">{h}</th>))}
                      <th scope="col" className="px-5 py-4 font-medium"><span className="sr-only">Action</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {upcoming.map((b) => (
                      <tr key={`${b.course.id}-${b.name}`} className="hover:bg-surface/40">
                        <td className="px-5 py-4 font-medium text-white">{b.course.title}</td>
                        <td className="px-5 py-4 text-silver">{b.name}</td>
                        <td className="tabular px-5 py-4 text-silver">{formatDate(b.starts_on)}</td>
                        <td className="px-5 py-4 text-muted">{b.schedule}</td>
                        <td className="px-5 py-4">{b.status === "enrolling" ? <Badge tone="cyan">{b.seats_left} of {b.seats} left</Badge> : <Badge>Upcoming</Badge>}</td>
                        <td className="px-5 py-4 text-right"><Link href={`/academy/${b.course.slug}#enroll`} className="text-cyan underline underline-offset-4 hover:text-white">Enroll</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </section>
        ) : null}

        <section id="enroll" aria-labelledby="enroll-heading" className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Enroll" title={<span id="enroll-heading">Reserve your seat.</span>} description="Fill in the form and our academy team will call you within a day to confirm your batch, answer questions and share payment options." />
            <ul className="mt-8 flex flex-col gap-3 text-sm text-muted">
              <li className="flex items-center gap-3"><span aria-hidden className="size-1.5 rounded-full bg-brand-gradient" /> Installments available for every course</li>
              <li className="flex items-center gap-3"><span aria-hidden className="size-1.5 rounded-full bg-brand-gradient" /> Visit the studio: {settings.contact.address}</li>
              <li className="flex items-center gap-3"><span aria-hidden className="size-1.5 rounded-full bg-brand-gradient" /> WhatsApp: {settings.contact.phone}</li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <GlassCard>{enrollable.length > 0 ? <EnrollmentForm courses={enrollable} /> : <p className="text-muted">Enrollment opens once courses are published.</p>}</GlassCard>
          </div>
        </section>
      </Container>
    </>
  );
}
