import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[8px] border px-2.5 py-1 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none backdrop-blur-[12px] backdrop-saturate-[140%] transition-all duration-[250ms] overflow-hidden shadow-sm drop-shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-emerald-500/50 bg-emerald-500/45 text-emerald-100 [a&]:hover:bg-emerald-500/55",
        secondary:
          "border-[hsla(200,18%,85%,0.4)] bg-[hsla(200,16%,85%,0.35)] text-white [a&]:hover:bg-[hsla(200,14%,78%,0.45)]",
        destructive:
          "border-red-400/50 bg-red-500/45 text-red-100 [a&]:hover:bg-red-500/55",
        outline:
          "border-[hsla(200,18%,85%,0.45)] bg-[hsla(200,16%,85%,0.32)] text-white [a&]:hover:bg-[hsla(200,14%,78%,0.42)]",
        success:
          "border-emerald-500/50 bg-emerald-500/45 text-emerald-100 [a&]:hover:bg-emerald-500/55",
        warning:
          "border-amber-400/50 bg-amber-500/45 text-amber-100 [a&]:hover:bg-amber-500/55",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
