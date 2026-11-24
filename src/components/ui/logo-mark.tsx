import { cn } from "@/lib/cn";

/**
 * The Future Solutions mark, redrawn as a crisp vector from the original logo artwork.
 * Pass a unique `id` when more than one mark is on the page, so gradient ids stay unique.
 */
export const LogoMark = ({ id = "fs", className, title }: { id?: string; className?: string; title?: string }) => (
  <svg viewBox="188 52 384 432" className={cn("shrink-0", className)} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
    {title ? <title>{title}</title> : null}
    <defs>
      <linearGradient id={`${id}-o`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffb547" />
        <stop offset=".55" stopColor="#fe6b01" />
        <stop offset="1" stopColor="#fd4d00" />
      </linearGradient>
      <linearGradient id={`${id}-b`} x1="1" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#00d4ff" />
        <stop offset=".5" stopColor="#0096e6" />
        <stop offset="1" stopColor="#006bc8" />
      </linearGradient>
    </defs>
    <path data-logo-part="blue" d="M 511 473 L 278 403 Q 264 399 260 385 L 196 168 L 244 188 L 411 276 Q 444 293 434 320 Q 423 344 394 331 L 309 296 L 336 350 Q 342 360 354 363 L 480 398 Q 494 402 498 416 Z" fill={`url(#${id}-b)`} />
    <path data-logo-part="orange" d="M245 63 L478 133 Q492 137 496 151 L560 368 L512 348 L345 260 Q312 243 322 216 Q333 192 362 205 L447 240 L420 186 Q414 176 402 173 L276 138 Q262 134 258 120 Z" fill={`url(#${id}-o)`} />
  </svg>
);
