import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // Refined gray liquid glass card - visible background
        "flex flex-col gap-4 p-5",
        "bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[200%]",
        "border border-[hsla(200,16%,80%,0.18)]",
        "shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]",
        "rounded-[16px]",
        "text-white",
        "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        // Subtle hover - delicate lift
        "hover:shadow-[0_16px_32px_-8px_rgba(31,45,61,0.12),0_24px_48px_-12px_rgba(31,45,61,0.18),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
        "hover:-translate-y-[1px]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "[.border-b]:pb-4 [.border-b]:border-[hsla(200,18%,85%,0.14)]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "leading-tight font-semibold text-base text-white",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-white/60 text-sm leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center",
        "[.border-t]:pt-4 [.border-t]:border-[hsla(200,18%,85%,0.14)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
