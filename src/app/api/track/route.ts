import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv, serverEnv } from "@/lib/env";
import { hashIdentifier } from "@/lib/security/hash";
import { rateLimit } from "@/lib/security/rate-limit";

const schema = z.object({
  path: z.string().min(1).max(300),
  referrer: z.string().max(500).nullable().optional(),
  width: z.number().int().positive().optional(),
});

/** First-party page view ingestion. No cookies: the session hash is IP + UA + day. */
export async function POST(request: NextRequest) {
  if (!hasSupabaseEnv() || !serverEnv().SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ ok: true, skipped: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`track:${hashIdentifier(ip)}`, 120, 60_000).ok) return NextResponse.json({ ok: false }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const ua = request.headers.get("user-agent") ?? "";
  const day = new Date().toISOString().slice(0, 10);
  const device = parsed.data.width ? (parsed.data.width < 768 ? "mobile" : parsed.data.width < 1024 ? "tablet" : "desktop") : /Mobi|Android/i.test(ua) ? "mobile" : "desktop";
  let referrer: string | null = null;
  try {
    referrer = parsed.data.referrer ? new URL(parsed.data.referrer).hostname : null;
  } catch {
    referrer = null;
  }

  try {
    await createAdminClient().from("page_views").insert({
      path: parsed.data.path.split("?")[0] ?? parsed.data.path,
      referrer,
      country: request.headers.get("x-vercel-ip-country"),
      device,
      session_hash: hashIdentifier(`${ip}|${ua}|${day}`),
    });
  } catch (error) {
    console.warn("[track] insert failed:", error);
  }
  return NextResponse.json({ ok: true });
}
