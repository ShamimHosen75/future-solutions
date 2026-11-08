"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

type AnnouncementBarProps = { text: string; href?: string };

/** Slim top bar driven by the `announcement` setting; dismissal is remembered per message. */
export function AnnouncementBar({ text, href }: AnnouncementBarProps) {
  const key = `fs:announcement:${text}`;
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      setVisible(localStorage.getItem(key) !== "dismissed");
    } catch {
      setVisible(true);
    }
  }, [key]);

  React.useEffect(() => {
    document.documentElement.style.setProperty("--announcement-h", visible ? "2.5rem" : "0rem");
    return () => {
      document.documentElement.style.removeProperty("--announcement-h");
    };
  }, [visible]);

  if (!visible) return null;
  const content = (
    <span className="inline-flex items-center gap-2 truncate">
      {text}
      {href ? <ArrowRight className="size-3.5" aria-hidden /> : null}
    </span>
  );
  return (
    <div role="region" aria-label="Announcement" className="fixed inset-x-0 top-0 z-[60] flex h-10 items-center justify-center bg-brand-gradient px-10 text-center text-xs font-medium text-white">
      {href ? <Link href={href} className="truncate hover:underline">{content}</Link> : content}
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          try {
            localStorage.setItem(key, "dismissed");
          } catch {
            /* ignore */
          }
          setVisible(false);
        }}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 hover:bg-black/20"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
