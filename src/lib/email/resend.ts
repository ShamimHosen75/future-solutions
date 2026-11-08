import { Resend } from "resend";
import { serverEnv } from "@/lib/env";
import { site } from "@/lib/site";

type LeadEmail = {
  type: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  rows: Array<[label: string, value: string | null | undefined]>;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#05060A;font-family:Manrope,Segoe UI,Arial,sans-serif;color:#D9DDE3">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <div style="height:3px;background:linear-gradient(120deg,#0A3DFF,#12C8FF 45%,#FF5A0A 70%,#FFA31A);border-radius:3px"></div>
    <h1 style="font-size:20px;color:#fff;margin:24px 0 8px">${escapeHtml(title)}</h1>
    ${body}
    <p style="font-size:12px;color:#8A93A3;margin-top:32px">${site.name} · ${escapeHtml(site.contact.address)} · ${escapeHtml(site.contact.phone)}</p>
  </div></body></html>`;
}

function table(rows: LeadEmail["rows"]) {
  return `<table style="width:100%;border-collapse:collapse;font-size:14px">${rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#8A93A3;vertical-align:top;width:140px">${escapeHtml(k)}</td><td style="padding:8px 0;color:#D9DDE3;white-space:pre-wrap">${escapeHtml(String(v))}</td></tr>`,
    )
    .join("")}</table>`;
}

/**
 * Sends the internal notification and a short acknowledgement to the sender.
 * Silently no-ops when Resend isn't configured so forms still work locally.
 */
export async function sendLeadEmails(lead: LeadEmail): Promise<void> {
  const { RESEND_API_KEY, EMAIL_FROM, EMAIL_TO } = serverEnv();
  if (!RESEND_API_KEY || !EMAIL_FROM) {
    console.info("[email] Resend not configured — skipping notification for", lead.email);
    return;
  }
  const resend = new Resend(RESEND_API_KEY);
  const to = EMAIL_TO ?? site.contact.email;

  const results = await Promise.allSettled([
    resend.emails.send({
      from: EMAIL_FROM,
      to,
      replyTo: lead.email,
      subject: `[${lead.type}] ${lead.subject}`,
      html: layout(lead.subject, table(lead.rows)),
    }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: lead.email,
      subject: `We received your message — ${site.name}`,
      html: layout(
        `Thanks, ${lead.name.split(" ")[0] ?? lead.name}!`,
        `<p style="font-size:15px;line-height:1.6">We've received your ${escapeHtml(lead.type)} and will get back to you within one business day. For anything urgent, message us on WhatsApp at <a style="color:#12C8FF" href="https://wa.me/${site.contact.whatsapp.replace(/\\D/g, "")}">${escapeHtml(site.contact.phone)}</a>.</p>
         <p style="font-size:13px;color:#8A93A3;margin-top:24px">Your submission</p>${table(lead.rows)}`,
      ),
    }),
  ]);
  for (const r of results) if (r.status === "rejected") console.error("[email] send failed:", r.reason);
}
