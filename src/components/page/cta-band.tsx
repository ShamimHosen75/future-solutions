import { Avatar, Button, Container } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

type CtaBandProps = {
  title?: string;
  text?: string;
  cta?: { label: string; href: string };
  tone?: "light" | "dark";
};

/** Closing call to action used at the bottom of inner pages. */
export const CtaBand = ({
  title = "Ready to build something great?",
  text = "Tell us about your project. We reply within 12 hours with honest advice and next steps.",
  cta = { label: "Let's talk", href: "/contact" },
  tone = "light",
}: CtaBandProps) => (
  <section className={cn("py-16 sm:py-20", tone === "dark" ? "bg-ink" : "bg-paper")}>
    <Container>
      <div
        data-zoom
        className="relative overflow-hidden rounded-[calc(var(--radius-card)*1.4)] bg-[linear-gradient(135deg,#003a80_0%,#04070d_55%,#3a0d00_100%)] px-6 py-12 text-white ring-1 ring-white/10 sm:px-12 sm:py-16"
      >
        <div aria-hidden data-parallax="0.4" className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-orange-600/30 blur-[100px]" />
        <div aria-hidden data-parallax="-0.4" className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-blue-500/30 blur-[100px]" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="mb-5 flex -space-x-2">
              {["Team Lead", "Lead Designer", "Lead Developer"].map((name, i) => (
                <Avatar key={name} name={name} hue={i % 2 ? "blue" : "orange"} className="ring-2 ring-ink" />
              ))}
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl">{title}</h2>
            <p className="mt-4 text-base text-pretty text-white/70">{text}</p>
          </div>
          <Button href={cta.href} size="lg" className="shrink-0">
            {cta.label}
          </Button>
        </div>
      </div>
    </Container>
  </section>
);
