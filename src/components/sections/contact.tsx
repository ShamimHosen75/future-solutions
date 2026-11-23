import { contact } from "@/content/home";
import { site } from "@/content/site";
import { Avatar, Button, Container } from "@/components/ui/primitives";
import { ArrowRight, CornerDownRight, LinkedIn, Mail, Whatsapp } from "@/components/ui/icons";
import { BriefForm } from "./brief-form";

export const Contact = () => (
  <section id="contact" data-tone="dark" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
    <div aria-hidden className="pointer-events-none absolute -left-40 top-20 size-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
    <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 size-[500px] rounded-full bg-orange-600/15 blur-[120px]" />
    <Container className="relative grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-5">
        <div data-reveal className="rounded-[var(--radius-card)] border border-white/10 bg-black/40 p-6 sm:p-7">
          <div className="flex flex-wrap gap-6">
            {contact.leads.map((lead, i) => (
              <div key={i} className="flex items-center gap-3">
                <Avatar name={lead.name} hue={i ? "blue" : "orange"} />
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    {lead.name}
                    <a href={site.socials.linkedin} aria-label={`${lead.name} on LinkedIn`} className="text-blue-400 hover:text-blue-300">
                      <LinkedIn className="size-3.5" />
                    </a>
                  </p>
                  <p className="text-xs text-muted-dark">{lead.role}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-medium">Next steps</p>
          <ol className="mt-3 space-y-3">
            {contact.steps.map((step) => (
              <li key={step} className="flex items-start gap-3 text-sm text-white/80">
                <CornerDownRight className="mt-0.5 size-4 shrink-0 text-orange-400" />
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-8 grid gap-3">
            <ContactRow href={`mailto:${site.email}`} label="Email" value={site.email} icon={<Mail className="size-4" />} />
            <ContactRow href={`https://wa.me/${site.whatsapp}`} label="WhatsApp" value={site.phone} icon={<Whatsapp className="size-4" />} />
          </div>
        </div>

        <div data-reveal className="rounded-[var(--radius-card)] bg-[linear-gradient(135deg,#cdf3ff,#ffe6cc)] p-6 text-ink sm:p-7">
          <p className="text-lg font-semibold">{contact.booking.title}</p>
          <p className="mt-1.5 max-w-sm text-sm text-ink/70">{contact.booking.text}</p>
          <Button href={site.bookingUrl} variant="dark" className="mt-5">
            {contact.booking.cta}
          </Button>
        </div>
      </div>

      <div data-reveal>
        <BriefForm />
      </div>
    </Container>
  </section>
);

const ContactRow = ({ href, label, value, icon }: { href: string; label: string; value: string; icon: React.ReactNode }) => (
  <a href={href} className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/25">
    <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white">{icon}</span>
    <span className="flex-1">
      <span className="block text-xs text-muted-dark">{label}</span>
      <span className="block text-sm font-semibold">{value}</span>
    </span>
    <ArrowRight className="size-4 text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-white" />
  </a>
);
