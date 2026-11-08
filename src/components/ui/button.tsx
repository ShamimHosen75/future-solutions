import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "font-sans font-semibold tracking-tight transition-all duration-300 ease-[var(--ease-out-expo)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan",
  ],
  {
    variants: {
      variant: {
        primary: [
          "text-white bg-brand-gradient bg-[length:200%_200%] bg-left",
          "hover:bg-right hover:shadow-[0_12px_40px_-12px_rgba(18,200,255,0.55)] active:scale-[0.98]",
        ],
        secondary: [
          "text-white glass hover:border-border-strong hover:bg-surface-2 active:scale-[0.98]",
        ],
        outline: [
          "text-silver gradient-border bg-transparent hover:text-white hover:[--gb-opacity:1] active:scale-[0.98]",
        ],
        ghost: ["text-muted hover:text-white hover:bg-white/5"],
        link: ["text-cyan underline-offset-4 hover:underline px-0 h-auto"],
      },
      size: {
        sm: "h-9 px-4 text-xs rounded-full",
        md: "h-11 px-6 text-sm rounded-full",
        lg: "h-13 px-8 text-base rounded-full",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children?: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Button renders a <button> or a Next <Link> depending on whether `href` is passed.
 */
export function Button(props: ButtonProps) {
  const { className, variant, size, children, ...rest } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    const isExternal = /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
    if (isExternal) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer" target="_blank" {...anchorProps}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonAsButton;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

export { buttonVariants };
