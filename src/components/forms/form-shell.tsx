"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Turnstile } from "./turnstile";
import type { FormState } from "@/lib/validation/leads";
import { cn } from "@/lib/utils";

type FormShellProps = {
  state: FormState;
  pending: boolean;
  submitLabel: string;
  children: React.ReactNode;
  className?: string;
  /** Reset Turnstile when the server responds. */
  responseCount: number;
  onToken: (token: string) => void;
  successTitle?: string;
};

/**
 * Wraps form fields with the honeypot, Turnstile, status banner and submit
 * button so each concrete form only declares its fields.
 */
export function FormShell({ state, pending, submitLabel, children, className, responseCount, onToken, successTitle }: FormShellProps) {
  if (state.status === "success") {
    return (
      <div role="status" className="glass flex flex-col items-center gap-4 rounded-[var(--radius-lg)] p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand-gradient">
          <CheckCircle2 className="size-7 text-white" aria-hidden />
        </span>
        <h3 className="font-display text-xl font-semibold text-white">{successTitle ?? "Message sent"}</h3>
        <p className="max-w-sm text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {children}

      {/* Honeypot: hidden from humans, tempting for bots */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Turnstile onToken={onToken} resetKey={responseCount} />

      {state.status === "error" && state.message ? (
        <p role="alert" className="flex items-start gap-2 rounded-[var(--radius-md)] border border-orange/30 bg-orange/10 px-4 py-3 text-sm text-orange">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {pending ? "Sending…" : submitLabel}
      </Button>
      <p className="text-xs text-muted">
        Protected by Cloudflare Turnstile. By submitting you agree to our{" "}
        <a href="/privacy" className="text-silver underline-offset-4 hover:underline">
          privacy policy
        </a>
        .
      </p>
    </div>
  );
}
