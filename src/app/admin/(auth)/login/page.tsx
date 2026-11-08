import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/auth-forms";
import { getSession } from "@/lib/admin/auth";
import { hasSupabaseEnv } from "@/lib/env";

type SearchParams = Promise<{ next?: string; error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { next, error } = await searchParams;
  if (await getSession()) redirect("/admin");
  const notice =
    error === "not_configured" || !hasSupabaseEnv()
      ? "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then run the migrations."
      : undefined;
  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-white">Sign in</h1>
      <p className="mt-1 mb-6 text-sm text-muted">Manage content, leads and settings.</p>
      <LoginForm next={next} notice={notice} />
    </>
  );
}
