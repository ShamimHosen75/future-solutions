import { partners } from "@/content/home";
import { Marquee } from "@/components/motion/marquee";

/** Placeholder wordmark. Replace with <Image src="/clients/name.svg" /> once real logos are supplied. */
const Wordmark = ({ name, index }: { name: string; index: number }) => (
  <span className="flex h-14 min-w-36 items-center justify-center gap-2 px-4 text-lg font-semibold tracking-tight text-text/45 grayscale transition-colors duration-300 hover:text-text">
    <span
      aria-hidden
      className={index % 3 === 0 ? "size-5 rounded-md bg-current" : index % 3 === 1 ? "size-5 rounded-full border-[3px] border-current" : "size-5 rotate-45 rounded-sm bg-current"}
    />
    {name}
  </span>
);

export const Partners = () => (
  <section className="bg-paper pb-20 sm:pb-28" aria-labelledby="partners-title">
    <p id="partners-title" data-reveal className="mb-8 text-center text-sm font-medium text-muted">
      {partners.title}
    </p>
    <div className="space-y-3">
      {partners.rows.map((row, i) => (
        <Marquee key={i} reverse={i % 2 === 1} duration={45 + i * 8} gapClass="gap-6">
          {row.map((name, j) => (
            <Wordmark key={name} name={name} index={i + j} />
          ))}
        </Marquee>
      ))}
    </div>
  </section>
);
