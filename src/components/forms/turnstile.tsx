"use client";

import * as React from "react";
import { publicEnv } from "@/lib/env";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src^="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile failed to load")));
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile failed to load"));
    document.head.appendChild(s);
  });
}

type TurnstileProps = {
  onToken: (token: string) => void;
  /** Bumped by the parent to reset the widget after a submission. */
  resetKey?: number;
};

/**
 * Cloudflare Turnstile (invisible-friendly) widget. Renders nothing when the
 * site key isn't configured so local development works without Cloudflare.
 */
export function Turnstile({ onToken, resetKey = 0 }: TurnstileProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const widgetId = React.useRef<string | null>(null);
  const siteKey = publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const onTokenRef = React.useRef(onToken);
  onTokenRef.current = onToken;

  React.useEffect(() => {
    if (!siteKey || !ref.current) return;
    let cancelled = false;
    const el = ref.current;
    loadScript()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        widgetId.current = window.turnstile.render(el, {
          sitekey: siteKey,
          theme: "dark",
          size: "flexible",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
        });
      })
      .catch((e) => console.warn(e));
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  React.useEffect(() => {
    if (resetKey > 0 && widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }, [resetKey]);

  if (!siteKey) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}
