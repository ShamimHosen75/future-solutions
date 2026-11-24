"use client";

import { useState, type FormEvent } from "react";

/**
 * Newsletter sign-up. Placeholder: shows a thank-you state but does not store the address yet.
 * TODO: connect to your email provider (Mailchimp, Resend audiences, etc.).
 */
export const NewsletterForm = () => {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
  };

  if (done) {
    return <p role="status" className="rounded-full bg-white/10 px-5 py-3.5 text-sm font-medium text-white">Thanks for subscribing! Check your inbox to confirm.</p>;
  }

  return (
    <form noValidate onSubmit={onSubmit} className="w-full max-w-md">
      <div className="flex rounded-full bg-white p-1.5">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={!!error}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-ink placeholder:text-muted/70 focus:outline-none"
        />
        <button type="submit" className="h-11 shrink-0 rounded-full bg-gradient-orange px-5 text-sm font-medium text-white active:scale-[0.97]">
          Subscribe
        </button>
      </div>
      {error ? <p className="mt-2 pl-4 text-xs text-orange-300">{error}</p> : null}
    </form>
  );
};
