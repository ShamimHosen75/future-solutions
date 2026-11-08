"use server";

import type { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv, serverEnv } from "@/lib/env";
import { rateLimit } from "@/lib/security/rate-limit";
import { requestFingerprint } from "@/lib/security/request";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { sendLeadEmails } from "@/lib/email/resend";
import {
  careerSchema,
  contactSchema,
  enrollmentSchema,
  reviewSchema,
  type FormState,
} from "@/lib/validation/leads";
import type { TablesInsert } from "@/types/database";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

type Guard =
  | { ok: true; ipHash: string; userAgent: string }
  | { ok: false; state: FormState };

/** Shared protections: honeypot, rate limit (memory + DB), Turnstile. */
async function guard(formData: FormData, scope: string): Promise<Guard> {
  const fp = await requestFingerprint();

  if (String(formData.get("website") ?? "").length > 0) {
    // Honeypot filled in: pretend success so bots don't adapt.
    return { ok: false, state: { status: "success", message: "Thanks! We'll be in touch shortly." } };
  }

  const limited = rateLimit(`${scope}:${fp.ipHash}`, MAX_PER_WINDOW, WINDOW_MS);
  if (!limited.ok) {
    return {
      ok: false,
      state: {
        status: "error",
        message: `Too many submissions. Please try again in ${Math.ceil(limited.retryAfterSeconds / 60)} minute(s).`,
      },
    };
  }

  const human = await verifyTurnstile(String(formData.get("turnstileToken") ?? "") || undefined, fp.ip);
  if (!human) {
    return {
      ok: false,
      state: { status: "error", message: "We couldn't verify you're human. Please refresh and try again." },
    };
  }

  // Cross-instance limit backed by the leads table (service role only).
  // Reviews don't store an IP hash, so they rely on the memory limiter above.
  if (scope !== "review" && serverEnv().SUPABASE_SERVICE_ROLE_KEY && hasSupabaseEnv()) {
    try {
      const admin = createAdminClient();
      const since = new Date(Date.now() - WINDOW_MS).toISOString();
      const { count } = await admin
        .from("leads")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since)
        .eq("ip_hash", fp.ipHash);
      if ((count ?? 0) >= MAX_PER_WINDOW) {
        return { ok: false, state: { status: "error", message: "Too many submissions. Please try again later." } };
      }
    } catch (error) {
      console.warn("[leads] db rate-limit check skipped:", error);
    }
  }

  return { ok: true, ipHash: fp.ipHash, userAgent: fp.userAgent };
}

function parse<T extends z.ZodTypeAny>(schema: T, formData: FormData): { data: z.infer<T> } | { state: FormState } {
  const raw: Record<string, FormDataEntryValue> = {};
  for (const [k, v] of formData.entries()) raw[k] = v;
  const result = schema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return { state: { status: "error", message: "Please fix the highlighted fields.", fieldErrors } };
  }
  return { data: result.data };
}

/** Insert with the service role when available (keeps ip_hash etc.), else as anon. */
async function insertLead(row: TablesInsert<"leads">): Promise<void> {
  if (!hasSupabaseEnv()) {
    console.info("[leads] Supabase not configured — lead logged only:", row.email, row.type);
    return;
  }
  const useAdmin = Boolean(serverEnv().SUPABASE_SERVICE_ROLE_KEY);
  const client = useAdmin ? createAdminClient() : createPublicClient();
  if (!client) return;
  // No .select(): anon cannot read the row back (RLS), and we don't need it.
  const { error } = await client.from("leads").insert(useAdmin ? row : { ...row, ip_hash: null, user_agent: null });
  if (error) throw new Error(error.message);
}

const failure = (error: unknown): FormState => {
  console.error("[leads] action failed:", error);
  return { status: "error", message: "Something went wrong on our side. Please try again or reach us on WhatsApp." };
};

/* ───────────────────────── Contact / quote ───────────────────────── */
export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const g = await guard(formData, "contact");
  if (!g.ok) return g.state;
  const parsed = parse(contactSchema, formData);
  if ("state" in parsed) return parsed.state;
  const d = parsed.data;

  try {
    await insertLead({
      type: d.intent === "quote" ? "quote" : "contact",
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      company: d.company || null,
      subject: d.intent === "quote" ? "Quote request" : "Contact form",
      message: d.message,
      budget: d.budget || null,
      service_id: d.serviceId || null,
      source: "website",
      ip_hash: g.ipHash,
      user_agent: g.userAgent,
    });
    await sendLeadEmails({
      type: d.intent === "quote" ? "Quote request" : "Contact",
      name: d.name,
      email: d.email,
      phone: d.phone,
      subject: `${d.intent === "quote" ? "Quote request" : "Message"} from ${d.name}`,
      rows: [
        ["Name", d.name],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Company", d.company],
        ["Budget", d.budget],
        ["Message", d.message],
      ],
    });
    return { status: "success", message: "Thanks! Your message is in. We'll reply within one business day." };
  } catch (error) {
    return failure(error);
  }
}

