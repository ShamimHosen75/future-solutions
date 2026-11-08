"use client";

import * as React from "react";
import { Check, Minus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/motion/tilt-card";
import { asStringArray } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/types/content";

type Billing = "monthly" | "yearly" | "one_time";
const billingLabels: Record<Billing, string> = { monthly: "Monthly", yearly: "Yearly", one_time: "One-time" };

function priceFor(plan: PricingPlan, billing: Billing): number | null {
  if (billing === "monthly") return plan.price_monthly === null ? null : Number(plan.price_monthly);
  if (billing === "yearly") return plan.price_yearly === null ? null : Number(plan.price_yearly);
  return plan.price_one_time === null ? null : Number(plan.price_one_time);
}

function Price({ amount, billing }: { amount: number | null; billing: Billing }) {
  if (amount === null) return <span className="font-display text-3xl font-semibold text-white">Custom</span>;
  const monthlyEquivalent = billing === "yearly" ? Math.round(amount / 12) : null;
  return (
    <span className="flex flex-col">
      <span className="flex items-baseline gap-1">
        <span className="font-sans text-xl text-muted">৳</span>
        <span className="tabular font-display text-4xl font-semibold text-white">{amount.toLocaleString()}</span>
        <span className="text-sm text-muted">{billing === "monthly" ? "/ month" : billing === "yearly" ? "/ year" : "one-time"}</span>
      </span>
      {monthlyEquivalent ? (
        <span className="tabular mt-1 text-xs text-cyan">≈ ৳{monthlyEquivalent.toLocaleString()} / month · save 2 months</span>
      ) : null}
    </span>
  );
}

export function PricingTable({ plans, comparisonNote }: { plans: PricingPlan[]; comparisonNote?: string }) {
  const available = React.useMemo(() => {
    const set = new Set<Billing>();
    for (const p of plans) {
      if (p.price_monthly !== null) set.add("monthly");
      if (p.price_yearly !== null) set.add("yearly");
      if (p.price_one_time !== null) set.add("one_time");
    }
    return (["monthly", "yearly", "one_time"] as Billing[]).filter((b) => set.has(b));
  }, [plans]);
  const [billing, setBilling] = React.useState<Billing>(available.includes("monthly") ? "monthly" : (available[0] ?? "monthly"));

  const categories = React.useMemo(() => Array.from(new Set(plans.map((p) => p.category))), [plans]);
  const allFeatures = React.useMemo(() => {
    const seen = new Map<string, number>();
    plans.forEach((p) => asStringArray(p.features).forEach((f) => seen.set(f, (seen.get(f) ?? 0) + 1)));
    return Array.from(seen.keys());
  }, [plans]);

  if (plans.length === 0) return <p className="text-center text-muted">Pricing plans will appear here once published.</p>;

  return (
    <div className="flex flex-col gap-16">
      {/* Toggle */}
      {available.length > 1 ? (
        <div className="flex justify-center">
          <div role="tablist" aria-label="Billing period" className="glass inline-flex rounded-full p-1">
            {available.map((b) => (
              <button
                key={b}
                role="tab"
                aria-selected={billing === b}
                onClick={() => setBilling(b)}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-medium transition-colors",
                  billing === b ? "bg-white text-bg" : "text-muted hover:text-white",
                )}
              >
                {billingLabels[b]}
                {b === "yearly" ? <span className="ml-2 rounded-full bg-cyan/20 px-1.5 py-0.5 text-[0.6rem] text-cyan">-17%</span> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Cards, grouped by category when there are several */}
      {categories.map((category) => {
        const group = plans.filter((p) => p.category === category);
        return (
          <div key={category} className="flex flex-col gap-6">
            {categories.length > 1 ? <h2 className="label capitalize">{category === "web" ? "Websites" : category}</h2> : null}
            <ul className={cn("grid gap-5", group.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2")}>
              {group.map((plan) => {
                const amount = priceFor(plan, billing);
                return (
                  <li key={plan.id} className="relative">
                    <TiltCard as="article" intensity={3} className={cn("flex h-full flex-col gap-6 p-7", plan.is_popular && "[--gba-opacity:1]")}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-white">{plan.name}</h3>
                          {plan.description ? <p className="mt-2 text-sm text-muted">{plan.description}</p> : null}
                        </div>
                        {plan.is_popular ? (
                          <Badge tone="amber" className="shrink-0"><Sparkles className="size-3" aria-hidden /> Popular</Badge>
                        ) : null}
                      </div>
                      <Price amount={amount} billing={billing} />
                      <Button href={plan.cta_href} variant={plan.is_popular ? "primary" : "outline"} className="w-full">
                        {amount === null ? "Talk to sales" : plan.cta_label}
                      </Button>
                      <ul className="flex flex-col gap-2.5 border-t border-border pt-6">
                        {asStringArray(plan.features).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-silver">
                            <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </TiltCard>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {/* Comparison table */}
      {allFeatures.length > 0 && plans.length > 1 ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">Compare plans</h2>
            {comparisonNote ? <p className="text-sm text-muted">{comparisonNote}</p> : null}
          </div>
          <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">Feature comparison across plans</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-4 pr-4 text-left font-medium text-muted">Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className="px-4 py-4 text-center font-display font-semibold text-white">
                      {p.name}
                      <div className="tabular mt-1 text-xs font-normal text-muted">
                        {priceFor(p, billing) === null ? "Custom" : `৳${priceFor(p, billing)!.toLocaleString()}`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, i) => (
                  <tr key={feature} className={cn("border-b border-border/60", i % 2 === 0 && "bg-surface/30")}>
                    <th scope="row" className="py-3 pr-4 text-left font-normal text-silver">{feature}</th>
                    {plans.map((p) => {
                      const has = asStringArray(p.features).includes(feature);
                      return (
                        <td key={p.id} className="px-4 py-3 text-center">
                          {has ? (
                            <Check className="mx-auto size-4 text-cyan" aria-label="Included" />
                          ) : (
                            <Minus className="mx-auto size-4 text-muted/40" aria-label="Not included" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
