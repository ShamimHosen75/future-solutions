"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { requestPasswordReset, signIn, updatePassword, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

const initial: AuthState = { status: "idle" };

function Banner({ state }: { state: AuthState }) {
  if (state.status === "idle" || !state.message) return null;
  const error = state.status === "error";
  return (
    <p role="alert" className={`flex items-start gap-2 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${error ? "border-orange/30 bg-orange/10 text-orange" : "border-cyan/30 bg-cyan/10 text-cyan"}`}>
      {error ? <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />}
      {state.message}
    </p>
  );
}

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action, pending] = React.useActionState(signIn, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next ?? "/admin"} />
      {notice ? <p className="rounded-[var(--radius-md)] border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">{notice}</p> : null}
      <Banner state={state} />
      <Field label="Email" htmlFor="email" required><Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@futuresolution.online" defaultValue={state.email ?? ""} /></Field>
      <Field label="Password" htmlFor="password" required><Input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} /></Field>
      <Button type="submit" size="lg" disabled={pending} className="w-full">{pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} Sign in</Button>
      <Link href="/admin/forgot-password" data-no-transition className="text-center text-xs text-muted hover:text-white">Forgot your password?</Link>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = React.useActionState(requestPasswordReset, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <Banner state={state} />
      <Field label="Email" htmlFor="email" required><Input id="email" name="email" type="email" autoComplete="email" required /></Field>
      <Button type="submit" size="lg" disabled={pending} className="w-full">{pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} Send reset link</Button>
      <Link href="/admin/login" data-no-transition className="text-center text-xs text-muted hover:text-white">Back to sign in</Link>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = React.useActionState(updatePassword, initial);
  return (
    <form action={action} className="flex flex-col gap-5">
      <Banner state={state} />
      <Field label="New password" htmlFor="password" required hint="At least 8 characters."><Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} /></Field>
      <Field label="Confirm password" htmlFor="confirm" required><Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} /></Field>
      <Button type="submit" size="lg" disabled={pending} className="w-full">{pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} Update password</Button>
    </form>
  );
}
