import Link from "next/link";
import type { CSSProperties } from "react";
import { formatDate, postHref, type Post } from "@/content/blog";
import { Avatar } from "@/components/ui/primitives";
import { MockVisual } from "@/components/ui/mock-visual";
import { cn } from "@/lib/cn";

/** Blog post card: cover, category and read time, title, excerpt, author and date. */
export const PostCard = ({ post, reveal = true, large = false, className, style }: { post: Post; reveal?: boolean; large?: boolean; className?: string; style?: CSSProperties }) => (
  <Link href={postHref(post.slug)} data-reveal={reveal ? "" : undefined} className={cn("group flex flex-col", className)} style={style}>
    <div className="overflow-hidden rounded-[var(--radius-card)]">
      <MockVisual theme={post.theme} device={post.device} className={cn("transition-transform duration-700 group-hover:scale-[1.04]", large ? "aspect-[16/10]" : "aspect-[16/11]")} />
    </div>
    <p className="mt-5 flex items-center gap-2 text-xs font-medium">
      <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-orange-600">{post.category}</span>
      <span className="text-muted">{post.readTime}</span>
    </p>
    <h3 className={cn("mt-3 font-semibold tracking-tight text-balance transition-colors group-hover:text-orange-600", large ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl")}>{post.title}</h3>
    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
    <div className="mt-5 flex items-center gap-3 text-xs">
      <Avatar name={post.author.name} className="size-8 text-[10px]" />
      <span>
        <span className="block font-medium">{post.author.name}</span>
        <time dateTime={post.date} className="block text-muted">
          {formatDate(post.date)}
        </time>
      </span>
    </div>
  </Link>
);
