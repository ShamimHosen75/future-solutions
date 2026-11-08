import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerProps<T extends React.ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Container<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as React.ElementType;
  return (
    <Tag className={cn("container-x", className)} {...rest}>
      {children}
    </Tag>
  );
}
