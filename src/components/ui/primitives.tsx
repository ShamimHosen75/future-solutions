import Link from "next/link";
import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowRight } from "./icons";

export type Tone = "dark" | "light";

export const Container = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)} {...props} />
);

type SectionProps = ComponentProps<"section"> & { tone?: Tone };

/** Every home section is wrapped in this, so tone (dark/light) and spacing stay consistent. */
export const Section = ({ tone = "light", className, ...props }: SectionProps) => (
  <section
    data-tone={tone}
    className={cn(
      "relative py-20 sm:py-28",
      tone === "dark" ? "bg-ink text-white" : "bg-paper text-text",
      className,
    )}
    {...props}
  />
);

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn("text-xs font-semibold uppercase tracking-[0.18em] text-orange-500", className)}>{children}</p>
);

/** Splits text into masked words. The motion provider slides each word up when it scrolls into view. */
export const SplitText = ({ text, as: Tag = "h2", className }: { text: string; as?: ElementType; className?: string }) => (
  <Tag data-split className={cn("text-balance", className)} aria-label={text}>
    {text.split(" ").map((word, i) => (
      <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-top">
        <span className="word-inner inline-block will-change-transform">{word}&nbsp;</span>
      </span>
    ))}
  </Tag>
);

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: Tone;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
};

export const SectionHeading = ({ eyebrow, title, intro, tone = "light", align = "left", className, action }: SectionHeadingProps) => (
  <div
    className={cn(
      "mb-12 flex flex-col gap-6 sm:mb-16",
      align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      className,
    )}
  >
    <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
      {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
      <SplitText
        text={title}
        className="text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]"
      />
      {intro ? (
        <p data-reveal className={cn("mt-6 max-w-xl text-base text-pretty sm:text-lg", tone === "dark" ? "text-muted-dark" : "text-muted", align === "center" && "mx-auto")}>
          {intro}
        </p>
      ) : null}
    </div>
    {action ? <div data-reveal className="shrink-0">{action}</div> : null}
  </div>
);

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "dark" | "light" | "outline-dark" | "outline-light";
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
};

const buttonVariants = {
  primary: "bg-gradient-orange text-white shadow-[0_8px_30px_-8px_rgb(253_77_0/0.7)] hover:shadow-[0_10px_40px_-6px_rgb(253_77_0/0.9)]",
  dark: "bg-ink text-white hover:bg-ink-3",
  light: "bg-white text-ink hover:bg-paper",
  "outline-dark": "border border-line-dark text-white hover:bg-white/10",
  "outline-light": "border border-line text-ink hover:bg-white",
} as const;

export const Button = ({ href, children, variant = "primary", size = "md", arrow = true, className }: ButtonProps) => {
  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,box-shadow,transform] duration-300 active:scale-[0.97]",
    size === "md" ? "h-11 px-5 text-sm" : "h-13 px-7 text-base",
    buttonVariants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {arrow ? <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" /> : null}
    </>
  );
  return external ? (
    <a href={href} className={classes} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
};

export const Tag = ({ children, tone = "light" }: { children: ReactNode; tone?: Tone }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
      tone === "dark" ? "border-white/15 bg-white/5 text-white/80" : "border-line bg-white text-muted",
    )}
  >
    {children}
  </span>
);

export const Stars = ({ className }: { className?: string }) => (
  <span className={cn("inline-flex gap-0.5 text-orange-400", className)} aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
        <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L2.9 9.4l6.3-.9L12 2.8Z" />
      </svg>
    ))}
  </span>
);

/** Initials avatar used until real team / client photos are supplied. */
export const Avatar = ({ name, className, hue = "orange" }: { name: string; className?: string; hue?: "orange" | "blue" }) => {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
        hue === "orange" ? "bg-gradient-orange" : "bg-gradient-blue",
        className,
      )}
    >
      {initials}
    </span>
  );
};
