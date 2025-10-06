// "use client"

import * as React from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  Heading as AriaHeading,
  RangeCalendar as AriaRangeCalendar,
  RangeCalendarStateContext as AriaRangeCalendarStateContext,
  composeRenderProps,
  Text,
  useLocale,
  type CalendarCellProps as AriaCalendarCellProps,
  type CalendarGridBodyProps as AriaCalendarGridBodyProps,
  type CalendarGridHeaderProps as AriaCalendarGridHeaderProps,
  type CalendarGridProps as AriaCalendarGridProps,
  type CalendarHeaderCellProps as AriaCalendarHeaderCellProps,
  type CalendarProps as AriaCalendarProps,
  type DateValue as AriaDateValue,
  type RangeCalendarProps as AriaRangeCalendarProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

const Calendar = AriaCalendar

const RangeCalendar = AriaRangeCalendar

const CalendarHeading = (props: React.HTMLAttributes<HTMLElement>) => {
  let { direction } = useLocale()

  return (
    <header className="flex w-full items-center gap-1 px-1 pb-4" {...props}>
      <AriaButton
        slot="previous"
        className={cn(
          "size-7 p-0 flex items-center justify-center",
          // Muted emerald liquid glass button
          "bg-emerald-500/15 backdrop-blur-[12px] backdrop-saturate-[140%]",
          "border border-emerald-500/15",
          "rounded-[8px] text-white/80",
          "transition-all duration-[250ms]",
          /* Hover - muted emerald liquid rise */
          "data-[hovered]:bg-emerald-500/20 data-[hovered]:border-emerald-500/20",
          "data-[hovered]:text-white data-[hovered]:shadow-sm"
        )}
      >
        {direction === "rtl" ? (
          <ChevronRight aria-hidden className="size-4" />
        ) : (
          <ChevronLeft aria-hidden className="size-4" />
        )}
      </AriaButton>
      <AriaHeading className="grow text-center text-sm font-medium text-white" />
      <AriaButton
        slot="next"
        className={cn(
          "size-7 p-0 flex items-center justify-center",
          // Muted emerald liquid glass button
          "bg-emerald-500/15 backdrop-blur-[12px] backdrop-saturate-[140%]",
          "border border-emerald-500/15",
          "rounded-[8px] text-white/80",
          "transition-all duration-[250ms]",
          /* Hover - muted emerald liquid rise */
          "data-[hovered]:bg-emerald-500/20 data-[hovered]:border-emerald-500/20",
          "data-[hovered]:text-white data-[hovered]:shadow-sm"
        )}
      >
        {direction === "rtl" ? (
          <ChevronLeft aria-hidden className="size-4" />
        ) : (
          <ChevronRight aria-hidden className="size-4" />
        )}
      </AriaButton>
    </header>
  )
}

const CalendarGrid = ({ className, ...props }: AriaCalendarGridProps) => (
  <AriaCalendarGrid
    className={cn(
      " border-separate border-spacing-x-0 border-spacing-y-1 ",
      className
    )}
    {...props}
  />
)

const CalendarGridHeader = ({ ...props }: AriaCalendarGridHeaderProps) => (
  <AriaCalendarGridHeader {...props} />
)

const CalendarHeaderCell = ({
  className,
  ...props
}: AriaCalendarHeaderCellProps) => (
  <AriaCalendarHeaderCell
    className={cn(
      "w-9 rounded-md text-[0.8rem] font-normal text-white/60",
      className
    )}
    {...props}
  />
)

const CalendarGridBody = ({
  className,
  ...props
}: AriaCalendarGridBodyProps) => (
  <AriaCalendarGridBody className={cn("[&>tr>td]:p-0", className)} {...props} />
)

