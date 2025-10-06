import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.ComponentProps<"div"> {
  intensity?: 'light' | 'medium' | 'heavy'
  bordered?: boolean
}

function GlassCard({
  className,
  intensity = 'medium',
  bordered = true,
  children,
  ...props
}: GlassCardProps) {
  const intensityStyles = {
    light: 'bg-slate-50/75 backdrop-blur-[12px]',
    medium: 'bg-slate-50/85 backdrop-blur-[16px]',
    heavy: 'bg-slate-50/95 backdrop-blur-[20px]'
  }

  return (
    <div
      className={cn(
        // Base glass effect with warm tint
        intensityStyles[intensity],

        // Border & shadow - increased visibility
        bordered && "border border-white/30",
        "shadow-[0_12px_32px_-4px_rgba(0,0,0,0.16),0_6px_20px_-4px_rgba(0,0,0,0.12)]",

        // Structure
        "rounded-2xl",

        // Support for backdrop
        "relative overflow-hidden",

        // Before pseudo-element for subtle gradient
        "before:absolute before:inset-0",
        "before:rounded-2xl before:p-[1px]",
        "before:bg-gradient-to-br before:from-white/20 before:to-transparent",
        "before:-z-10",

        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { GlassCard }
