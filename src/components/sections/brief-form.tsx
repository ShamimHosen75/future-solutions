"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/content/home";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"email" | "name" | "details", string>>;

const inputClass =
  "w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-orange-500 focus:ring-0 focus:outline-none";

const validate = (data: FormData): Errors => {
  const errors: Errors = {};
  const email = String(data.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (String(data.get("name") ?? "").trim().length < 2) errors.name = "Tell us your name.";
  if (String(data.get("details") ?? "").trim().length < 10) errors.details = "A sentence or two about your project helps.";
  return errors;
};

export const BriefForm = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [types, setTypes] = useState<string[]>([]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data), projectTypes: types }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
      setTypes([]);
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-[var(--radius-card)] bg-white p-8 text-center text-ink motion-safe:animate-[fade-in_0.5s_ease-out]">
        <span className="flex size-14 items-center justify-center rounded-full bg-gradient-orange text-2xl text-white">✓</span>
        <p className="mt-5 text-2xl font-semibold">Thanks, we have your brief</p>
        <p className="mt-2 max-w-sm text-sm text-muted">We will reply within 24 hours, usually the same day.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-medium text-orange-600 underline-offset-4 hover:underline">
          Send another brief
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-[var(--radius-card)] bg-white p-6 text-ink sm:p-8">
      <p className="text-2xl font-semibold tracking-tight">{contact.form.title}</p>
      <p className="mt-1.5 text-sm text-muted">{contact.form.text}</p>

      <div className="mt-7 grid gap-6">
        <Field label="Email address" error={errors.email} htmlFor="brief-email">
          <input id="brief-email" name="email" type="email" autoComplete="email" required className={inputClass} aria-invalid={!!errors.email} aria-describedby={errors.email ? "brief-email-error" : undefined} />
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your name" error={errors.name} htmlFor="brief-name">
            <input id="brief-name" name="name" autoComplete="name" required className={inputClass} aria-invalid={!!errors.name} aria-describedby={errors.name ? "brief-name-error" : undefined} />
          </Field>
          <Field label="Budget range" htmlFor="brief-budget">
            <select id="brief-budget" name="budget" defaultValue="" className={cn(inputClass, "cursor-pointer")}>
              <option value="" disabled>
                Select a range
              </option>
              {contact.form.budgets.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </Field>
        </div>

        <fieldset>
          <legend className="text-xs font-medium text-muted">What are you building?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {contact.form.projectTypes.map((t) => {
              const checked = types.includes(t);
              return (
                <label
                  key={t}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-400",
                    checked ? "border-orange-500 bg-orange-500 text-white" : "border-line text-text/80 hover:border-text/40",
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => setTypes((prev) => (checked ? prev.filter((x) => x !== t) : [...prev, t]))}
                  />
                  {t}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Field label="Project details" error={errors.details} htmlFor="brief-details">
          <textarea id="brief-details" name="details" rows={3} required className={cn(inputClass, "resize-y")} aria-invalid={!!errors.details} aria-describedby={errors.details ? "brief-details-error" : undefined} />
        </Field>
        {/* Honeypot: hidden from people, bots fill it in */}
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-8 h-12 w-full rounded-full bg-gradient-orange font-medium text-white shadow-[0_8px_30px_-8px_rgb(253_77_0/0.7)] transition-[transform,opacity] active:scale-[0.98] disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Submit"}
      </button>
      {status === "error" ? (
        <p role="alert" className="mt-3 text-center text-sm text-red-600">
          Something went wrong. Please try again or email us directly.
        </p>
      ) : null}
      <p className="mt-4 text-center text-xs text-muted">{contact.form.note}</p>
    </form>
  );
};

const Field = ({ label, error, htmlFor, children }: { label: string; error?: string; htmlFor: string; children: React.ReactNode }) => (
  <div>
    <label htmlFor={htmlFor} className="text-xs font-medium text-muted">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-red-600">
        {error}
      </p>
    ) : null}
  </div>
);
