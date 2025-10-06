import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import Button from "@/components/ui/Button"
import { Calendar } from "@/components/ui/simple-calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SimpleDateRangePickerProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  className?: string
}

export function SimpleDateRangePicker({
  date,
  onDateChange,
  className,
}: SimpleDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

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
  ]

  const handlePresetClick = (preset: DateRange) => {
    onDateChange(preset)
    setIsOpen(false)
  }

  const handleSelect = (range: DateRange | undefined) => {
    onDateChange(range)
    // Close when both dates are selected
    if (range?.from && range?.to) {
      setTimeout(() => setIsOpen(false), 200)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="md"
            className={cn(
              "w-full sm:w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
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
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          {/* Presets */}
          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-neutral-200">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset.value)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-amber-50 hover:text-amber-700 border border-neutral-200 rounded-lg transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
