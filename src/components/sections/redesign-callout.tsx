import { redesign } from "@/content/home";
import { Container } from "@/components/ui/primitives";

/** Dark band with a short redesign pitch and a drawn growth curve, like the reference. */
export const RedesignCallout = () => (
  <section data-tone="dark" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
    <Container className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
      <div>
        <span data-reveal className="inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
          {redesign.eyebrow}
        </span>
        <p data-reveal className="mt-6 text-2xl leading-snug font-medium tracking-tight text-pretty sm:text-3xl">
          {redesign.text}
        </p>
      </div>
      <svg data-reveal="scale" viewBox="0 0 400 300" className="mx-auto w-full max-w-sm md:max-w-none" aria-hidden>
        <defs>
          <linearGradient id="curve" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0" stopColor="#006bc8" />
            <stop offset="0.5" stopColor="#00d4ff" />
            <stop offset="1" stopColor="#fe6b01" />
          </linearGradient>
        </defs>
        <path d="M20 280 H390" stroke="rgb(255 255 255 / 0.15)" />
        <path d="M20 20 V280" stroke="rgb(255 255 255 / 0.15)" />
        <path
          d="M20 270 C 140 265, 200 240, 250 180 S 330 40, 380 25"
          fill="none"
          stroke="url(#curve)"
          strokeWidth="3"
          strokeLinecap="round"
          className="[stroke-dasharray:1600] motion-safe:animate-[dash_4s_ease-out_both]"
        />
        <circle cx="380" cy="25" r="6" fill="#fe6b01" />
        <circle cx="380" cy="25" r="14" fill="#fe6b01" opacity="0.25" className="motion-safe:animate-ping [transform-origin:380px_25px]" />
        <rect x="14" y="264" width="12" height="12" fill="none" stroke="rgb(255 255 255 / 0.5)" />
      </svg>
    </Container>
  </section>
);
