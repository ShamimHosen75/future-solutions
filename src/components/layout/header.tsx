"use client";

import { useEffect, useRef, useState } from "react";
import { navigation } from "@/content/site";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/primitives";
import { ChevronDown, Close, Menu } from "@/components/ui/icons";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setMobileOpen(false), setServicesOpen(false));
    const onHash = () => setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [mobileOpen]);

  const openServices = () => {
    clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeServicesSoon = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 150);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500",
        hidden && !mobileOpen && !servicesOpen ? "-translate-y-full" : "translate-y-0",
        scrolled || mobileOpen ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <a href="#work" className="rounded-full px-3.5 py-2 text-sm text-white/80 transition-colors hover:text-white">
            Work
          </a>
          <div className="relative" onMouseEnter={openServices} onMouseLeave={closeServicesSoon}>
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
              onClick={() => setServicesOpen((v) => !v)}
              className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              Services
              <ChevronDown className={cn("size-4 transition-transform duration-300", servicesOpen && "rotate-180")} />
            </button>
            <div
              id="services-menu"
              className={cn(
                "absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3 transition-[opacity,transform] duration-300",
                servicesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
              )}
            >
              <div className="grid grid-cols-3 gap-6 rounded-2xl border border-white/10 bg-ink-2/95 p-6 shadow-2xl backdrop-blur-xl">
                {navigation.services.map((col) => (
                  <div key={col.group}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">{col.group}</p>
                    <ul className="space-y-2">
                      {col.items.map((item) => (
                        <li key={item}>
                          <a href="#services" className="text-sm text-white/75 transition-colors hover:text-white">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {navigation.main.slice(1).map((item) => (
            <a key={item.label} href={item.href} className="rounded-full px-3.5 py-2 text-sm text-white/80 transition-colors hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Button href="#contact">Let&apos;s talk</Button>
          </div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-18 bottom-0 overflow-y-auto bg-ink px-5 pb-10 pt-6 transition-[opacity,visibility] duration-300 lg:hidden",
          mobileOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {navigation.main.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "border-b border-white/10 py-4 text-2xl font-medium text-white transition-[opacity,transform] duration-500",
                mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
              style={{ transitionDelay: mobileOpen ? `${80 + i * 50}ms` : "0ms" }}
            >
              {item.label}
            </a>
          ))}
          <details className="group border-b border-white/10 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-2xl font-medium text-white">
              Services <ChevronDown className="size-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4 grid gap-5">
              {navigation.services.map((col) => (
                <div key={col.group}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-400">{col.group}</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {col.items.map((item) => (
                      <li key={item}>
                        <a href="#services" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </nav>
        <Button href="#contact" size="lg" className="mt-8 w-full">
          Let&apos;s talk
        </Button>
      </div>
    </header>
  );
};
