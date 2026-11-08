import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { getSettings } from "@/lib/data/settings";
import { getPublishedServices } from "@/lib/data/services";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Talk to Future Solutions about your website, app, software, marketing or training needs. Visit us in Uttara, Dhaka, call, email or message on WhatsApp.",
  path: "/contact",
});

type SearchParams = Promise<{ intent?: string; service?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const [{ intent, service }, settings, services] = await Promise.all([searchParams, getSettings(), getPublishedServices()]);
  const { contact } = settings;
  const isQuote = intent === "quote";
  const defaultServiceId = services.find((s) => s.slug === service)?.id;
  const mapSrc = contact.mapEmbedUrl || `https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${site.url}/contact`,
    mainEntity: { "@id": `${site.url}/#organization` },
  };

  return (
    <>
      <JsonLd data={[jsonLd, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])]} />
      <PageHeader
        eyebrow={isQuote ? "Get a quote" : "Contact"}
        title={isQuote ? "Tell us about\nyour project." : "Let's talk about\nwhat's next."}
        highlight={isQuote ? ["project."] : ["next."]}
        description={isQuote ? "Share your goals, timeline and budget range. We reply within one business day with next steps and a ballpark estimate." : "Questions, ideas, partnerships or just saying hello. We reply within one business day, usually much faster on WhatsApp."}
      />

      <Container className="grid gap-10 pb-8 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-4">
          <Reveal>
            <GlassCard className="flex flex-col gap-6">
              <ContactRow icon={MapPin} label="Studio"><span>{contact.address}</span></ContactRow>
              <ContactRow icon={Phone} label="Phone"><a href={`tel:${contact.phone.replace(/\s|-/g, "")}`} className="hover:text-white">{contact.phone}</a></ContactRow>
              <ContactRow icon={Mail} label="Email"><a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a></ContactRow>
              <ContactRow icon={Clock} label="Hours"><span>Sat – Thu · 10:00 – 19:00 (GMT+6)</span></ContactRow>
              <Button href={whatsappLink(contact.whatsapp, "Hi Future Solutions! I'd like to talk about a project.")} variant="secondary" className="mt-2 w-full">
                <MessageCircle className="size-4" aria-hidden /> Chat on WhatsApp
              </Button>
            </GlassCard>
          </Reveal>
          <Reveal>
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border">
              <iframe
                title={`Map of ${site.name} office`}
                src={mapSrc}
                width="100%"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block w-full grayscale-[0.4] contrast-[1.05] invert-[0.92] hue-rotate-180"
              />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal>
            <GlassCard padding="lg">
              <h2 className="font-display text-2xl font-semibold text-white">{isQuote ? "Request a quote" : "Send us a message"}</h2>
              <p className="mt-2 mb-8 text-sm text-muted">Fields marked * are required.</p>
              <ContactForm services={services.map((s) => ({ id: s.id, title: s.title }))} intent={isQuote ? "quote" : "contact"} defaultServiceId={defaultServiceId} />
            </GlassCard>
          </Reveal>
        </div>
      </Container>
    </>
  );
}

function ContactRow({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] text-cyan ring-1 ring-border"><Icon className="size-4" aria-hidden /></span>
      <div className="text-sm text-silver"><p className="label mb-1">{label}</p>{children}</div>
    </div>
  );
}