const CalendarCell = ({ className, ...props }: AriaCalendarCellProps) => {
  const isRange = Boolean(React.useContext(AriaRangeCalendarStateContext))
  return (
    <AriaCalendarCell
      className={composeRenderProps(className, (className, renderProps) =>
        cn(
          "relative flex size-9 items-center justify-center p-0 text-sm font-semibold",
          "rounded-[10px] text-white",
          "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          /* Default hover - subtle liquid glass */
          !renderProps.isSelected && !renderProps.isDisabled &&
            "data-[hovered]:bg-[hsla(200,14%,78%,0.22)] data-[hovered]:backdrop-blur-[12px] data-[hovered]:backdrop-saturate-[180%] data-[hovered]:shadow-sm",
          /* Disabled */
          renderProps.isDisabled && "text-white/40 opacity-50",
          /* Selected - muted emerald liquid glass */
          renderProps.isSelected &&
            "bg-emerald-500/35 backdrop-blur-[16px] backdrop-saturate-[140%] text-white shadow-[0_2px_4px_rgba(16,185,129,0.18)] data-[focused]:bg-emerald-500/40 data-[focused]:text-white",
          /* Hover on selected - slightly stronger emerald */
          renderProps.isHovered &&
            renderProps.isSelected &&
            (renderProps.isSelectionStart ||
              renderProps.isSelectionEnd ||
              !isRange) &&
            "data-[hovered]:bg-emerald-500/45 data-[hovered]:shadow-[0_2px_4px_rgba(16,185,129,0.22)] data-[hovered]:text-white data-[hovered]:scale-[1.02]",
          /* Selection Start - fully rounded left */
          renderProps.isSelectionStart && isRange && "rounded-l-[10px] rounded-r-none",
          /* Selection End - fully rounded right */
          renderProps.isSelectionEnd && isRange && "rounded-r-[10px] rounded-l-none",
          /* Middle of range - gray liquid glass bridge */
          renderProps.isSelected &&
            isRange &&
            !renderProps.isSelectionStart &&
            !renderProps.isSelectionEnd &&
            "rounded-none bg-[hsla(200,12%,70%,0.28)] backdrop-blur-[16px] backdrop-saturate-[140%] text-white shadow-none",
          /* Outside Month */
          renderProps.isOutsideMonth &&
            "text-white/25 opacity-40 data-[selected]:bg-[hsla(200,14%,78%,0.12)] data-[selected]:text-white/30 data-[selected]:opacity-30",
          /* Current Date - liquid glass with muted emerald ring */
          renderProps.date.compare(today(getLocalTimeZone())) === 0 &&
            !renderProps.isSelected &&
            "bg-[hsla(200,12%,70%,0.25)] backdrop-blur-[12px] backdrop-saturate-[140%] text-white ring-2 ring-inset ring-emerald-500/40 shadow-sm",
          /* Unavailable Date */
          renderProps.isUnavailable && "cursor-default text-red-400",
          renderProps.isInvalid &&
            "bg-red-500/25 backdrop-blur-[12px] text-red-400 data-[focused]:bg-red-500/35 data-[hovered]:bg-red-500/35",
          className
        )
      )}
      {...props}
    />
  )
}

interface JollyCalendarProps<T extends AriaDateValue>
  extends AriaCalendarProps<T> {
  errorMessage?: string
}

function JollyCalendar<T extends AriaDateValue>({
  errorMessage,
  className,
  ...props
}: JollyCalendarProps<T>) {
  return (
    <Calendar
      className={composeRenderProps(className, (className) =>
        cn("w-fit", className)
      )}
      {...props}
    >
      <CalendarHeading />
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text className="text-sm text-destructive" slot="errorMessage">
          {errorMessage}
        </Text>
      )}
    </Calendar>
  )
}

interface JollyRangeCalendarProps<T extends AriaDateValue>
  extends AriaRangeCalendarProps<T> {
  errorMessage?: string
}

function JollyRangeCalendar<T extends AriaDateValue>({
  errorMessage,
  className,
  ...props
}: JollyRangeCalendarProps<T>) {
  return (
    <RangeCalendar
      className={composeRenderProps(className, (className) =>
        cn("w-fit", className)
      )}
      {...props}
    >
      <CalendarHeading />
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="text-sm text-destructive">
          {errorMessage}
        </Text>
      )}
    </RangeCalendar>
  )
}

export {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  RangeCalendar,
  JollyCalendar,
  JollyRangeCalendar,
}
export type { JollyCalendarProps, JollyRangeCalendarProps }
