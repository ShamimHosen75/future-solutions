import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export const Logo = ({ className }: { className?: string }) => (
  <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label={`${site.name} home`}>
    <Image src="/brand/logo-mark-96.png" alt="" width={36} height={36} className="size-9 rounded-lg" priority />
    <span className="whitespace-nowrap text-[17px] font-semibold tracking-tight text-white">
      Future<span className="text-gradient-brand"> Solutions</span>
    </span>
  </Link>
);
