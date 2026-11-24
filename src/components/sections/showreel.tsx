"use client";

import { useEffect, useRef, useState } from "react";
import { showreel } from "@/content/home";
import { Container } from "@/components/ui/primitives";
import { Close, Play } from "@/components/ui/icons";

/**
 * Large rounded showreel card. Plays a muted loop while visible (once a video file is set),
 * and opens a full lightbox player on click.
 */
export const Showreel = () => {
  const [open, setOpen] = useState(false);
  const loopRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const video = loopRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void video.play().catch(() => undefined);
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <section className="bg-paper pt-28 pb-16 sm:pt-36">
      <Container>
        <button
          type="button"
          data-zoom
          onClick={() => setOpen(true)}
          className="group relative block aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] bg-ink text-left shadow-[0_40px_80px_-40px_rgb(4_7_13/0.6)]"
          aria-label={showreel.label}
        >
          {showreel.videoSrc ? (
            <video ref={loopRef} src={showreel.videoSrc} poster={showreel.poster || undefined} muted loop playsInline preload="metadata" className="absolute inset-0 size-full object-cover" />
          ) : (
            <ShowreelPlaceholder />
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/30 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 sm:size-24">
              <Play className="ml-1 size-7" />
            </span>
          </span>
          <span className="absolute bottom-5 left-5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur sm:bottom-7 sm:left-7">
            {showreel.label}
          </span>
        </button>
      </Container>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="m-auto w-[min(92vw,1100px)] bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
          {open && showreel.videoSrc ? (
            <video src={showreel.videoSrc} controls autoPlay playsInline className="size-full" />
          ) : (
            <div className="flex size-full items-center justify-center p-8 text-center text-white/70">
              Your showreel will play here. Add the video file path in <code className="mx-1 text-orange-400">src/content/home.ts</code>.
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
            aria-label="Close video"
          >
            <Close className="size-5" />
          </button>
        </div>
      </dialog>
    </section>
  );
};

/** Animated brand light-trail used until a showreel video is supplied. */
const ShowreelPlaceholder = () => (
  <span aria-hidden className="absolute inset-0">
    <span className="absolute inset-0 bg-[radial-gradient(60%_80%_at_30%_40%,rgb(253_77_0/0.25),transparent),radial-gradient(50%_70%_at_75%_70%,rgb(0_107_200/0.35),transparent)]" />
    <svg viewBox="0 0 1600 900" className="absolute inset-0 size-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trail-o" x1="0" x2="1">
          <stop offset="0" stopColor="#ffb547" />
          <stop offset="1" stopColor="#fd4d00" />
        </linearGradient>
        <linearGradient id="trail-b" x1="0" x2="1">
          <stop offset="0" stopColor="#006bc8" />
          <stop offset="1" stopColor="#00d4ff" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="M380 -20 L520 560 Q540 640 620 650 L1150 720" fill="none" stroke="url(#trail-o)" strokeWidth="6" filter="url(#glow)" className="[stroke-dasharray:1600] motion-safe:animate-[dash_6s_ease-in-out_infinite_alternate]" />
      <path d="M1320 920 L1180 360 Q1160 280 1080 270 L480 200" fill="none" stroke="url(#trail-b)" strokeWidth="6" filter="url(#glow)" className="[stroke-dasharray:1600] motion-safe:animate-[dash_7s_ease-in-out_infinite_alternate-reverse]" />
    </svg>
  </span>
);
