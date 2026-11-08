import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

/** Static, CSS-only stand-in for the 3D hero on mobile / low-end / reduced-motion. */
export function HeroFallback({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex aspect-square w-full items-center justify-center", className)} aria-hidden>
      <div className="absolute inset-[12%] rounded-full bg-blue/25 blur-[90px]" />
      <div className="absolute right-[8%] bottom-[8%] size-1/2 rounded-full bg-orange/20 blur-[90px]" />
      <div className="absolute inset-[18%] rounded-full border border-border-strong [mask-image:linear-gradient(135deg,#000,transparent_70%)]" />
      <div className="absolute inset-[30%] rounded-full border border-border [mask-image:linear-gradient(315deg,#000,transparent_70%)]" />
      <LogoMark size={220} className="relative w-[55%] drop-shadow-[0_30px_60px_rgba(18,200,255,0.3)] motion-safe:animate-float" />
    </div>
  );
}
