import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden className="bg-vignette absolute inset-0" />
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(50%_50%_at_50%_40%,#000,transparent)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo size={40} href="/" /></div>
        <div className="glass gradient-border rounded-[var(--radius-xl)] p-8">{children}</div>
        <p className="mt-6 text-center text-xs text-muted">Future Solutions · Content dashboard</p>
      </div>
    </main>
  );
}
