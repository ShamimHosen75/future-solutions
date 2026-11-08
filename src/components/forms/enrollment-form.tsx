"use client";

import * as React from "react";
import { submitEnrollment } from "@/app/actions/leads";
import { enrollmentSchema } from "@/lib/validation/leads";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import type { Batch } from "@/lib/content";
import { FormShell } from "./form-shell";
import { useLeadForm } from "./use-lead-form";

export type EnrollableCourse = { id: string; title: string; batches: Batch[] };

type EnrollmentFormProps = {
  courses: EnrollableCourse[];
  defaultCourseId?: string;
};

export function EnrollmentForm({ courses, defaultCourseId }: EnrollmentFormProps) {
  const { form, state, pending, token, setToken, responseCount, formRef, onSubmit, errorOf } = useLeadForm(
    enrollmentSchema,
    submitEnrollment,
    { courseId: defaultCourseId ?? courses[0]?.id ?? "", batch: "", background: "" },
  );
  const { register, watch } = form;
  const courseId = watch("courseId");
  const course = courses.find((c) => c.id === courseId);
  const openBatches = (course?.batches ?? []).filter((b) => b.status === "enrolling" || b.status === "upcoming");

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative">
      <input type="hidden" name="turnstileToken" value={token} readOnly />
      <input type="hidden" name="courseTitle" value={course?.title ?? ""} readOnly />
      <FormShell
        state={state}
        pending={pending}
        responseCount={responseCount}
        onToken={setToken}
        submitLabel="Reserve my seat"
        successTitle="Enrollment request received"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Course" htmlFor="courseId" required error={errorOf("courseId")} className="sm:col-span-2">
            <Select id="courseId" aria-invalid={Boolean(errorOf("courseId"))} {...register("courseId")}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
          </Field>
          {openBatches.length > 0 ? (
            <Field label="Preferred batch" htmlFor="batch" error={errorOf("batch")} className="sm:col-span-2">
              <Select id="batch" {...register("batch")}>
                <option value="">No preference</option>
                {openBatches.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} · starts {b.starts_on} · {b.schedule}
                    {b.status === "upcoming" ? " (upcoming)" : ""}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <Field label="Full name" htmlFor="e-name" required error={errorOf("name")}>
            <Input id="e-name" autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errorOf("name"))} {...register("name")} />
          </Field>
          <Field label="Email" htmlFor="e-email" required error={errorOf("email")}>
            <Input id="e-email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errorOf("email"))} {...register("email")} />
          </Field>
          <Field label="Phone / WhatsApp" htmlFor="e-phone" required error={errorOf("phone")} className="sm:col-span-2">
            <Input id="e-phone" type="tel" autoComplete="tel" placeholder="+880 1XXX-XXXXXX" aria-invalid={Boolean(errorOf("phone"))} {...register("phone")} />
          </Field>
        </div>
        <Field label="Your background (optional)" htmlFor="background" error={errorOf("background")} hint="Current studies or job, and what you want to achieve.">
          <Textarea id="background" className="min-h-24" placeholder="e.g. Final-year CSE student, want to land a junior developer role…" {...register("background")} />
        </Field>
      </FormShell>
    </form>
  );
}
