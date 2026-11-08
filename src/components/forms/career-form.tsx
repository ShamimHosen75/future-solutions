"use client";

import { submitApplication } from "@/app/actions/leads";
import { careerSchema } from "@/lib/validation/leads";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { FormShell } from "./form-shell";
import { useLeadForm } from "./use-lead-form";

export function CareerForm({ positions, defaultPosition }: { positions: string[]; defaultPosition?: string }) {
  const { form, state, pending, token, setToken, responseCount, formRef, onSubmit, errorOf } = useLeadForm(
    careerSchema,
    submitApplication,
    { position: defaultPosition ?? positions[0] ?? "", portfolioUrl: "", message: "" },
  );
  const { register } = form;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative" id="apply">
      <input type="hidden" name="turnstileToken" value={token} readOnly />
      <FormShell
        state={state}
        pending={pending}
        responseCount={responseCount}
        onToken={setToken}
        submitLabel="Send application"
        successTitle="Application received"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Position" htmlFor="position" required error={errorOf("position")} className="sm:col-span-2">
            <Select id="position" aria-invalid={Boolean(errorOf("position"))} {...register("position")}>
              {positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
              <option value="Open application">Open application</option>
            </Select>
          </Field>
          <Field label="Full name" htmlFor="c-name" required error={errorOf("name")}>
            <Input id="c-name" autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errorOf("name"))} {...register("name")} />
          </Field>
          <Field label="Email" htmlFor="c-email" required error={errorOf("email")}>
            <Input id="c-email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errorOf("email"))} {...register("email")} />
          </Field>
          <Field label="Phone" htmlFor="c-phone" error={errorOf("phone")}>
            <Input id="c-phone" type="tel" autoComplete="tel" placeholder="+880 1XXX-XXXXXX" aria-invalid={Boolean(errorOf("phone"))} {...register("phone")} />
          </Field>
          <Field label="Portfolio / LinkedIn / GitHub" htmlFor="portfolioUrl" error={errorOf("portfolioUrl")}>
            <Input id="portfolioUrl" type="url" placeholder="https://" aria-invalid={Boolean(errorOf("portfolioUrl"))} {...register("portfolioUrl")} />
          </Field>
        </div>
        <Field label="Why you, why us?" htmlFor="c-message" required error={errorOf("message")} hint="Include a link to your CV (Google Drive, Dropbox) — we'll ask for files later.">
          <Textarea id="c-message" placeholder="Tell us about your experience and what you'd like to build with us." aria-invalid={Boolean(errorOf("message"))} {...register("message")} />
        </Field>
      </FormShell>
    </form>
  );
}
