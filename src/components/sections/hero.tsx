import { hero } from "@/content/home";
import { Button, Container, SplitText, Stars } from "@/components/ui/primitives";
import { Counter } from "@/components/motion/counter";
import { HeroVisual } from "./hero-visual";

const Stat = ({ value, suffix, label, decimals }: (typeof hero.stats)[number]) => (
  <div data-reveal>
    <p className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
      <Counter value={value} suffix={suffix} decimals={decimals ?? 0} />
    </p>
    <p className="mt-1 text-sm text-muted-dark">{label}</p>
  </div>
);

export const Hero = () => {
  const [a, b, c, d] = hero.stats;
  return (
    <section data-tone="dark" className="relative overflow-hidden bg-ink pt-32 text-white sm:pt-40">
      {/* Brand glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-orange-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-[10%] h-[380px] w-[520px] rounded-full bg-blue-600/25 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      </div>

      <Container className="relative text-center">
        <ul data-reveal className="mx-auto mb-8 flex flex-wrap items-center justify-center gap-2" aria-label="Reviewed on">
          {hero.badges.map((badge) => (
            <li key={badge} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
              <span className="font-semibold text-white">{badge}</span>
              <Stars />
            </li>
          ))}
        </ul>

        <SplitText
          as="h1"
          text={hero.title}
          className="mx-auto max-w-4xl text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-[4.75rem]"
        />
        <p data-reveal className="mx-auto mt-6 max-w-xl text-base text-pretty text-muted-dark sm:text-lg">
          {hero.subtitle}
        </p>
        <div data-reveal className="mt-9 flex justify-center">
          <Button href={hero.cta.href} size="lg">
            {hero.cta.label}
          </Button>
        </div>

        <div className="relative mt-14 grid grid-cols-2 gap-x-6 gap-y-8 text-left sm:mt-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="space-y-8 md:pb-16">
            {a ? <Stat {...a} /> : null}
            {b ? <Stat {...b} /> : null}
          </div>
          <div className="order-last col-span-2 md:order-none md:col-span-1">
            <HeroVisual />
          </div>
          <div className="space-y-8 md:pb-16 md:text-right">
            {c ? <Stat {...c} /> : null}
            {d ? <Stat {...d} /> : null}
          </div>
        </div>
      </Container>
    </section>
  );
};
