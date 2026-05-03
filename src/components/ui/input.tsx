import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-none border border-primary/40 bg-input/60 px-3 py-2 text-base font-mono text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_1px_hsl(var(--term-green)/0.6),0_0_12px_hsl(var(--term-green)/0.3)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }