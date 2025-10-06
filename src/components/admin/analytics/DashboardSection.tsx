/**
 * DashboardSection Component
 *
 * Reusable layout component for analytics dashboard sections.
 * Prevents CSS Grid height-matching issues and provides consistent spacing.
 *
 * @example Basic usage with primary content and sidebar
 * ```tsx
 * <DashboardSection>
 *   <DashboardSection.Primary>
 *     <Card>
 *       <CardHeader><CardTitle>Main Chart</CardTitle></CardHeader>
 *       <CardContent><Chart /></CardContent>
 *     </Card>
 *   </DashboardSection.Primary>
 *
 *   <DashboardSection.Sidebar>
 *     <Card><QuickStats /></Card>
 *     <Card><Insights /></Card>
 *   </DashboardSection.Sidebar>
 * </DashboardSection>
 * ```
 *
 * @example Split primary content
 * ```tsx
 * <DashboardSection.Primary>
 *   <Card>
 *     <CardContent>
 *       <DashboardSection.Split>
 *         <DashboardSection.SplitLeft>
 *           <Chart />
 *         </DashboardSection.SplitLeft>
 *         <DashboardSection.SplitRight>
 *           <Insights />
 *         </DashboardSection.SplitRight>
 *       </DashboardSection.Split>
 *     </CardContent>
 *   </Card>
 * </DashboardSection.Primary>
 * ```
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardSectionProps {
  children: ReactNode
  className?: string
  /** Grid column distribution (e.g., "2/3 + 1/3" or "3/4 + 1/4") */
  layout?: '2-1' | '3-1' | '1-1'
}

interface ChildProps {
  children: ReactNode
  className?: string
}

/**
 * Main container for dashboard sections
 * Uses CSS Grid with responsive breakpoints
 */
export function DashboardSection({
  children,
  className,
  layout = '2-1'
}: DashboardSectionProps) {
  const layoutClasses = {
    '2-1': 'lg:grid-cols-3', // 2/3 + 1/3
    '3-1': 'lg:grid-cols-4', // 3/4 + 1/4
    '1-1': 'lg:grid-cols-2', // 1/2 + 1/2
  }

  return (
    <div className={cn(
      'grid grid-cols-1 gap-6',
      layoutClasses[layout],
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Primary content area (left side on desktop)
 * Takes 2/3 or 3/4 width depending on layout
 */
function Primary({ children, className }: ChildProps) {
  return (
    <div className={cn(
      'lg:col-span-2',
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Sidebar area (right side on desktop)
 * Takes 1/3 or 1/4 width depending on layout
 * Uses align-self: start to prevent height stretching
 */
function Sidebar({ children, className }: ChildProps) {
  return (
    <div className={cn(
      'space-y-4 lg:self-start',
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Split container for dividing primary content into two columns
 * Creates an internal grid with optional divider
 */
function Split({
  children,
  className,
  withDivider = true
}: ChildProps & { withDivider?: boolean }) {
  return (
    <div className={cn(
      'grid gap-6 lg:grid-cols-2',
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Left side of split content
 * Includes optional border divider on desktop
 */
function SplitLeft({ children, className, withBorder = true }: ChildProps & { withBorder?: boolean }) {
  return (
    <div className={cn(
      withBorder && 'lg:pr-4 lg:border-r border-gray-100',
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Right side of split content
 */
function SplitRight({ children, className }: ChildProps) {
  return (
    <div className={cn(
      'lg:pl-2',
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Full width section (spans all columns)
 * Useful for charts that need maximum horizontal space
 */
function FullWidth({ children, className }: ChildProps) {
  return (
    <div className={cn(
      'lg:col-span-full',
      className
    )}>
      {children}
    </div>
  )
}

// Attach sub-components to main component
DashboardSection.Primary = Primary
DashboardSection.Sidebar = Sidebar
DashboardSection.Split = Split
DashboardSection.SplitLeft = SplitLeft
DashboardSection.SplitRight = SplitRight
DashboardSection.FullWidth = FullWidth

/**
 * Utility component for centered content with controlled height
 * Prevents content from looking lost in tall containers
 */
export function CenteredContent({
  children,
  className,
  minHeight = 400
}: ChildProps & { minHeight?: number }) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center',
        className
      )}
      style={{ minHeight: `${minHeight}px` }}
    >
      {children}
    </div>
  )
}

/**
 * Utility component for constrained-width content
 * Prevents charts from stretching too wide
 */
export function ConstrainedWidth({
  children,
  className,
  maxWidth = '3xl'
}: ChildProps & { maxWidth?: string }) {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth as keyof typeof maxWidthClasses] || 'max-w-3xl',
      className
    )}>
      {children}
    </div>
  )
}
