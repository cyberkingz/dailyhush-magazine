/**
 * EmailCampaignsView Component
 * Main email campaigns dashboard with sub-navigation
 */

import { useState } from 'react'
import { BarChart3, ListOrdered } from 'lucide-react'
import type { DateRange } from '../../../lib/services/trackingAnalytics'
import { CampaignOverview, SequenceAnalysis } from '../email-campaigns'
import { cn } from '../../../lib/utils'

interface EmailCampaignsViewProps {
  dateRange?: DateRange
}

type SubView = 'overview' | 'sequences'

export function EmailCampaignsView({ dateRange }: EmailCampaignsViewProps) {
  const [subView, setSubView] = useState<SubView>('overview')

  return (
    <div className="space-y-6">
      {/* Sub-tabs Navigation */}
      <div
        className="relative -mx-4 md:mx-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          className="flex gap-2 overflow-x-auto px-4 md:px-0 pb-3 snap-x snap-mandatory scroll-smooth scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <button
            onClick={(e) => {
              setSubView('overview')
              e.currentTarget.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
              })
            }}
            className={cn(
              'px-4 md:px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 snap-center',
              'flex items-center gap-2',
              subView === 'overview'
                ? 'bg-gradient-to-r from-emerald-500/60 to-emerald-600/50 backdrop-blur-[20px] text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)] border border-emerald-400/30 scale-[1.02]'
                : 'bg-white/8 backdrop-blur-[16px] text-white/70 hover:bg-white/15 hover:text-white border border-white/10 hover:border-white/20 active:scale-95'
            )}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="font-semibold">Campaign Overview</span>
          </button>

          <button
            onClick={(e) => {
              setSubView('sequences')
              e.currentTarget.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
              })
            }}
            className={cn(
              'px-4 md:px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 snap-center',
              'flex items-center gap-2',
              subView === 'sequences'
                ? 'bg-gradient-to-r from-blue-500/60 to-blue-600/50 backdrop-blur-[20px] text-white shadow-[0_4px_12px_rgba(59,130,246,0.25)] border border-blue-400/30 scale-[1.02]'
                : 'bg-white/8 backdrop-blur-[16px] text-white/70 hover:bg-white/15 hover:text-white border border-white/10 hover:border-white/20 active:scale-95'
            )}
          >
            <ListOrdered className="h-4 w-4" />
            <span className="font-semibold">Sequence Analysis</span>
          </button>
        </div>

        {/* Blur fade edges for mobile and desktop */}
        <div
          className="absolute left-0 top-0 bottom-3 w-16 pointer-events-none z-10"
          style={{
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-3 w-16 pointer-events-none z-10"
          style={{
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.8), transparent)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.8), transparent)',
          }}
        />
      </div>

      {/* View Content */}
      <div className="animate-in fade-in duration-300">
        {subView === 'overview' && <CampaignOverview dateRange={dateRange} />}
        {subView === 'sequences' && <SequenceAnalysis dateRange={dateRange} />}
      </div>
    </div>
  )
}
