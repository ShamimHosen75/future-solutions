"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border bg-surface-2 transition-colors data-[state=checked]:border-transparent data-[state=checked]:bg-brand-gradient disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[1.375rem]" />
    </SwitchPrimitive.Root>
  );
}
