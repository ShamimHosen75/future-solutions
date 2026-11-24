import { numbers } from "@/content/home";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Counter } from "@/components/motion/counter";
import { cn } from "@/lib/cn";

const tones = {
  navy: "bg-[linear-gradient(140deg,#003a80,#04070d)] text-white",
  cyan: "bg-[#cdf3ff] text-ink",
  sand: "bg-[#ffe6cc] text-ink",
  orange: "bg-gradient-orange text-white",
} as const;

/** Decorative glyph pattern on each tile, different per tone. */
const Pattern = ({ tone }: { tone: keyof typeof tones }) => (
  <span aria-hidden className="grid grid-cols-4 gap-1.5 opacity-80">
    {Array.from({ length: 12 }).map((_, i) => (
      <span
        key={i}
        className={cn(
          "size-3",
          tone === "navy" && (i % 3 === 0 ? "rounded-full bg-blue-400" : "rounded-full bg-white/25"),
          tone === "cyan" && (i % 2 === 0 ? "rotate-45 bg-blue-600" : "rotate-45 bg-blue-600/30"),
          tone === "sand" && (i % 4 === 1 ? "rounded-sm bg-orange-600" : "rounded-sm bg-orange-600/30"),
          tone === "orange" && "[clip-path:polygon(50%_0,100%_100%,0_100%)] bg-white/80",
        )}
      />
    ))}
  </span>
);

export const ByTheNumbers = () => (
  <section className="bg-paper pb-20 sm:pb-28">
    <Container>
      <div className="mx-auto mb-12 max-w-xl text-center">
        <Eyebrow className="mb-4">{numbers.eyebrow}</Eyebrow>
        <p data-reveal className="text-sm text-muted sm:text-base">
          {numbers.intro}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {numbers.tiles.map((t) => (
          <div key={t.label} data-reveal="scale" className={cn("flex items-center justify-between rounded-[var(--radius-card)] p-7 sm:p-8", tones[t.tone])}>
            <div>
              <p className="text-5xl font-semibold tracking-tight sm:text-6xl">
                <Counter value={t.value} suffix={t.suffix} decimals={"decimals" in t ? t.decimals : 0} />
              </p>
              <p className="mt-2 text-sm font-medium opacity-80">{t.label}</p>
            </div>
            <Pattern tone={t.tone} />
          </div>
        ))}
      </div>
    </Container>
  </section>
);
