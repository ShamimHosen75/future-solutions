import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus, LeadType } from "@/types/database";

const columns = ["created_at", "type", "status", "name", "email", "phone", "company", "subject", "message", "budget", "source", "notes"] as const;

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV export of the leads table, honouring the inbox filters. Admin only. */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.profile.role !== "admin") return new NextResponse("Forbidden", { status: 403 });

  const status = request.nextUrl.searchParams.get("status");
  const type = request.nextUrl.searchParams.get("type");
  const supabase = await createClient();
  let query = supabase.from("leads").select(columns.join(",")).order("created_at", { ascending: false }).limit(5000);
  if (status && status !== "all") query = query.eq("status", status as LeadStatus);
  if (type && type !== "all") query = query.eq("type", type as LeadType);
  const { data, error } = await query;
  if (error) return new NextResponse(error.message, { status: 500 });

  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const lines = [columns.join(","), ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(","))];
  const body = "﻿" + lines.join("\r\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
