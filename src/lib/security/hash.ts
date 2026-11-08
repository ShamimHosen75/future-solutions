import { createHash } from "node:crypto";

const salt = process.env.IP_HASH_SALT ?? "future-solutions";

/** One-way hash so we can rate-limit without storing raw IP addresses. */
export function hashIdentifier(value: string): string {
  return createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 32);
}
