"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/admin/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/content";
import type { Profile } from "@/types/content";

export function Topbar({ profile, onMenu }: { profile: Profile; onMenu: () => void }) {
  const name = profile.full_name || profile.email;
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-bg/80 px-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenu} className="rounded-full p-2 text-muted hover:text-white lg:hidden" aria-label="Open navigation">
          <Menu className="size-5" />
        </button>
        <span className="label hidden sm:inline">Dashboard</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 rounded-full border border-border py-1 pr-3 pl-1 text-sm text-silver hover:border-border-strong hover:text-white">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-gradient font-display text-[0.65rem] font-bold text-white">{initials(name)}</span>
          <span className="hidden max-w-40 truncate sm:inline">{name}</span>
          <Badge tone={profile.role === "admin" ? "amber" : "cyan"} className="hidden sm:inline-flex">{profile.role}</Badge>
          <ChevronDown className="size-4 text-muted" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="px-3 py-2 text-xs text-muted">
            <p className="truncate font-medium text-white">{name}</p>
            <p className="truncate">{profile.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/profile" data-no-transition><UserRound className="size-4" aria-hidden /> My profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void signOut()}>
            <LogOut className="size-4" aria-hidden /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
