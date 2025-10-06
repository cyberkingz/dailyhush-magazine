import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FunnelStep {
  label: string
  count: number
  percentage: number
  color: 'success' | 'warning' | 'error'
}

interface FunnelInsight {
  type: 'critical' | 'warning' | 'success' | 'tip'
  title: string
  message: string
  recommendation?: string
}

interface FunnelActionItemsProps {
  steps: FunnelStep[]
  className?: string
  showHeader?: boolean
}

// Benchmarks based on industry standards for quiz funnels
const BENCHMARKS = {
  startRate: { good: 60, warning: 40 },
  completionRate: { good: 70, warning: 50 },
  emailCaptureRate: { good: 85, warning: 70 },
}

function analyzeFunnel(steps: FunnelStep[]): FunnelInsight[] {
  const insights: FunnelInsight[] = []

  // Calculate drop-offs between steps
  const dropoffs = steps.slice(1).map((step, index) => ({
    stepName: step.label,
    stepIndex: index + 1,
    dropoffPercentage: ((steps[index].count - step.count) / steps[index].count) * 100,
    absoluteLoss: steps[index].count - step.count,
  }))

  // Find the biggest drop-off
  const biggestDropoff = dropoffs.reduce((max, current) =>
    current.dropoffPercentage > max.dropoffPercentage ? current : max
  , dropoffs[0])

  // Analyze start rate (Quiz Started / Page Views)
  if (steps.length >= 2) {
    const startRate = (steps[1].count / steps[0].count) * 100
    if (startRate < BENCHMARKS.startRate.warning) {
      insights.push({
        type: 'critical',
        title: 'Low Quiz Start Rate',
        message: `Only ${startRate.toFixed(1)}% of visitors start the quiz (${steps[1].count.toLocaleString()} out of ${steps[0].count.toLocaleString()})`,
        recommendation: 'Improve the quiz landing page: use stronger headlines, add social proof, or create urgency with limited-time offers.'
      })
    } else if (startRate < BENCHMARKS.startRate.good) {
      insights.push({
        type: 'warning',
        title: 'Start Rate Below Benchmark',
        message: `${startRate.toFixed(1)}% start rate is below the ${BENCHMARKS.startRate.good}% industry benchmark`,
        recommendation: 'Test different CTAs or add a preview of quiz results to increase starts.'
      })
    }
  }

  // Analyze completion rate (Completed / Started)
  if (steps.length >= 3) {
    const completionRate = (steps[2].count / steps[1].count) * 100
    if (completionRate < BENCHMARKS.completionRate.warning) {
      insights.push({
        type: 'critical',
        title: 'High Quiz Abandonment',
        message: `Only ${completionRate.toFixed(1)}% of users complete the quiz (losing ${(steps[1].count - steps[2].count).toLocaleString()} potential leads)`,
        recommendation: 'Reduce quiz length, add progress indicators, or simplify questions to improve completion.'
      })
    } else if (completionRate < BENCHMARKS.completionRate.good) {
      insights.push({
        type: 'warning',
        title: 'Completion Rate Needs Improvement',
        message: `${completionRate.toFixed(1)}% completion rate is below the ${BENCHMARKS.completionRate.good}% target`,
        recommendation: 'Review question difficulty and consider adding motivational copy between sections.'
      })
    }
  }

  // Analyze email capture rate (Emails / Completions)
  if (steps.length >= 4) {
    const emailCaptureRate = (steps[3].count / steps[2].count) * 100
    if (emailCaptureRate < BENCHMARKS.emailCaptureRate.warning) {
      insights.push({
        type: 'critical',
        title: 'Poor Email Capture',
        message: `Only ${emailCaptureRate.toFixed(1)}% provide their email (losing ${(steps[2].count - steps[3].count).toLocaleString()} leads)`,
        recommendation: 'Emphasize value of results, add privacy reassurance, or offer bonus content for email signup.'
      })
    } else if (emailCaptureRate < BENCHMARKS.emailCaptureRate.good) {
      insights.push({
        type: 'warning',
        title: 'Email Capture Below Target',
        message: `${emailCaptureRate.toFixed(1)}% email capture rate could be improved`,
        recommendation: 'Test different value propositions or reduce form friction (e.g., remove optional fields).'
      })
    }
  }

  // Add insight about biggest drop-off point
  if (biggestDropoff && biggestDropoff.dropoffPercentage > 10) {
    insights.push({
      type: 'tip',
      title: 'Focus Area Identified',
      message: `The biggest drop-off (${biggestDropoff.dropoffPercentage.toFixed(1)}%, ${biggestDropoff.absoluteLoss.toLocaleString()} users) occurs at "${biggestDropoff.stepName}"`,
      recommendation: 'Prioritize optimizing this step for maximum impact on overall conversion.'
    })
  }

  return insights
}

