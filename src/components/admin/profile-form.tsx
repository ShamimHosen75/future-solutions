"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { updateOwnProfile } from "@/app/actions/users";
import { updatePassword, type AuthState } from "@/app/actions/auth";
import { useToast } from "@/components/admin/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import type { Profile } from "@/types/content";

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, action, pending] = React.useActionState(updateOwnProfile, null);
  const [pwState, pwAction, pwPending] = React.useActionState(updatePassword, { status: "idle" } as AuthState);

  React.useEffect(() => {
    if (!state) return;
    toast({ title: state.ok ? (state.message ?? "Saved") : state.message, tone: state.ok ? "success" : "error" });
    if (state.ok) router.refresh();
  }, [state, router, toast]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={action} className="flex flex-col gap-5 rounded-[var(--radius-lg)] border border-border bg-surface/40 p-6">
        <h2 className="label">Details</h2>
        <Field label="Email" htmlFor="p-email"><Input id="p-email" value={profile.email} readOnly disabled /></Field>
        <Field label="Full name" htmlFor="full_name"><Input id="full_name" name="full_name" defaultValue={profile.full_name ?? ""} /></Field>
        <p className="text-sm text-muted">Role: <Badge tone={profile.role === "admin" ? "amber" : "cyan"}>{profile.role}</Badge></p>
        <Button type="submit" size="sm" className="w-fit" disabled={pending}>{pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} Save</Button>
      </form>
      <form action={pwAction} className="flex flex-col gap-5 rounded-[var(--radius-lg)] border border-border bg-surface/40 p-6">
        <h2 className="label">Change password</h2>
        {pwState.status === "error" && pwState.message ? <p role="alert" className="text-sm text-orange">{pwState.message}</p> : null}
        <Field label="New password" htmlFor="password" hint="At least 8 characters."><Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /></Field>
        <Field label="Confirm password" htmlFor="confirm"><Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required /></Field>
        <Button type="submit" size="sm" variant="secondary" className="w-fit" disabled={pwPending}>{pwPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} Update password</Button>
      </form>
    </div>
  );
}
