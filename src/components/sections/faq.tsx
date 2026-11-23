"use client";

import { useState } from "react";
import { faq } from "@/content/home";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { ChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/** One-open-at-a-time accordion. Height animates via the grid-rows 0fr -> 1fr trick. */
export const Faq = () => {
  const [open, setOpen] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };

  return (
    <Section id="faq" tone="light">
      <Container className="max-w-[920px]">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />
        <ul className="border-t border-line">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} data-reveal className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold tracking-tight transition-colors hover:text-orange-600 sm:text-xl"
                  >
                    {item.q}
                    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-500", isOpen ? "rotate-180 border-orange-500 bg-orange-500 text-white" : "border-line")}>
                      <ChevronDown className="size-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={cn("grid transition-[grid-template-rows,opacity] duration-500 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </Section>
  );
};
