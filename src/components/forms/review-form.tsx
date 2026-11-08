"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/app/actions/leads";
import { reviewSchema } from "@/lib/validation/leads";
import { Field, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { FormShell } from "./form-shell";
import { useLeadForm } from "./use-lead-form";

export function ReviewForm() {
  const { form, state, pending, token, setToken, responseCount, formRef, onSubmit, errorOf } = useLeadForm(
    reviewSchema,
    submitReview,
    { rating: 5, role: "", company: "", content: "" },
  );
  const { register, watch, setValue } = form;
  const rating = Number(watch("rating") ?? 0);
  const [hover, setHover] = React.useState(0);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative">
      <input type="hidden" name="turnstileToken" value={token} readOnly />
      <input type="hidden" {...register("rating")} />
      <FormShell
        state={state}
        pending={pending}
        responseCount={responseCount}
        onToken={setToken}
        submitLabel="Submit review"
        successTitle="Thank you for your review"
      >
        <Field label="Your rating" htmlFor="rating-group" required error={errorOf("rating")}>
          <div id="rating-group" role="radiogroup" aria-label="Rating" className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setValue("rating", n, { shouldValidate: true })}
                className="rounded-full p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn("size-7 transition-colors", (hover || rating) >= n ? "fill-amber text-amber" : "text-muted/50")}
                  aria-hidden
                />
              </button>
            ))}
            <span className="tabular ml-3 text-sm text-muted">{rating}/5</span>
          </div>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="r-name" required error={errorOf("name")}>
            <Input id="r-name" autoComplete="name" placeholder="Your name" aria-invalid={Boolean(errorOf("name"))} {...register("name")} />
          </Field>
          <Field label="Email" htmlFor="r-email" required error={errorOf("email")} hint="Never shown publicly.">
            <Input id="r-email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errorOf("email"))} {...register("email")} />
          </Field>
          <Field label="Role" htmlFor="r-role" error={errorOf("role")}>
            <Input id="r-role" placeholder="e.g. Founder, Student" {...register("role")} />
          </Field>
          <Field label="Company / batch" htmlFor="r-company" error={errorOf("company")}>
            <Input id="r-company" placeholder="e.g. Acme Ltd or Batch 12" {...register("company")} />
          </Field>
        </div>
        <Field label="Your review" htmlFor="content" required error={errorOf("content")}>
          <Textarea id="content" placeholder="What did we work on together, and how did it go?" aria-invalid={Boolean(errorOf("content"))} {...register("content")} />
        </Field>
      </FormShell>
    </form>
  );
}
