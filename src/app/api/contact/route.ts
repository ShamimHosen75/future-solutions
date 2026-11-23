import { NextResponse } from "next/server";

const isEmail = (v: unknown): v is string => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const text = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Receives the "Send a brief" form.
 * TODO: deliver the lead (email via Resend, a CRM, or a database) once the provider is chosen.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot filled: pretend success so bots learn nothing.
  if (text(body.company_website)) return NextResponse.json({ ok: true });

  const lead = {
    email: body.email,
    name: text(body.name, 120),
    budget: text(body.budget, 60),
    projectTypes: Array.isArray(body.projectTypes) ? body.projectTypes.filter((t): t is string => typeof t === "string").slice(0, 10) : [],
    details: text(body.details),
  };

  if (!isEmail(lead.email) || lead.name.length < 2 || lead.details.length < 10) {
    return NextResponse.json({ ok: false, error: "Missing or invalid fields" }, { status: 422 });
  }

  console.info("[contact] new brief", { name: lead.name, budget: lead.budget, projectTypes: lead.projectTypes });
  return NextResponse.json({ ok: true });
}
