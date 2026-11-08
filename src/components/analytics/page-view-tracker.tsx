"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/** Sends a lightweight, cookie-less page view beacon on every route change. */
export function PageViewTracker() {
  const pathname = usePathname();
  React.useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (navigator.doNotTrack === "1") return;
    const payload = JSON.stringify({ path: pathname, referrer: document.referrer || null, width: window.innerWidth });
    try {
      const sent = navigator.sendBeacon?.("/api/track", new Blob([payload], { type: "application/json" }));
      if (!sent) {
        void fetch("/api/track", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } });
      }
    } catch {
      /* analytics must never break the page */
    }
  }, [pathname]);
  return null;
}
