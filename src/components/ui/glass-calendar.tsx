import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  getDate,
  getDaysInMonth,
  startOfMonth,
  isWithinInterval,
  isBefore
} from "date-fns"
import { motion } from "framer-motion"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

interface Day {
  date: Date
  isToday: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isInRange: boolean
}

interface GlassCalendarProps {
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  className?: string
}

const ScrollbarHide = () => (
  <style>{`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
)

export const GlassCalendar = React.forwardRef<HTMLDivElement, GlassCalendarProps>(
  ({ className, dateRange, onDateRangeChange }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(dateRange?.from || new Date())
    const [isMobile, setIsMobile] = React.useState(false)
    const [hoverDate, setHoverDate] = React.useState<Date | null>(null)

    React.useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768)
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const getMonthDays = (month: Date) => {
      const start = startOfMonth(month)
      const totalDays = getDaysInMonth(month)
      const days: Day[] = []

      for (let i = 0; i < totalDays; i++) {
        const date = new Date(start.getFullYear(), start.getMonth(), i + 1)
        const isRangeStart = dateRange?.from ? isSameDay(date, dateRange.from) : false
        const isRangeEnd = dateRange?.to ? isSameDay(date, dateRange.to) : false

        // Enhanced range detection with hover preview
        let isInRange = false
        if (dateRange?.from && dateRange?.to) {
          isInRange = isWithinInterval(date, { start: dateRange.from, end: dateRange.to }) && !isRangeStart && !isRangeEnd
        } else if (dateRange?.from && hoverDate && !isBefore(hoverDate, dateRange.from)) {
          // Show preview range while hovering
          isInRange = isWithinInterval(date, { start: dateRange.from, end: hoverDate }) && !isRangeStart && !isSameDay(date, hoverDate)
        }

        days.push({
          date,
          isToday: isToday(date),
          isRangeStart,
          isRangeEnd,
          isInRange,
        })
      }
      return days
    }

    const firstMonthDays = React.useMemo(() => getMonthDays(currentMonth), [currentMonth, dateRange, hoverDate])
    const secondMonthDays = React.useMemo(() => getMonthDays(addMonths(currentMonth, 1)), [currentMonth, dateRange, hoverDate])

    const handleDateClick = (date: Date) => {
      if (!dateRange?.from || (dateRange.from && dateRange.to)) {
        // Start new range
        onDateRangeChange?.({ from: date, to: undefined })
      } else if (isBefore(date, dateRange.from)) {
        // Swap dates if end is before start
        onDateRangeChange?.({ from: date, to: dateRange.from })
      } else {
        // Complete the range
        onDateRangeChange?.({ from: dateRange.from, to: date })
      }
      setHoverDate(null)
    }

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

    const renderMonthGrid = (days: Day[], monthDate: Date) => (
      <div className="flex flex-col">
        <div className="mb-3 flex items-center justify-between">
          <motion.p
            key={format(monthDate, "MMMM yyyy")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-base font-semibold text-gray-900"
          >
            {format(monthDate, "MMMM yyyy")}
          </motion.p>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for proper calendar alignment */}
          {Array.from({ length: startOfMonth(monthDate).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((day) => {
            const isHoveredEnd = !!(hoverDate && isSameDay(day.date, hoverDate) && dateRange?.from && !dateRange?.to)

            return (
              <button
                key={format(day.date, "yyyy-MM-dd")}
                onClick={() => handleDateClick(day.date)}
                onMouseEnter={() => setHoverDate(day.date)}
                onMouseLeave={() => setHoverDate(null)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 relative group",
                  {
                    // Range endpoints (start/end)
                    "bg-amber-500 text-white hover:bg-amber-600 shadow-sm z-10":
                      day.isRangeStart || day.isRangeEnd,

                    // Hover preview for end date
                    "bg-amber-400 text-white hover:bg-amber-500 shadow-sm z-10 ring-2 ring-amber-300":
                      isHoveredEnd,

                    // In range
                    "bg-amber-50 text-amber-900":
                      day.isInRange && !day.isRangeStart && !day.isRangeEnd,

                    // Default state with hover
                    "text-gray-700 hover:bg-gray-100 hover:ring-1 hover:ring-gray-200":
                      !day.isRangeStart && !day.isRangeEnd && !day.isInRange && !isHoveredEnd,

                    // Today indicator
                    "ring-2 ring-inset ring-amber-400":
                      day.isToday && !day.isRangeStart && !day.isRangeEnd && !isHoveredEnd,
                  }
                )}
                aria-label={format(day.date, "MMMM d, yyyy")}
                aria-pressed={day.isRangeStart || day.isRangeEnd}
              >
                {getDate(day.date)}
              </button>
            )
          })}
        </div>
      </div>
    )

    // Determine selection state message
    const getSelectionMessage = () => {
      if (!dateRange?.from) {
        return { text: "Select start date", color: "text-gray-500" }
      }
      if (!dateRange?.to) {
        return { text: "Select end date", color: "text-amber-600" }
      }
      const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
      return { text: `${days + 1} day${days !== 0 ? 's' : ''} selected`, color: "text-green-600" }
    }

    const selectionState = getSelectionMessage()

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          className
        )}
      >
        <ScrollbarHide />

        {/* Selection State Indicator */}
        <div className="mb-4 px-1">
          <div className="flex items-center justify-between">
            <p className={cn("text-sm font-semibold", selectionState.color)}>
              {selectionState.text}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg text-gray-600 transition-colors hover:bg-neutral-100 hover:text-gray-900"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg text-gray-600 transition-colors hover:bg-neutral-100 hover:text-gray-900"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className={cn("grid gap-8", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          {renderMonthGrid(firstMonthDays, currentMonth)}
          {!isMobile && renderMonthGrid(secondMonthDays, addMonths(currentMonth, 1))}
        </div>

        {/* Selected Range Summary */}
        {dateRange?.from && dateRange?.to && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="text-sm text-gray-600 bg-amber-50 rounded-lg px-4 py-3 border border-amber-100">
              <span className="font-semibold text-amber-900">Selected: </span>
              <span className="text-gray-800">
                {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    )
  }
)

GlassCalendar.displayName = "GlassCalendar"
