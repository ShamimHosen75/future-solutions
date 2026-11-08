import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { nav, site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import type { SiteSettings } from "@/types/content";

type FooterProps = {
  settings: SiteSettings;
  services: { title: string; slug: string }[];
};

export function Footer({ settings, services }: FooterProps) {
  const year = new Date().getFullYear();
  const socials = Object.entries(settings.socials).filter(([, url]) => Boolean(url));

  return (
    <footer className="relative mt-32 border-t border-border">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-gradient opacity-60" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <Logo size={44} />
          <p className="max-w-sm text-sm leading-relaxed text-muted">{settings.seo.description}</p>
          <ul className="flex flex-col gap-3 text-sm text-silver">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
              <span>{settings.contact.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-cyan" aria-hidden />
              <a href={`tel:${settings.contact.phone.replace(/\s|-/g, "")}`} className="hover:text-white">
                {settings.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-cyan" aria-hidden />
              <a href={`mailto:${settings.contact.email}`} className="hover:text-white">
                {settings.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <FooterColumn title="Services" className="lg:col-span-3">
          {services.map((s) => (
            <FooterLink key={s.slug} href={`/services/${s.slug}`}>
              {s.title}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Company" className="lg:col-span-2">
          {nav.footer.company.map((item) => (
            <FooterLink key={item.href} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Connect" className="lg:col-span-3">
          <FooterLink href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, "")}`} external>
            WhatsApp
          </FooterLink>
          {socials.map(([key, url]) => (
            <FooterLink key={key} href={url} external>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </FooterLink>
          ))}
          <FooterLink href="/admin">Admin</FooterLink>
        </FooterColumn>
      </div>

      <div className="border-t border-border">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {nav.footer.legal.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
            <span className="label hidden sm:inline">{site.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="label mb-5 font-label text-[0.65rem] text-silver">{title}</h3>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const classes =
    "group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-white";
  if (external) {
    return (
      <li>
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
          <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" aria-hidden />
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={classes}>
        {children}
      </Link>
    </li>
  );
}
