"use client";

import * as React from "react";
import { useForm, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { initialFormState, type FormState } from "@/lib/validation/leads";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

/**
 * Glue between React Hook Form (client validation) and a Server Action
 * (authoritative validation + persistence). Submits the real <form> so the
 * action receives FormData including hidden fields.
 */
export function useLeadForm<Values extends FieldValues>(
  schema: z.ZodType<Values, unknown>,
  action: Action,
  defaults?: Partial<Values>,
) {
  const [state, formAction, pending] = React.useActionState(action, initialFormState);
  const [token, setToken] = React.useState("");
  const [responseCount, setResponseCount] = React.useState(0);
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema as never) as unknown as Resolver<Values>,
    defaultValues: defaults as never,
    mode: "onTouched",
  });

  // Push server-side field errors into RHF so they show inline.
  React.useEffect(() => {
    if (state.status === "error" && state.fieldErrors) {
      for (const [name, messages] of Object.entries(state.fieldErrors)) {
        form.setError(name as never, { type: "server", message: messages[0] });
      }
    }
    if (state.status !== "idle") setResponseCount((n) => n + 1);
  }, [state, form]);

  /** Validate on the client first; only then let the native submit reach the action. */
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Capture before awaiting: React nulls currentTarget once the handler yields.
    const formEl = event.currentTarget;
    const valid = await form.trigger();
    if (!valid) return;
    React.startTransition(() => formAction(new FormData(formEl)));
  };

  const errorOf = (name: keyof Values & string) => {
    const err = (form.formState.errors as FieldValues)[name] as { message?: string } | undefined;
    return err?.message;
  };

  return { form, state, pending, token, setToken, responseCount, formRef, onSubmit, errorOf };
}
