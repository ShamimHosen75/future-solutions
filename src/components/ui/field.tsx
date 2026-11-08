import * as React from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface/60 px-4 py-3 text-sm text-white placeholder:text-muted/70 transition-colors focus:border-cyan/60 focus:bg-surface focus:outline-none disabled:opacity-50 aria-[invalid=true]:border-orange/70";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(control, className)} {...props} />;
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(control, "min-h-32 resize-y", className)} {...props} />;
  },
);

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select ref={ref} className={cn(control, "appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m5 7.5 5 5 5-5" />
      </svg>
    </div>
  );
});

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string | string[];
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

/** Label + control + error wrapper with proper aria wiring. */
export function Field({ label, htmlFor, error, hint, required, children, className }: FieldProps) {
  const message = Array.isArray(error) ? error[0] : error;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-xs font-medium tracking-wide text-silver">
        {label}
        {required ? <span className="text-orange"> *</span> : null}
      </label>
      {children}
      {message ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-orange">
          {message}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
