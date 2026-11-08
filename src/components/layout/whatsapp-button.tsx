import { whatsappLink } from "@/lib/utils";

/** Floating WhatsApp CTA, rendered site-wide from the root layout. */
export function WhatsAppButton({ phone, message }: { phone: string; message?: string }) {
  return (
    <a
      href={whatsappLink(phone, message ?? "Hi Future Solutions! I'd like to talk about a project.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-4 bottom-4 z-40 flex size-12 sm:size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-10px_rgba(37,211,102,0.7)] transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.4s] motion-reduce:hidden"
      />
      <svg viewBox="0 0 32 32" className="size-7" fill="currentColor" aria-hidden>
        <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.6.8 5.1 2.2 7.2L3 29l6.2-2c2 1.1 4.4 1.7 6.8 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.2 0-4.3-.6-6.1-1.7l-.4-.3-3.7 1.2 1.2-3.5-.3-.4A10.4 10.4 0 0 1 5.3 15.8C5.3 10 10.1 5.3 16 5.3s10.7 4.7 10.7 10.5S21.9 26.4 16 26.4zm5.9-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
      </svg>
    </a>
  );
}
