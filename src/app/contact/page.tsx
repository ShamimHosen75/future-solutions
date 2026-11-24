import type { Metadata } from "next";
import { contactPage } from "@/content/contact-page";
import { offices, site } from "@/content/site";
import { PageHero } from "@/components/page/page-hero";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { NamedIcon } from "@/components/ui/icon-map";
import { ArrowUpRight, Mail, Pin, Whatsapp } from "@/components/ui/icons";
import { Contact } from "@/components/sections/contact";
import { Recognition } from "@/components/sections/recognition";
import { Faq } from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "Contact us",
  description: contactPage.intro,
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow={contactPage.eyebrow} title={contactPage.title} intro={contactPage.intro} crumbs={[{ label: "Contact" }]} flush />
      <Contact />

      <Section tone="light">
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactPage.features.map((f) => (
              <li key={f.title} data-reveal="scale" className="rounded-[var(--radius-card)] border border-line bg-white p-6">
                <NamedIcon name={f.icon} className="size-8 text-orange-500" />
                <h2 className="mt-6 text-lg font-semibold">{f.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="light" className="pt-0 sm:pt-0" id="offices">
        <Container>
          <SectionHeading eyebrow="Our offices" title="Visit or call us" />
          <ul className="grid gap-4 md:grid-cols-3">
            {offices.map((o) => (
              <li key={o.city} data-reveal="scale" className="flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-6">
                <div className="flex items-start justify-between">
                  <span className="text-3xl" aria-hidden>
                    {o.flag}
                  </span>
                  <Pin className="size-5 text-orange-500" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{o.city}</h3>
                <p className="text-sm text-muted">{o.country}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed">{o.address}</p>
                <div className="mt-6 grid gap-2 border-t border-line pt-5 text-sm">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.address}, ${o.country}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between font-medium hover:text-orange-600"
                  >
                    Open in Google Maps <ArrowUpRight className="size-4" />
                  </a>
                  <a href={`https://wa.me/${site.whatsapp}`} className="flex items-center gap-2 text-muted hover:text-ink">
                    <Whatsapp className="size-4" /> {site.phone}
                  </a>
                  <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-muted hover:text-ink">
                    <Mail className="size-4" /> {site.email}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Recognition />
      <Faq eyebrow="FAQs" title="Before you get in touch" items={contactPage.faqs} />
    </>
  );
}
