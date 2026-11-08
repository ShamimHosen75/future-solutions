import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { site } from "@/lib/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Turn any string into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Format a number compactly: 1200 → "1.2K". */
export function formatCompact(n: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatCurrency(amount: number, currency = "BDT", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(date));
}

export function absoluteUrl(path = ""): string {
  const base = site.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build a wa.me link from a phone number in any format. */
export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}
