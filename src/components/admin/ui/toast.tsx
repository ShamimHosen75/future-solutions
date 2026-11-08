"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = { id: number; title: string; description?: string; tone: "success" | "error" | "info" };
type ToastInput = Omit<Toast, "id" | "tone"> & { tone?: Toast["tone"] };

const ToastContext = React.createContext<{ toast: (t: ToastInput) => void }>({ toast: () => {} });

export function useToast() {
  return React.useContext(ToastContext);
}

/** Minimal toast system: bottom-right stack, auto-dismiss, accessible live region. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const idRef = React.useRef(0);

  const dismiss = React.useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = React.useCallback(
    (input: ToastInput) => {
      const id = ++idRef.current;
      setToasts((t) => [...t, { id, tone: "success", ...input }]);
      window.setTimeout(() => dismiss(id), input.tone === "error" ? 7000 : 4000);
    },
    [dismiss],
  );

  const value = React.useMemo(() => ({ toast }), [toast]);
  const icons = { success: CheckCircle2, error: AlertCircle, info: Info };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed right-4 bottom-4 z-[90] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.tone];
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-[var(--radius-md)] border bg-surface p-4 shadow-2xl",
                t.tone === "success" && "border-cyan/30",
                t.tone === "error" && "border-orange/40",
                t.tone === "info" && "border-border",
              )}
            >
              <Icon className={cn("mt-0.5 size-4 shrink-0", t.tone === "success" && "text-cyan", t.tone === "error" && "text-orange", t.tone === "info" && "text-silver")} aria-hidden />
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-medium text-white">{t.title}</p>
                {t.description ? <p className="mt-0.5 text-muted">{t.description}</p> : null}
              </div>
              <button type="button" onClick={() => dismiss(t.id)} className="rounded p-1 text-muted hover:text-white" aria-label="Dismiss">
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
