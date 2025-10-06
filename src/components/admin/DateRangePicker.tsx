import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { CalendarDate } from "@internationalized/date"
import type { DateValue } from "react-aria-components"

type RangeValue<T> = {
  start: T
  end: T
}

import { cn } from "@/lib/utils"
import Button from "@/components/ui/Button"
import {
  RangeCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
} from "@/components/ui/range-calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  className?: string
}

// Convert JS Date to CalendarDate
function toCalendarDate(date: Date): CalendarDate {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // JS months are 0-indexed
  const day = date.getDate()
  return new CalendarDate(year, month, day)
}

// Convert CalendarDate to JS Date
function toJSDate(calendarDate: DateValue): Date {
  return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day)
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Convert DateRange to RangeValue<DateValue>
  const rangeValue: RangeValue<DateValue> | null | undefined = React.useMemo(() => {
    if (!date?.from) return null
    return {
      start: toCalendarDate(date.from),
      end: date.to ? toCalendarDate(date.to) : toCalendarDate(date.from),
    }
  }, [date])

  // Handle range change from calendar
  const handleRangeChange = (range: RangeValue<DateValue> | null) => {
    if (!range) {
      onDateChange(undefined)
      return
    }

    onDateChange({
      from: toJSDate(range.start),
      to: toJSDate(range.end),
    })

    // Close popover when range is complete
    setTimeout(() => setIsOpen(false), 300)
  }

  const presets = [
    {
      label: "Last 7 days",
      value: {
        from: subDays(new Date(), 7),
        to: new Date(),
      },
    },
    {
      label: "Last 30 days",
      value: {
        from: subDays(new Date(), 30),
        to: new Date(),
      },
    },
    {
      label: "Last 90 days",
      value: {
        from: subDays(new Date(), 90),
        to: new Date(),
      },
    },
    {
      label: "All time",
      value: {
        from: subDays(new Date(), 365),
        to: new Date(),
      },
    },
  ]

  const handlePresetClick = (preset: DateRange) => {
    onDateChange(preset)
    setIsOpen(false)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="md"
            className={cn(
              "w-full sm:w-[280px] md:w-[300px] justify-start text-left font-normal whitespace-nowrap",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                "Pick a date range"
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-auto p-0 max-w-[min(95vw,700px)] overflow-hidden",
            // Muted monochrome emerald liquid glass popover
            "!bg-emerald-500/30 !backdrop-blur-[48px] !backdrop-saturate-[140%]",
            "!border !border-emerald-500/25",
            "shadow-[0_16px_32px_-8px_rgba(16,185,129,0.12),0_24px_48px_-12px_rgba(16,185,129,0.18),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
            "rounded-[24px]"
          )}
          align="start"
          sideOffset={8}
        >
          <div className="p-5 max-w-full">
            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-emerald-500/15">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset.value)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium",
                    "rounded-[12px]",
                    "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                    // Muted emerald preset button
                    "bg-emerald-500/20 backdrop-blur-[16px] backdrop-saturate-[140%]",
                    "text-white border border-emerald-500/20",
                    "shadow-[0_1px_2px_-1px_rgba(16,185,129,0.08),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
                    // Hover - muted emerald liquid rise
                    "hover:bg-emerald-500/30 hover:border-emerald-500/30",
                    "hover:shadow-[0_2px_4px_-2px_rgba(16,185,129,0.12)]",
                    "hover:scale-[1.01] hover:-translate-y-[0.5px]",
                    "active:scale-[0.99] active:translate-y-0"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {/* Calendar */}
            <div className="overflow-x-auto -mx-4 px-4">
              <RangeCalendar
                aria-label="Date range"
                value={rangeValue}
                onChange={handleRangeChange}
                className="bg-transparent mx-auto"
                visibleDuration={{ months: window.innerWidth >= 1024 ? 2 : 1 }}
              >
                <CalendarHeading />
                <div className="flex gap-4">
                  <CalendarGrid>
                    <CalendarGridHeader>
                      {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                    </CalendarGridHeader>
                    <CalendarGridBody>
                      {(date) => <CalendarCell date={date} />}
                    </CalendarGridBody>
                  </CalendarGrid>
                  {window.innerWidth >= 1024 && (
                    <CalendarGrid offset={{ months: 1 }}>
                      <CalendarGridHeader>
                        {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                      </CalendarGridHeader>
                      <CalendarGridBody>
                        {(date) => <CalendarCell date={date} />}
                      </CalendarGridBody>
                    </CalendarGrid>
                  )}
                </div>
              </RangeCalendar>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
