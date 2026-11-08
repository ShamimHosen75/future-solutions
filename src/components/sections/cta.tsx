import { ArrowRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { whatsappLink } from "@/lib/utils";

export function CTA({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="py-24 md:py-32" aria-labelledby="cta-heading">
      <Container>
        <Reveal>
          <div data-live className="glass gradient-border-animated relative overflow-hidden rounded-[var(--radius-xl)] px-6 py-16 text-center md:px-16 md:py-24">
            <div aria-hidden className="absolute -top-1/2 left-1/2 -z-10 size-[120%] -translate-x-1/2 rounded-full bg-blue/20 blur-[140px]" />
            <div aria-hidden className="absolute -right-1/4 -bottom-1/2 -z-10 size-3/4 rounded-full bg-orange/15 blur-[140px]" />
            <span className="label">Ready when you are</span>
            <TextReveal
              as="h2"
              id="cta-heading"
              text={"Let's build something\nthat lasts."}
              highlight={["lasts."]}
              className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2rem,5.5vw,4.25rem)] leading-[1.02] font-bold text-white"
            />
            <p className="mx-auto mt-6 max-w-xl text-muted md:text-lg">
              Tell us about your project or your learning goals. We reply within one business day — usually much faster on WhatsApp.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact?intent=quote" size="lg">
                Get a free quote
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button href={whatsappLink(whatsapp, "Hi Future Solutions! I'd like to discuss a project.")} variant="secondary" size="lg">
                <MessageCircle className="size-4" aria-hidden />
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
