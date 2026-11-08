import { cn } from "@/lib/utils";

/**
 * Renders rich text authored in the admin (Tiptap). Only editors and admins can
 * write this content, so it is trusted; public form input never reaches here.
 */
export function Prose({ html, className }: { html: string | null | undefined; className?: string }) {
  if (!html) return null;
  return (
    <div
      className={cn(
        "prose-fs max-w-none text-base leading-relaxed text-muted md:text-lg",
        "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white",
        "[&_p]:my-4 [&_a]:text-cyan [&_a]:underline-offset-4 hover:[&_a]:underline",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1",
        "[&_strong]:text-white [&_blockquote]:border-l-2 [&_blockquote]:border-cyan [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_img]:rounded-[var(--radius-md)] [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
