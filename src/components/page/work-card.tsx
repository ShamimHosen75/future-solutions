import Link from "next/link";
import type { CSSProperties } from "react";
import { Tag } from "@/components/ui/primitives";
import { MockVisual, type MockDevice, type MockTheme } from "@/components/ui/mock-visual";
import { ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type WorkCardProps = {
  title: string;
  summary: string;
  tags: string[];
  theme: MockTheme;
  device: MockDevice;
  href: string;
  reveal?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Case-study card: large visual that zooms on hover, tags, and an underlined title. */
export const WorkCard = ({ title, summary, tags, theme, device, href, reveal = true, className, style }: WorkCardProps) => (
  <Link href={href} data-reveal={reveal ? "" : undefined} className={cn("group block", className)} style={style}>
    <div data-clip={reveal ? "" : undefined} className="relative overflow-hidden rounded-[var(--radius-card)]">
      <MockVisual theme={theme} device={device} className="aspect-[16/10] transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      <span className="absolute right-4 top-4 flex size-11 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-lg transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight className="size-5" />
      </span>
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
    <h3 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1.5px]">
        {title}
      </span>
      <span className="text-muted"> · {summary}</span>
    </h3>
  </Link>
);
