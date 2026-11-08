import { z } from "zod";

const name = z.string().trim().min(2, "Please enter your name").max(120);
const email = z.string().trim().email("Enter a valid email address").max(200);
const phone = z
  .string()
  .trim()
  .max(30)
  .regex(/^[+\d][\d\s()-]{6,}$/, "Enter a valid phone number")
  .or(z.literal(""))
  .optional();
const message = z.string().trim().max(5000, "Message is too long");

/** Hidden fields every public form carries. */
const protection = {
  turnstileToken: z.string().optional(),
  /** Honeypot. Must stay empty. */
  website: z.string().max(0, "Spam detected").optional(),
};

export const contactSchema = z.object({
  intent: z.enum(["contact", "quote"]).default("contact"),
  name,
  email,
  phone,
  company: z.string().trim().max(120).optional(),
  serviceId: z.string().uuid().or(z.literal("")).optional(),
  budget: z.string().trim().max(60).optional(),
  message: message.min(10, "Tell us a little more (at least 10 characters)"),
  ...protection,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const enrollmentSchema = z.object({
  name,
  email,
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{6,}$/, "Enter a valid phone number").max(30),
  courseId: z.string().uuid("Please choose a course"),
  batch: z.string().trim().max(80).optional(),
  background: z.string().trim().max(1000).optional(),
  ...protection,
});
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;

export const reviewSchema = z.object({
  name,
  email,
  role: z.string().trim().max(120).optional(),
  company: z.string().trim().max(120).optional(),
  rating: z.coerce.number().int().min(1, "Please pick a rating").max(5),
  content: z.string().trim().min(10, "Please write at least 10 characters").max(2000),
  ...protection,
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const careerSchema = z.object({
  name,
  email,
  phone,
  position: z.string().trim().min(2, "Which role are you applying for?").max(120),
  portfolioUrl: z.string().trim().url("Enter a valid URL (including https://)").max(300).or(z.literal("")).optional(),
  message: message.min(20, "Tell us about yourself (at least 20 characters)"),
  ...protection,
});
export type CareerInput = z.infer<typeof careerSchema>;

export const budgets = [
  "Under ৳50,000",
  "৳50,000 – ৳1,00,000",
  "৳1,00,000 – ৳3,00,000",
  "৳3,00,000 – ৳10,00,000",
  "Above ৳10,00,000",
  "Not sure yet",
] as const;

/** Shape returned by every lead action for `useActionState`. */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialFormState: FormState = { status: "idle" };
