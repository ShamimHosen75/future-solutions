import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { LogoMark } from "./logo-mark";

export const Logo = ({ className, id = "logo" }: { className?: string; id?: string }) => (
  <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label={`${site.name} home`}>
    <LogoMark id={id} className="h-9 w-8 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" />
    <span className="whitespace-nowrap text-[17px] font-semibold tracking-tight text-white">
      Future<span className="text-gradient-brand"> Solutions</span>
    </span>
  </Link>
);
