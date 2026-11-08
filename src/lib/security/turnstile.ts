import { serverEnv } from "@/lib/env";

type TurnstileResponse = { success: boolean; "error-codes"?: string[] };

/**
 * Verifies a Cloudflare Turnstile token. When no secret is configured (local
 * development) verification is skipped and a warning is logged once.
 */
let warned = false;
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const { TURNSTILE_SECRET_KEY } = serverEnv();
  if (!TURNSTILE_SECRET_KEY) {
    if (!warned) {
      console.warn("[turnstile] TURNSTILE_SECRET_KEY not set — skipping verification.");
      warned = true;
    }
    return true;
  }
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
    });
    const data = (await res.json()) as TurnstileResponse;
    return data.success === true;
  } catch (error) {
    console.error("[turnstile] verification failed:", error);
    return false;
  }
}
