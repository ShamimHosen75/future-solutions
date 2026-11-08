import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/admin/auth-forms";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";

type SearchParams = Promise<{ code?: string; error_description?: string }>;

/** Landing page for password-reset and invite links. Exchanges the code, then shows the form. */
export default async function ResetPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const { code, error_description } = await searchParams;
  if (code && hasSupabaseEnv()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect("/admin/reset-password");
  }
  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-white">Choose a new password</h1>
      <p className="mt-1 mb-6 text-sm text-muted">{error_description ?? "You're signed in through your email link. Set a password to finish."}</p>
      <ResetPasswordForm />
    </>
  );
}
