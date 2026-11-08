import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

/** Site Button with a built-in pending spinner, for dashboard forms. */
export function AdminButton({ pending, children, ...props }: ButtonProps & { pending?: boolean }) {
  const disabled = Boolean(pending) || ("disabled" in props && Boolean(props.disabled));
  return (
    <Button {...(props as ButtonProps)} {...(!("href" in props) ? { disabled } : {})}>
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </Button>
  );
}
