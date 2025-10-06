"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"

const buttonVariants = ({
  variant = "ghost",
}: {
  variant?: "ghost" | "outline" | "primary" | "secondary"
}) => {
  const variants = {
    ghost: "hover:bg-emerald-500/15 hover:backdrop-blur-[12px] hover:text-white",
    outline: "border border-emerald-500/15 hover:bg-emerald-500/15",
    primary: "bg-emerald-500/35 backdrop-blur-[16px] backdrop-saturate-[140%] text-white hover:bg-emerald-500/45",
    secondary: "bg-emerald-600/35 backdrop-blur-[16px] backdrop-saturate-[140%] text-white hover:bg-emerald-600/45",
  }
  return cn("inline-flex items-center justify-center rounded-[10px] text-sm font-semibold transition-all duration-[250ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none", variants[variant])
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "outline" | "primary" | "secondary"
  size?: "sm" | "md" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "ghost", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 px-3",
      md: "h-10 px-4",
      lg: "h-12 px-6",
      icon: "h-9 w-9 p-0",
    }

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant }),
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: "ghost" | "outline" | "primary" | "secondary"
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem]",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-6 flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-8 w-full px-8",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-8 gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-emerald-500/40 border border-emerald-500/15 shadow-sm rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-emerald-950/90 inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-white/60 rounded-md flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-8",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-white/60",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-[10px] bg-emerald-500/35 backdrop-blur-[16px] backdrop-saturate-[140%]",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "rounded-none bg-[hsla(200,12%,70%,0.28)] backdrop-blur-[16px] backdrop-saturate-[140%]",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "rounded-r-[10px] bg-emerald-500/35 backdrop-blur-[16px] backdrop-saturate-[140%]",
          defaultClassNames.range_end
        ),
        today: cn(
          "bg-[hsla(200,12%,70%,0.25)] backdrop-blur-[12px] backdrop-saturate-[140%] ring-2 ring-inset ring-emerald-500/40 shadow-sm text-white rounded-[10px]",
          defaultClassNames.today
        ),
        outside: cn(
          "text-white/25 aria-selected:text-white/25",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-white/25 opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex h-8 w-8 items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-emerald-500/35 data-[selected-single=true]:backdrop-blur-[16px] data-[selected-single=true]:backdrop-saturate-[140%] data-[selected-single=true]:text-white data-[selected-single=true]:shadow-[0_2px_4px_rgba(16,185,129,0.18)] data-[range-middle=true]:bg-[hsla(200,12%,70%,0.28)] data-[range-middle=true]:backdrop-blur-[16px] data-[range-middle=true]:backdrop-saturate-[140%] data-[range-middle=true]:text-white data-[range-start=true]:bg-emerald-500/35 data-[range-start=true]:backdrop-blur-[16px] data-[range-start=true]:backdrop-saturate-[140%] data-[range-start=true]:text-white data-[range-start=true]:shadow-[0_2px_4px_rgba(16,185,129,0.18)] data-[range-end=true]:bg-emerald-500/35 data-[range-end=true]:backdrop-blur-[16px] data-[range-end=true]:backdrop-saturate-[140%] data-[range-end=true]:text-white data-[range-end=true]:shadow-[0_2px_4px_rgba(16,185,129,0.18)] flex aspect-square w-full min-w-8 flex-col gap-1 leading-none font-semibold data-[range-end=true]:rounded-[10px] data-[range-end=true]:rounded-r-[10px] data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-[10px] data-[range-start=true]:rounded-l-[10px]",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
