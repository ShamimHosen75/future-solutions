"use client";

import { useEffect, useRef, useState } from "react";
import { pricing } from "@/content/pricing";
import { Button } from "@/components/ui/primitives";
import { Check } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Tab = "subscription" | "project";
type Billing = "monthly" | "quarterly";

const format = (n: number) => `${pricing.currency}${Math.round(n).toLocaleString("en-US")}`;

/** Tweens between price values when the billing period changes. */
const AnimatedPrice = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const initial = from.current;
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 500);
      const next = initial + (value - initial) * (1 - Math.pow(1 - t, 3));
      setDisplay(next);
      from.current = next;
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span className="tabular-nums">{format(display)}</span>;
};

const Segmented = <T extends string>({ options, value, onChange, label }: { options: { value: T; label: React.ReactNode }[]; value: T; onChange: (v: T) => void; label: string }) => (
  <div role="tablist" aria-label={label} className="inline-flex rounded-full border border-line bg-white p-1">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        role="tab"
        aria-selected={value === o.value}
        onClick={() => onChange(o.value)}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-[background-color,color] duration-300 sm:px-5",
          value === o.value ? "bg-ink text-white" : "text-muted hover:text-ink",
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export const PricingPlans = () => {
  const [tab, setTab] = useState<Tab>("subscription");
  const [billing, setBilling] = useState<Billing>("monthly");
  const discount = billing === "quarterly" ? 1 - pricing.quarterlyDiscount : 1;

  return (
    <div>
      <div data-reveal className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <Segmented
          label="Pricing type"
          value={tab}
          onChange={setTab}
          options={[
            { value: "subscription", label: "Monthly plans" },
            { value: "project", label: "Fixed projects" },
          ]}
        />
        {tab === "subscription" ? (
          <Segmented
            label="Billing period"
            value={billing}
            onChange={setBilling}
            options={[
              { value: "monthly", label: "Monthly" },
              {
                value: "quarterly",
                label: (
                  <>
                    Quarterly
                    <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[11px] font-semibold text-orange-600">Save {pricing.quarterlyDiscount * 100}%</span>
                  </>
                ),
              },
            ]}
          />
        ) : (
          <p className="text-sm text-muted">One-off price, paid in milestones</p>
        )}
      </div>

      {tab === "subscription" ? (
        <ul key="subscription" className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricing.subscription.map((plan, i) => (
            <li
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-[calc(var(--radius-card)*1.2)] p-7 motion-safe:animate-[fade-in_0.5s_ease-out_both]",
                plan.highlighted ? "bg-ink text-white shadow-[0_40px_80px_-40px_rgb(253_77_0/0.6)] ring-1 ring-orange-500/50" : "border border-line bg-white",
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 left-7 rounded-full bg-gradient-orange px-3 py-1 text-xs font-semibold text-white">Most popular</span>
              ) : null}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className={cn("mt-2 text-sm", plan.highlighted ? "text-muted-dark" : "text-muted")}>{plan.description}</p>
              <p className="mt-8 flex items-baseline gap-1.5">
                {plan.monthly ? (
                  <>
                    <span className="text-5xl font-semibold tracking-tight">
                      <AnimatedPrice value={plan.monthly * discount} />
                    </span>
                    <span className={cn("text-sm", plan.highlighted ? "text-muted-dark" : "text-muted")}>/ month</span>
                  </>
                ) : (
                  <span className="text-5xl font-semibold tracking-tight">Let&apos;s talk</span>
                )}
              </p>
              <p className={cn("mt-2 min-h-5 text-xs", plan.highlighted ? "text-white/60" : "text-muted")}>
                {plan.monthly && billing === "quarterly" ? `Billed ${format(plan.monthly * discount * 3)} every 3 months` : "Pause or cancel anytime"}
              </p>
              <p className={cn("mt-6 rounded-xl px-4 py-3 text-sm font-medium", plan.highlighted ? "bg-white/[0.06]" : "bg-paper")}>{plan.team}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={cn("mt-0.5 size-4 shrink-0", plan.highlighted ? "text-orange-400" : "text-orange-500")} strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button href="/contact" variant={plan.highlighted ? "primary" : "outline-light"} className="mt-8 w-full">
                {plan.monthly ? "Book a free call" : "Contact us"}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <ul key="project" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pricing.projects.map((p, i) => (
            <li
              key={p.name}
              className="flex flex-col rounded-[calc(var(--radius-card)*1.2)] border border-line bg-white p-6 motion-safe:animate-[fade-in_0.5s_ease-out_both]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-blue-600">{p.days}</p>
              <p className="mt-6 text-sm text-muted">From</p>
              <p className="text-4xl font-semibold tracking-tight">{format(p.from)}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-orange-500" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button href="/contact" variant="outline-light" className="mt-8 w-full">
                Get a quote
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