// Apple SF Symbols-style icons (pure SVG, 1.5px stroke)
function CircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8" cy="8" r="2.5" fill="currentColor"/>
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 7.5V11.5M8 5.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 11V12C6.5 12.8284 7.17157 13.5 8 13.5C8.82843 13.5 9.5 12.8284 9.5 12V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="7.5" r="3.25" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 2.5V3M4 4L4.35355 4.35355M2.5 7.5H3M13 7.5H13.5M11.6464 4.35355L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function FunnelActionItems({ steps, className, showHeader = true }: FunnelActionItemsProps) {
  const insights = analyzeFunnel(steps)
  const actionableInsights = insights.filter(i => i.type !== 'success')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (actionableInsights.length === 0) {
    return null
  }

  return (
    <div className={className}>
      {/* Apple HIG: Header with SF Pro typography scale */}
      {showHeader && (
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-[17px] font-semibold tracking-[-0.022em] text-[#1d1d1f]">
            Recommendations
          </h4>
          <span className="text-[13px] font-medium text-[#86868b] tabular-nums">
            {actionableInsights.length}
          </span>
        </div>
      )}

      {/* Apple HIG: Card-based layout with 8px spacing */}
      <div className="space-y-2">
        {actionableInsights.map((insight, index) => {
          const isExpanded = expandedIndex === index

          // Apple design: Use ONE accent color (SF Blue) for interactive/critical only
          const isCritical = insight.type === 'critical'
          const Icon = insight.type === 'critical' ? CircleIcon : insight.type === 'tip' ? LightbulbIcon : InfoIcon

          return (
            <div
              key={index}
              className={cn(
                // Nested glass card: subtle white tint on glass parent
                "bg-white/40 rounded-xl p-4",
                "border border-slate-200/50",
                // Lighter shadow for nested card
                "shadow-sm",
                // Apple interaction: subtle hover state
                "transition-all duration-200 ease-out",
                "hover:bg-white/60",
                "hover:shadow-md",
                "hover:-translate-y-[0.5px]"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Apple HIG: Icons at 16px, monochrome with single accent */}
                <div className={cn(
                  "mt-[1px] shrink-0",
                  // Apple blue (#007AFF) ONLY for critical items
                  isCritical ? "text-[#007AFF]" : "text-[#86868b]"
                )}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Apple HIG: SF Pro text hierarchy (17px title, 13px body) */}
                  <h5 className={cn(
                    "text-[15px] leading-[1.33] tracking-[-0.01em] text-[#1d1d1f]",
                    // Apple hierarchy: weight > color
                    isCritical ? "font-semibold" : "font-medium"
                  )}>
                    {insight.title}
                  </h5>

                  {/* Apple HIG: Secondary text in System Gray (#86868b) */}
                  <p className="mt-1 text-[13px] leading-[1.38] text-[#86868b]">
                    {insight.message}
                  </p>

                  {/* Apple HIG: Minimal disclosure pattern */}
                  {insight.recommendation && (
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className={cn(
                          // Apple button: text-only, SF Blue, 13px
                          "inline-flex items-center gap-1 group",
                          "text-[13px] font-medium text-[#007AFF]",
                          // Apple interaction: 70% opacity on hover
                          "transition-opacity duration-200 ease-out",
                          "hover:opacity-70",
                          "focus:outline-none focus-visible:opacity-70"
                        )}
                      >
                        <span>Suggestion</span>
                        <ChevronDown className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200 ease-out",
                          isExpanded && "rotate-180"
                        )} />
                      </button>

                      {/* Apple HIG: Smooth expand/collapse animation */}
                      {isExpanded && (
                        <div className={cn(
                          "mt-3 pt-3 border-t border-[#d2d2d7]",
                          // Apple animation: 200ms ease, slide from top
                          "animate-in slide-in-from-top-1 duration-200 ease-out"
                        )}>
                          <p className="text-[13px] leading-[1.5] text-[#1d1d1f]">
                            {insight.recommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
