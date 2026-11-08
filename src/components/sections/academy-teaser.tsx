import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { asObjectArray, type Batch } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { Course } from "@/types/content";

export function AcademyTeaser({ courses }: { courses: Course[] }) {
  if (courses.length === 0) return null;
  return (
    <section className="relative overflow-hidden py-24 md:py-32" aria-labelledby="academy-heading">
      <div aria-hidden className="absolute inset-0 -z-10 bg-vignette opacity-70" />
      <Container>
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Future Solutions Academy"
            title={
              <span id="academy-heading">
                Learn from the team that <span className="text-gradient">ships.</span>
              </span>
            }
            description="Project-based IT training in Uttara and online. Small batches, working mentors, real portfolios."
          />
          <Button href="/academy" variant="outline" className="shrink-0">
            Explore courses
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </Reveal>

        <Reveal as="ul" stagger={0.1} className="mt-14 grid gap-5 md:grid-cols-3">
          {courses.map((course) => {
            const batch = asObjectArray<Batch>(course.batches).find((b) => b.status === "enrolling") ??
              asObjectArray<Batch>(course.batches)[0];
            return (
              <li key={course.id}>
                <Link href={`/academy/${course.slug}`} className="group block h-full">
                  <TiltCard as="article" className="flex h-full flex-col gap-5 p-6 md:p-7">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-white/[0.04] text-amber ring-1 ring-border">
                        <GraduationCap className="size-5" aria-hidden />
                      </span>
                      {batch?.status === "enrolling" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-0.5 text-[0.65rem] tracking-wider text-cyan uppercase">
                          <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-cyan" />
                          Enrolling
                        </span>
                      ) : null}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white">{course.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{course.short_description}</p>
                    <ul className="mt-auto flex flex-col gap-2 border-t border-border pt-5 text-xs text-silver">
                      {course.duration_weeks ? (
                        <li className="flex items-center gap-2">
                          <Clock className="size-3.5 text-muted" aria-hidden /> {course.duration_weeks} weeks ·{" "}
                          <span className="capitalize">{course.format}</span> · <span className="capitalize">{course.level}</span>
                        </li>
                      ) : null}
                      {batch ? (
                        <li className="flex items-center gap-2">
                          <CalendarDays className="size-3.5 text-muted" aria-hidden /> {batch.name} starts {formatDate(batch.starts_on)}
                        </li>
                      ) : null}
                    </ul>
                    <div className="flex items-center justify-between">
                      <span className="tabular text-base text-white">
                        {course.discount_price ? (
                          <>
                            <span className="font-sans">৳</span>{Number(course.discount_price).toLocaleString()}{" "}
                            <span className="text-xs text-muted line-through"><span className="font-sans">৳</span>{Number(course.price).toLocaleString()}</span>
                          </>
                        ) : course.price ? (
                          <><span className="font-sans">৳</span>{Number(course.price).toLocaleString()}</>
                        ) : (
                          "Free"
                        )}
                      </span>
                      <ArrowRight className="size-4 text-muted transition group-hover:translate-x-1 group-hover:text-white" aria-hidden />
                    </div>
                  </TiltCard>
                </Link>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
