"use client";

import { useState } from "react";
import { LinkIcon } from "@/components/ui/icons";

/** Copies the current page URL and shows a short "Copied" confirmation. */
export const CopyLink = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm text-white/85 transition-colors hover:bg-white/10"
    >
      <LinkIcon className="size-4" />
      <span aria-live="polite">{copied ? "Copied!" : "Copy link"}</span>
    </button>
  );
};
