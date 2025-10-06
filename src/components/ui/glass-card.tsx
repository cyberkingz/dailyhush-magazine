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
    // Monochrome emerald liquid glass - proper hierarchy
    light: cn(
      'bg-emerald-500/15',
      'backdrop-blur-[16px]',
      'backdrop-saturate-[180%]'
    ),
    medium: cn(
      'bg-emerald-500/18',
      'backdrop-blur-[32px]',
      'backdrop-saturate-[200%]'
    ),
    heavy: cn(
      'bg-emerald-500/22',
      'backdrop-blur-[48px]',
      'backdrop-saturate-[200%]'
    )
  }

  return (
    <div
      className={cn(
        // Gray liquid glass base
        intensityStyles[intensity],

        // Multi-layer borders and inner glow
        bordered && "border border-[hsla(200,16%,80%,0.18)]",

        // Elevated shadow with water depth
        "shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]",

        // Refined structure with visible border radius
        "rounded-[20px]",

        // Support for backdrop and fluid transitions
        "relative overflow-hidden",
        "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",

        // Before pseudo: refined gradient border overlay
        "before:absolute before:inset-0",
        "before:rounded-[20px] before:p-[0.5px]",
        "before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent",
        "before:-z-10",
        "before:transition-opacity before:duration-[250ms]",

        // Hover: delicate liquid rise
        "hover:bg-[hsla(200,12%,50%,0.28)]",
        "hover:shadow-[0_16px_32px_-8px_rgba(31,45,61,0.12),0_24px_48px_-12px_rgba(31,45,61,0.18),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
        "hover:-translate-y-[1px]",
        "hover:scale-[1.002]",

        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { GlassCard }
