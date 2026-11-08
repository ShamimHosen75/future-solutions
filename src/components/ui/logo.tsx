import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

type LogoProps = {
  className?: string;
  /** Pixel size of the mark. */
  size?: number;
  withWordmark?: boolean;
  href?: string | null;
};

/**
 * Inline SVG version of the FS monogram so it inherits gradients without an
 * extra network request and animates cleanly in the preloader.
 */
export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="fs-silver" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#D9DDE3" />
          <stop offset="0.6" stopColor="#8A93A3" />
          <stop offset="1" stopColor="#E8EBEF" />
        </linearGradient>
        <linearGradient id="fs-brand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0A3DFF" />
          <stop offset="0.45" stopColor="#12C8FF" />
          <stop offset="0.7" stopColor="#FF5A0A" />
          <stop offset="1" stopColor="#FFA31A" />
        </linearGradient>
      </defs>
      <path fill="url(#fs-silver)" d="M52 56h84v26H82v34h46v26H82v58H52z" />
      <path
        fill="url(#fs-brand)"
        d="M204 86c-6-16-21-27-44-27-26 0-45 14-45 36 0 20 13 30 40 37l10 3c13 4 17 8 17 15 0 8-8 14-21 14-14 0-24-7-27-19l-27 7c6 23 26 38 54 38 29 0 49-15 49-40 0-21-13-32-38-39l-12-3c-12-3-17-7-17-13 0-7 7-12 17-12 11 0 18 5 21 13z"
      />
    </svg>
  );
}

export function Logo({ className, size = 36, withWordmark = true, href = "/" }: LogoProps) {
  const content = (
    <>
      <LogoMark size={size} />
      {withWordmark ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[0.95rem] font-bold tracking-tight text-white">
            Future Solutions
          </span>
          <span className="label mt-1 text-[0.55rem] tracking-[0.28em]">Smart Solutions</span>
        </span>
      ) : null}
    </>
  );

  const classes = cn("inline-flex items-center gap-3", className);

  if (href === null) {
    return <span className={classes}>{content}</span>;
  }
  return (
    <Link href={href} className={classes} aria-label={withWordmark ? undefined : `${site.name} home`}>
      {content}
    </Link>
  );
}
