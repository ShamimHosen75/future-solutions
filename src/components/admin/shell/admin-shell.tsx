"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { ToastProvider } from "@/components/admin/ui/toast";
import type { Profile } from "@/types/content";

type AdminShellProps = {
  profile: Profile;
  pendingReviews: number;
  newLeads: number;
  children: React.ReactNode;
};

export function AdminShell({ profile, pendingReviews, newLeads, children }: AdminShellProps) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <ToastProvider>
      <div className="flex min-h-dvh bg-bg">
        <Sidebar role={profile.role} pendingReviews={pendingReviews} newLeads={newLeads} open={open} onClose={close} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar profile={profile} onMenu={() => setOpen(true)} />
          <main id="main" className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
