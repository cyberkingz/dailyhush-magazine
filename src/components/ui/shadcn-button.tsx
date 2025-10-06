// "use client"

import { cva, type VariantProps } from "class-variance-authority"
import {
  Button as AriaButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors",
    /* Disabled */
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ",
    /* Focus Visible */
    "data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-amber-500 data-[focus-visible]:ring-offset-2",
    /* Resets */
    "focus-visible:outline-none",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-amber-500 text-white data-[hovered]:bg-amber-600",
        destructive:
          "bg-destructive text-destructive-foreground data-[hovered]:bg-destructive/90",
        outline:
          "border border-neutral-300 bg-white data-[hovered]:bg-neutral-50 data-[hovered]:text-neutral-900",
        secondary:
          "bg-secondary text-secondary-foreground data-[hovered]:bg-secondary/80",
        ghost: "data-[hovered]:bg-neutral-100 data-[hovered]:text-neutral-900",
        link: "text-amber-600 underline-offset-4 data-[hovered]:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ShadcnButtonProps
  extends AriaButtonProps,
    VariantProps<typeof buttonVariants> {}

const ShadcnButton = ({ className, variant, size, ...props }: ShadcnButtonProps) => {
  return (
    <AriaButton
      className={composeRenderProps(className, (className) =>
        cn(
          buttonVariants({
            variant,
            size,
            className,
          })
        )
      )}
      {...props}
    />
  )
}

export { ShadcnButton, buttonVariants }
export type { ShadcnButtonProps }
