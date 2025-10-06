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
    light: 'bg-white/40 backdrop-blur-[8px]',
    medium: 'bg-white/60 backdrop-blur-[12px]',
    heavy: 'bg-white/80 backdrop-blur-[16px]'
  }

  return (
    <div
      className={cn(
        // Base glass effect
        intensityStyles[intensity],

        // Border & shadow
        bordered && "border border-white/20",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",

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
