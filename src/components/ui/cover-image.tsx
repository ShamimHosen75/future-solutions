import Image from "next/image";
import { cn } from "@/lib/utils";
import { initials, placeholderGradient } from "@/lib/content";

type CoverImageProps = {
  src: string | null;
  alt: string;
  /** Used for the placeholder when there is no image. */
  title: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** next/image with a branded gradient placeholder when the record has no cover yet. */
export function CoverImage({ src, alt, title, className, sizes = "(min-width: 1024px) 33vw, 100vw", priority }: CoverImageProps) {
  if (!src) {
    return (
      <div
        className={cn("relative flex items-center justify-center overflow-hidden", className)}
        style={{ background: placeholderGradient(title) }}
        role="img"
        aria-label={alt}
      >
        <div className="bg-grid absolute inset-0 opacity-40 mix-blend-overlay" />
        <span className="font-display relative text-[clamp(2rem,6vw,4rem)] font-bold text-white/90 drop-shadow-lg">
          {initials(title)}
        </span>
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
