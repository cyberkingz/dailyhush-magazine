import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Refined liquid glass input
          "flex h-[36px] w-full px-3 py-2 text-sm",
          // Gray liquid glass foundation
          "bg-[hsla(200,16%,85%,0.14)] backdrop-blur-[16px] backdrop-saturate-[140%]",
          "border border-[hsla(200,18%,85%,0.14)]",
          "shadow-[0_1px_2px_-1px_rgba(31,45,61,0.04),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
          "rounded-[12px]",
          // Text styling
          "text-white placeholder:text-white/40",
          "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          // Focus state - muted emerald accent for interaction
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-0",
          "focus-visible:bg-[hsla(200,14%,78%,0.18)] focus-visible:border-emerald-500/20",
          "focus-visible:shadow-[0_2px_4px_rgba(16,185,129,0.15),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
          // Hover state - subtle liquid rise
          "hover:bg-[hsla(200,14%,78%,0.16)] hover:border-[hsla(200,16%,80%,0.18)]",
          // File input
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white/80",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[hsla(200,16%,85%,0.14)]",
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
