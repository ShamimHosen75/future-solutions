import { headers } from "next/headers";
import { hashIdentifier } from "./hash";

/** Client IP (hashed) and user agent from the current request. Server only. */
export async function requestFingerprint() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return {
    ip,
    ipHash: hashIdentifier(ip),
    userAgent: (h.get("user-agent") ?? "").slice(0, 300),
  };
}
