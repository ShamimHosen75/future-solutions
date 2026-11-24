import Link from "next/link";
import { navigation, offices, site } from "@/content/site";
import { Logo } from "@/components/ui/logo";
import { Container, Stars } from "@/components/ui/primitives";
import { Facebook, Instagram, LinkedIn, Pin, Whatsapp, XLogo, YouTube } from "@/components/ui/icons";

const badges = [
  { name: "Google", text: "5.0 star rating" },
  { name: "Clutch", text: "Verified reviews" },
  { name: "Upwork", text: "Top Rated" },
  { name: "Behance", text: "Featured projects" },
];

const socials = [
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedIn },
  { label: "Facebook", href: site.socials.facebook, Icon: Facebook },
  { label: "Instagram", href: site.socials.instagram, Icon: Instagram },
  { label: "X", href: site.socials.x, Icon: XLogo },
  { label: "YouTube", href: site.socials.youtube, Icon: YouTube },
];

export const Footer = () => (
  <footer className="bg-[#020408] pt-16 pb-8 text-white">
    <Container>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {badges.map((b) => (
          <li key={b.name} className="flex flex-col items-start gap-1 rounded-xl bg-white px-4 py-3 text-ink sm:flex-row sm:items-center sm:gap-3">
            <span className="text-lg font-bold">{b.name}</span>
            <span className="flex flex-col gap-0.5 text-xs leading-tight text-muted">
              <Stars />
              <span>{b.text}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-dark">{site.tagline}</p>
          <p className="mt-8 text-sm font-medium">Want to talk directly?</p>
          <a href={`https://wa.me/${site.whatsapp}`} className="mt-3 inline-flex items-center gap-3 text-lg font-semibold hover:text-orange-400">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#25d366] text-white">
              <Whatsapp className="size-5" />
            </span>
            {site.phone}
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {navigation.footer.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="border-b border-white/15 pb-3 text-sm font-semibold">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-white/65 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <ul className="mt-16 grid gap-3 md:grid-cols-3">
        {offices.map((o) => (
          <li key={o.city} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgb(0_58_128/0.35),transparent_60%)] p-5">
            <span className="text-2xl" aria-hidden>
              {o.flag}
            </span>
            <Pin className="absolute right-5 top-5 size-5 text-white/50" />
            <p className="mt-3 text-lg font-semibold">{o.city}</p>
            <p className="mt-1 text-xs text-muted-dark">
              {o.address}, {o.country}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 text-xs text-white/55 md:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <ul className="flex gap-4">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a href={href} aria-label={label} className="text-white/60 transition-colors hover:text-orange-400">
                <Icon className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex gap-5">
          {navigation.legal.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </footer>
);
