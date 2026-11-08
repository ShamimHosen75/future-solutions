import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden className="bg-vignette absolute inset-0" />
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(50%_50%_at_50%_50%,#000,transparent)]" />
      <div className="relative flex flex-col items-center gap-8">
        <Logo withWordmark={false} size={56} />
        <p className="label">Error 404</p>
        <h1 className="font-display text-[clamp(3rem,12vw,8rem)] leading-none font-bold">
          <span className="text-gradient">Lost</span> in space.
        </h1>
        <p className="max-w-md text-muted">
          The page you&apos;re looking for has moved, been renamed, or never existed. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>
    </main>
  );
}
