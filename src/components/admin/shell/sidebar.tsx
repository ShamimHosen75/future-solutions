"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { modules } from "@/lib/admin/modules";
import { adminIcons } from "./icons";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";

type SidebarProps = {
  role: UserRole;
  pendingReviews: number;
  newLeads: number;
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ role, pendingReviews, newLeads, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  React.useEffect(() => onClose(), [pathname, onClose]);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const Item = ({ href, icon, label, badge }: { href: string; icon: string; label: string; badge?: number }) => {
    const Icon = adminIcons[icon] ?? adminIcons["layers"]!;
    const active = isActive(href);
    return (
      <li>
        <Link
          href={href}
          data-no-transition
          aria-current={active ? "page" : undefined}
          className={cn(
            "group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors",
            active ? "bg-white/[0.06] text-white" : "text-muted hover:bg-white/[0.04] hover:text-white",
          )}
        >
          <Icon className={cn("size-4 shrink-0", active ? "text-cyan" : "text-muted group-hover:text-silver")} aria-hidden />
          <span className="flex-1 truncate">{label}</span>
          {badge ? (
            <span className="tabular rounded-full bg-brand-gradient px-1.5 py-0.5 text-[0.6rem] font-semibold text-white">{badge}</span>
          ) : null}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile scrim */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn("fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Dashboard navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Logo size={30} href="/admin" />
          <button type="button" onClick={onClose} className="rounded-full p-2 text-muted hover:text-white lg:hidden" aria-label="Close navigation">
            <X className="size-4" />
          </button>
        </div>
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            <Item href="/admin" icon="dashboard" label="Overview" />
          </ul>
          <p className="label mt-6 mb-2 px-3 text-[0.6rem]">Content</p>
          <ul className="flex flex-col gap-0.5">
            {modules.map((m) => (
              <Item key={m.key} href={`/admin/${m.key}`} icon={m.icon} label={m.label} badge={m.key === "testimonials" ? pendingReviews : undefined} />
            ))}
          </ul>
          <p className="label mt-6 mb-2 px-3 text-[0.6rem]">Operations</p>
          <ul className="flex flex-col gap-0.5">
            {role === "admin" ? <Item href="/admin/leads" icon="inbox" label="Leads inbox" badge={newLeads} /> : null}
            <Item href="/admin/media" icon="image" label="Media library" />
            {role === "admin" ? <Item href="/admin/settings" icon="settings" label="Site settings" /> : null}
            {role === "admin" ? <Item href="/admin/users" icon="shield" label="Users" /> : null}
          </ul>
        </nav>
        <div className="border-t border-border p-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white">
            <ExternalLink className="size-3.5" aria-hidden /> View live site
          </a>
        </div>
      </aside>
    </>
  );
}
