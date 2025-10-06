"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full shadow-xs transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
        // Unchecked - gray liquid glass
        "data-[state=unchecked]:bg-[hsla(200,14%,78%,0.28)] data-[state=unchecked]:backdrop-blur-[12px] data-[state=unchecked]:backdrop-saturate-[140%]",
        "data-[state=unchecked]:border data-[state=unchecked]:border-[hsla(200,16%,80%,0.18)]",
        // Checked - amber liquid glass
        "data-[state=checked]:bg-amber-500/50 data-[state=checked]:backdrop-blur-[16px] data-[state=checked]:backdrop-saturate-[140%]",
        "data-[state=checked]:border data-[state=checked]:border-amber-500/30",
        "data-[state=checked]:shadow-[0_2px_4px_rgba(245,158,11,0.18)]",
        // Focus ring
        "focus-visible:ring-[3px] focus-visible:ring-amber-500/30",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          // Thumb styling
          "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
