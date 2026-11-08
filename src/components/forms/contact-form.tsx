"use client";

import { submitContact } from "@/app/actions/leads";
import { budgets, contactSchema } from "@/lib/validation/leads";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { FormShell } from "./form-shell";
import { useLeadForm } from "./use-lead-form";

type ContactFormProps = {
  services: { id: string; title: string }[];
  intent?: "contact" | "quote";
  defaultServiceId?: string;
};

export function ContactForm({ services, intent = "contact", defaultServiceId }: ContactFormProps) {
  const { form, state, pending, token, setToken, responseCount, formRef, onSubmit, errorOf } = useLeadForm(
    contactSchema,
    submitContact,
    { intent, serviceId: defaultServiceId ?? "", budget: "", message: "" },
  );
  const { register } = form;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative">
      <input type="hidden" {...register("intent")} />
      <input type="hidden" name="turnstileToken" value={token} readOnly />
      <FormShell
        state={state}
        pending={pending}
        responseCount={responseCount}
        onToken={setToken}
        submitLabel={intent === "quote" ? "Request my quote" : "Send message"}
        successTitle={intent === "quote" ? "Quote request received" : "Message sent"}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" required error={errorOf("name")}>
            <Input id="name" autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errorOf("name"))} {...register("name")} />
          </Field>
          <Field label="Email" htmlFor="email" required error={errorOf("email")}>
            <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" aria-invalid={Boolean(errorOf("email"))} {...register("email")} />
          </Field>
          <Field label="Phone / WhatsApp" htmlFor="phone" error={errorOf("phone")}>
            <Input id="phone" type="tel" autoComplete="tel" placeholder="+880 1XXX-XXXXXX" aria-invalid={Boolean(errorOf("phone"))} {...register("phone")} />
          </Field>
          <Field label="Company" htmlFor="company" error={errorOf("company")}>
            <Input id="company" autoComplete="organization" placeholder="Company or project name" {...register("company")} />
          </Field>
          <Field label="Service you're interested in" htmlFor="serviceId" error={errorOf("serviceId")}>
            <Select id="serviceId" {...register("serviceId")}>
              <option value="">Not sure yet</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Budget range" htmlFor="budget" error={errorOf("budget")}>
            <Select id="budget" {...register("budget")}>
              <option value="">Select a range</option>
              {budgets.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Tell us about your project" htmlFor="message" required error={errorOf("message")}>
          <Textarea
            id="message"
            placeholder="Goals, timeline, anything you already have (designs, content, existing site)…"
            aria-invalid={Boolean(errorOf("message"))}
            {...register("message")}
          />
        </Field>
      </FormShell>
    </form>
  );
}
