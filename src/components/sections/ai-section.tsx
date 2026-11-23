import { ai } from "@/content/home";
import { Container, Eyebrow, SplitText } from "@/components/ui/primitives";
import { NamedIcon } from "@/components/ui/icon-map";

/** Full-width brand-blue card (the reference uses green here; we use the logo's blue). */
export const AiSection = () => (
  <section className="bg-paper py-20 sm:py-28">
    <Container>
      <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(150deg,#003a80_0%,#00285a_45%,#04070d_100%)] p-7 text-white sm:p-12 lg:p-14">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-blue-400/30 blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-[30%] w-24 rotate-12 bg-white/5 blur-2xl" />

        <div className="relative max-w-2xl">
          <Eyebrow className="mb-5 text-blue-300">{ai.eyebrow}</Eyebrow>
          <SplitText text={ai.title} className="text-[2.1rem] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-5xl" />
          <p data-reveal className="mt-6 max-w-xl text-white/75">
            {ai.intro}
          </p>
        </div>

        <div className="relative mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <ul className="grid gap-3">
            {ai.features.map((f) => (
              <li key={f.title} data-reveal className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-400 ring-1 ring-white/15">
                  <NamedIcon name={f.icon} className="size-6" />
                </span>
                <span>
                  <span className="block font-semibold">{f.title}</span>
                  <span className="mt-1 block text-sm text-white/70">{f.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <AiEngineVisual />
        </div>
      </div>
    </Container>
  </section>
);

const AiEngineVisual = () => (
  <div data-reveal aria-hidden className="relative mx-auto hidden h-80 w-full max-w-md lg:block">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="absolute rounded-2xl border border-white/20 bg-white/[0.04] backdrop-blur"
        style={{ inset: `${70 - i * 14}px ${40 - i * 12}px ${10 + i * 14}px ${i * 12}px` }}
      />
    ))}
    <div className="absolute left-[22%] top-[28%] rounded-xl border border-blue-300/60 bg-ink/60 px-4 py-3 text-center text-sm">
      Ideas to prototype
      <br />
      in hours
    </div>
    <div className="absolute left-[30%] top-[6%] rounded-full border border-white/30 px-3 py-1 text-[11px]">AI design engine</div>
    <div className="absolute right-0 top-0 h-28 w-24 rotate-6 rounded-xl bg-gradient-orange shadow-xl motion-safe:animate-[float_6s_ease-in-out_infinite]" />
    <div className="absolute right-12 top-6 h-28 w-24 -rotate-3 rounded-xl bg-gradient-blue shadow-xl motion-safe:animate-[float_7s_ease-in-out_infinite]" />
    <div className="absolute bottom-14 left-10 right-24 space-y-2">
      <span className="block h-2.5 w-3/4 rounded-full bg-white/25" />
      <span className="block h-2.5 w-2/3 rounded-full bg-white/15" />
      <span className="block h-2.5 w-1/3 rounded-full bg-white/15" />
    </div>
  </div>
);
