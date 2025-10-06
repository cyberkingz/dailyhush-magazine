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

  const today = new Date()

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
          className="w-[700px] p-0 bg-white border border-neutral-200/80 shadow-2xl rounded-2xl"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          avoidCollisions={true}
        >
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-gray-900">Select date range</div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-amber-600 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-neutral-200">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset.value)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-neutral-50 hover:bg-amber-50 hover:text-amber-700 border border-neutral-200 rounded-lg transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="w-fit mx-auto [--cell-size:2.125rem]">
              <Calendar
                mode="range"
                numberOfMonths={2}
                defaultMonth={initialMonth}
                selected={tempDate}
                onSelect={handleSelect}
                initialFocus
                disabled={(day) => day > today}
                pagedNavigation={false}
                toMonth={toMonth}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={handleApply}
                variant="primary"
                size="md"
                className="px-4 py-2"
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
