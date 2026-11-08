"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

export function Tooltip({ content, children }: { content: React.ReactNode; children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content sideOffset={6} className="z-[70] rounded-[var(--radius-sm)] border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-silver shadow-lg">
            {content}
            <TooltipPrimitive.Arrow className="fill-surface-2" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
