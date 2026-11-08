"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("no-scrollbar flex w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface/60 p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "shrink-0 rounded-full px-4 py-1.5 text-sm text-muted transition-colors hover:text-white data-[state=active]:bg-white data-[state=active]:text-bg",
        className,
      )}
      {...props}
    />
  );
}