/* ───────────────────────── Course enrollment ─────────────────────── */
export async function submitEnrollment(_prev: FormState, formData: FormData): Promise<FormState> {
  const g = await guard(formData, "enrollment");
  if (!g.ok) return g.state;
  const parsed = parse(enrollmentSchema, formData);
  if ("state" in parsed) return parsed.state;
  const d = parsed.data;
  const courseTitle = String(formData.get("courseTitle") ?? "").slice(0, 160);

  try {
    await insertLead({
      type: "enrollment",
      name: d.name,
      email: d.email,
      phone: d.phone,
      subject: `Enrollment: ${courseTitle || "course"}${d.batch ? ` (${d.batch})` : ""}`,
      message: d.background || null,
      course_id: d.courseId,
      metadata: { batch: d.batch ?? null, courseTitle },
      source: "academy",
      ip_hash: g.ipHash,
      user_agent: g.userAgent,
    });
    await sendLeadEmails({
      type: "Enrollment",
      name: d.name,
      email: d.email,
      phone: d.phone,
      subject: `Enrollment request: ${courseTitle || "course"}`,
      rows: [
        ["Name", d.name],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Course", courseTitle],
        ["Batch", d.batch],
        ["Background", d.background],
      ],
    });
    return { status: "success", message: "You're on the list! Our academy team will call you to confirm your seat." };
  } catch (error) {
    return failure(error);
  }
}

/* ───────────────────────── Career application ────────────────────── */
export async function submitApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  const g = await guard(formData, "career");
  if (!g.ok) return g.state;
  const parsed = parse(careerSchema, formData);
  if ("state" in parsed) return parsed.state;
  const d = parsed.data;

  try {
    await insertLead({
      type: "career",
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      subject: `Application: ${d.position}`,
      message: d.message,
      metadata: { position: d.position, portfolioUrl: d.portfolioUrl ?? null },
      source: "careers",
      ip_hash: g.ipHash,
      user_agent: g.userAgent,
    });
    await sendLeadEmails({
      type: "Application",
      name: d.name,
      email: d.email,
      phone: d.phone,
      subject: `Application for ${d.position} — ${d.name}`,
      rows: [
        ["Name", d.name],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Position", d.position],
        ["Portfolio", d.portfolioUrl],
        ["Cover note", d.message],
      ],
    });
    return { status: "success", message: "Application received. We review every application and reply within a week." };
  } catch (error) {
    return failure(error);
  }
}

/* ───────────────────────── Public review ─────────────────────────── */
export async function submitReview(_prev: FormState, formData: FormData): Promise<FormState> {
  const g = await guard(formData, "review");
  if (!g.ok) return g.state;
  const parsed = parse(reviewSchema, formData);
  if ("state" in parsed) return parsed.state;
  const d = parsed.data;

  try {
    if (hasSupabaseEnv()) {
      const useAdmin = Boolean(serverEnv().SUPABASE_SERVICE_ROLE_KEY);
      const client = useAdmin ? createAdminClient() : createPublicClient();
      if (client) {
        const { error } = await client.from("testimonials").insert({
          author_name: d.name,
          author_email: d.email,
          author_role: d.role || null,
          author_company: d.company || null,
          content: d.content,
          rating: d.rating,
          source: "Website",
          is_approved: false,
          is_published: false,
          is_featured: false,
        });
        if (error) throw new Error(error.message);
      }
    }
    await sendLeadEmails({
      type: "Review",
      name: d.name,
      email: d.email,
      subject: `New ${d.rating}★ review from ${d.name}`,
      rows: [
        ["Name", d.name],
        ["Email", d.email],
        ["Role", [d.role, d.company].filter(Boolean).join(" · ")],
        ["Rating", `${d.rating} / 5`],
        ["Review", d.content],
      ],
    });
    return { status: "success", message: "Thank you! Your review will appear once our team approves it." };
  } catch (error) {
    return failure(error);
  }
}
