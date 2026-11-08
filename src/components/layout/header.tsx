"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { nav } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on route change and lock body scroll while open.
  React.useEffect(() => setOpen(false), [pathname]);
  React.useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-[var(--announcement-h,0rem)] z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || open
          ? "border-b border-border bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.main.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-white",
                  active && "text-white",
                )}
              >
                {item.label}
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-4 -bottom-px h-px bg-brand-gradient"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/contact" variant="outline" size="sm">
            Contact
          </Button>
          <Button href="/contact?intent=quote" size="sm">
            Get a quote
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full text-silver transition hover:bg-white/5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={cn(
          "lg:hidden",
          "fixed inset-x-0 top-[calc(var(--header-h)+var(--announcement-h,0rem))] bottom-0 overflow-y-auto bg-bg/95 backdrop-blur-2xl transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-6">
          {nav.main.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
              className={cn(
                "flex items-center justify-between border-b border-border py-4 font-display text-xl font-medium text-white transition-[opacity,transform] duration-500",
                open ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0",
              )}
            >
              {item.label}
              <span className="tabular text-xs text-muted">0{i + 1}</span>
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/contact?intent=quote" size="lg" tabIndex={open ? 0 : -1}>
              Get a quote
            </Button>
            <Button href="/contact" variant="secondary" size="lg" tabIndex={open ? 0 : -1}>
              Contact us
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
