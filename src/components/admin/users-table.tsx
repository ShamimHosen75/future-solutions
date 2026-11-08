"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { inviteUser, setUserActive, updateUserRole } from "@/app/actions/users";
import { Switch } from "@/components/admin/ui/switch";
import { Dialog, DialogContent } from "@/components/admin/ui/dialog";
import { useToast } from "@/components/admin/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { initials } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/types/content";

export function UsersTable({ users, currentUserId, canInvite }: { users: Profile[]; currentUserId: string; canInvite: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [inviteState, inviteAction, invitePending] = React.useActionState(inviteUser, null);

  React.useEffect(() => {
    if (!inviteState) return;
    toast({ title: inviteState.ok ? (inviteState.message ?? "Invitation sent") : (inviteState.message ?? "Invite failed"), tone: inviteState.ok ? "success" : "error" });
    if (inviteState.ok) {
      setInviteOpen(false);
      router.refresh();
    }
  }, [inviteState, router, toast]);

  const run = (fn: () => Promise<{ ok: boolean; message?: string }>) =>
    startTransition(async () => {
      const r = await fn();
      toast({ title: r.ok ? (r.message ?? "Saved") : (r.message ?? "Failed"), tone: r.ok ? "success" : "error" });
      router.refresh();
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button type="button" onClick={() => setInviteOpen(true)}><UserPlus className="size-4" aria-hidden /> Invite user</Button>
      </div>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface/40">
        <table className="w-full text-sm">
          <thead className="bg-surface/60 text-left text-xs text-muted">
            <tr>{["User", "Role", "Active", "Joined"].map((h) => (<th key={h} className="px-4 py-3 font-medium">{h}</th>))}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => {
              const self = u.id === currentUserId;
              return (
                <tr key={u.id} className={pending ? "opacity-70" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-brand-gradient font-display text-[0.65rem] font-bold text-white">{initials(u.full_name || u.email)}</span>
                      <div><p className="font-medium text-white">{u.full_name ?? "—"} {self ? <Badge tone="cyan" className="ml-1">You</Badge> : null}</p><p className="text-xs text-muted">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-36"><Select value={u.role} disabled={self} aria-label={`Role for ${u.email}`} onChange={(e) => run(() => updateUserRole(u.id, e.target.value))}><option value="admin">Admin</option><option value="editor">Editor</option></Select></div>
                  </td>
                  <td className="px-4 py-3"><Switch checked={u.is_active} disabled={self} aria-label={`Active for ${u.email}`} onCheckedChange={(v) => run(() => setUserActive(u.id, v))} /></td>
                  <td className="tabular px-4 py-3 text-xs text-muted">{formatDate(u.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">Admins manage everything. Editors can manage content and media but not leads, settings or users.</p>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent title="Invite a user" description="They'll receive an email to set their password.">
          {canInvite ? (
            <form action={inviteAction} className="flex flex-col gap-4">
              <Field label="Email" htmlFor="invite-email" required><Input id="invite-email" name="email" type="email" required placeholder="colleague@futuresolution.online" /></Field>
              <Field label="Full name" htmlFor="invite-name"><Input id="invite-name" name="full_name" placeholder="Optional" /></Field>
              <Field label="Role" htmlFor="invite-role"><Select id="invite-role" name="role" defaultValue="editor"><option value="editor">Editor (content only)</option><option value="admin">Admin (everything)</option></Select></Field>
              <Button type="submit" disabled={invitePending}>{invitePending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} Send invitation</Button>
            </form>
          ) : (
            <p className="text-sm text-muted">Set <code className="font-mono text-xs text-silver">SUPABASE_SERVICE_ROLE_KEY</code> on the server to invite users from here. Until then, add users in Supabase → Authentication → Users; they appear below automatically.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
