import * as React from "react";

import { cn } from "@/lib/utils";

type InputGroupProps = React.ComponentProps<"div">;

export function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-stretch overflow-hidden rounded-md border bg-background text-sm focus-within:ring-2 focus-within:ring-ring",
        className
      )}
      {...props}
    />
  );
}

type InputGroupInputProps = React.ComponentProps<"input">;

export const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-full w-full flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
InputGroupInput.displayName = "InputGroupInput";

type InputGroupAddonProps = React.ComponentProps<"div"> & {
  align?: "inline-start" | "inline-end";
};

export function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-3 text-muted-foreground",
        align === "inline-start" ? "border-r" : "border-l",
        className
      )}
      {...props}
    />
  );
}


