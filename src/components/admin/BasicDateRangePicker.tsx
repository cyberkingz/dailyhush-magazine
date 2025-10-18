import * as React from "react"
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react"
import { format, subDays, subMonths, startOfMonth } from "date-fns"
import type { DateRange } from "react-day-picker"
import Button from "@/components/ui/Button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface BasicDateRangePickerProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  className?: string
}

export function BasicDateRangePicker({
  date,
  onDateChange,
  className,
}: BasicDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date)
  const [isMobile, setIsMobile] = React.useState(false)

  const today = new Date()

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Sync tempDate with date when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempDate(date)
    }
  }, [isOpen, date])

  const presets = [
    {
      label: "Last 7 days",
      value: {
        from: subDays(today, 7),
        to: today,
      },
    },
    {
      label: "Last 30 days",
      value: {
        from: subDays(today, 30),
        to: today,
      },
    },
    {
      label: "Last 90 days",
      value: {
        from: subDays(today, 90),
        to: today,
      },
    },
  ]

  const handlePresetClick = (preset: DateRange) => {
    setTempDate(preset)
  }

  const handleSelect = (range: DateRange | undefined) => {
    setTempDate(range)
  }

  const handleReset = () => {
    const resetTo = new Date()
    setTempDate({
      from: subDays(resetTo, 30),
      to: resetTo,
    })
  }

  const handleApply = () => {
    onDateChange(tempDate)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempDate(date)
    setIsOpen(false)
  }

  const baseMonth = startOfMonth(date?.to ?? date?.from ?? today)
  const initialMonth = subMonths(baseMonth, 1)

  // Allow navigation up to 6 months in the future
  const toMonth = new Date(today.getFullYear(), today.getMonth() + 6, 1)

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="md"
            className={cn(
              "w-full sm:w-[280px] md:w-[320px] justify-start text-left font-normal whitespace-nowrap",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
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
            "w-[700px] p-0 max-w-[min(95vw,700px)] overflow-hidden",
            // Muted emerald liquid glass popover
            "!bg-emerald-500/30 !backdrop-blur-[48px] !backdrop-saturate-[140%]",
            "!border !border-emerald-500/25",
            "shadow-[0_16px_32px_-8px_rgba(16,185,129,0.12),0_24px_48px_-12px_rgba(16,185,129,0.18),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
            "rounded-[24px]"
          )}
          align="start"
          sideOffset={8}
          collisionPadding={16}
          avoidCollisions={true}
        >
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-white">Select date range</div>
              <button
                type="button"
                onClick={handleReset}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-medium",
                  "text-white/70 hover:text-white",
                  "transition-colors duration-[250ms]"
                )}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>

            {/* Presets - Stack on mobile */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 pb-4 border-b border-emerald-500/15">
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

            {/* Calendar - Shows 1 month on mobile, 2 on desktop */}
            <div className="w-fit mx-auto [--cell-size:2.125rem]">
              <Calendar
                mode="range"
                numberOfMonths={isMobile ? 1 : 2}
                defaultMonth={initialMonth}
                selected={tempDate}
                onSelect={handleSelect}
                initialFocus
                disabled={(day) => day > today}
                pagedNavigation={false}
                toMonth={toMonth}
              />
            </div>

            {/* Actions - Full width on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-emerald-500/15">
              <button
                type="button"
                onClick={handleCancel}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-[12px] w-full sm:w-auto",
                  "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                  // Gray liquid glass button
                  "bg-[hsla(200,14%,78%,0.18)] text-white",
                  "backdrop-blur-[16px] backdrop-saturate-[140%]",
                  "border border-[hsla(200,18%,85%,0.14)]",
                  "shadow-[0_1px_2px_-1px_rgba(31,45,61,0.04),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
                  // Hover - liquid rise
                  "hover:bg-[hsla(200,12%,70%,0.22)]",
                  "hover:shadow-[0_2px_4px_-2px_rgba(31,45,61,0.06)]",
                  "hover:border-[hsla(200,16%,80%,0.18)]",
                  "hover:-translate-y-[0.5px] hover:scale-[1.003]",
                  // Active
                  "active:translate-y-0 active:scale-[0.997]"
                )}
              >
                Cancel
              </button>
              <Button
                onClick={handleApply}
                variant="primary"
                size="md"
                className="px-4 py-2 w-full sm:w-auto"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
