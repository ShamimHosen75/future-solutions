import { ForgotPasswordForm } from "@/components/admin/auth-forms";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-white">Reset your password</h1>
      <p className="mt-1 mb-6 text-sm text-muted">We&apos;ll email you a link to choose a new one.</p>
      <ForgotPasswordForm />
    </>
  );
}
