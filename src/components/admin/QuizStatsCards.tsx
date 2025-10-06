import { useEffect, useState } from 'react'
import { getOverthinkerTypeDistribution } from '../../lib/services/quiz'
import { QuizTypeBadge } from './QuizTypeBadge'
import type { OverthinkerType } from '../../types/quiz'

interface TypeDistribution {
  overthinker_type: OverthinkerType
  result_title: string
  count: number
  percentage: number
}

export function QuizStatsCards() {
  const [typeDistribution, setTypeDistribution] = useState<TypeDistribution[]>([])
  const [totalSubmissions, setTotalSubmissions] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const distribution = await getOverthinkerTypeDistribution()
        setTypeDistribution(distribution as TypeDistribution[])

        // Calculate total submissions
        const total = distribution.reduce((sum, item) => sum + (item.count || 0), 0)
        setTotalSubmissions(total)
      } catch (error) {
        console.error('Error loading quiz stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-6 animate-pulse">
            <div className="h-4 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-[8px] w-1/2 mb-4"></div>
            <div className="h-8 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-[8px] w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Total submissions card */}
      <div className="bg-amber-500/20 backdrop-blur-[24px] backdrop-saturate-[140%] rounded-[16px] border border-amber-500/30 shadow-[0_4px_12px_rgba(245,158,11,0.12),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-300">Total Quiz Completions</p>
            <p className="text-3xl font-bold text-white mt-1">{totalSubmissions.toLocaleString()}</p>
          </div>
          <div className="text-4xl">📊</div>
        </div>
      </div>

      {/* Type distribution cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {typeDistribution.map((item) => (
          <div
            key={item.overthinker_type}
            className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-6 hover:shadow-[0_12px_20px_-4px_rgba(31,45,61,0.12),0_20px_36px_-8px_rgba(31,45,61,0.16)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex flex-col gap-3">
              <QuizTypeBadge type={item.overthinker_type} size="sm" />

              <div>
                <p className="text-2xl font-bold text-white">{item.count}</p>
                <p className="text-sm text-white/70 mt-0.5">
                  {item.percentage}% of total
                </p>
              </div>

              {/* Visual bar */}
              <div className="w-full bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[8px] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500 shadow-[0_1px_3px_rgba(245,158,11,0.3)]"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {typeDistribution.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70">No quiz submissions yet</p>
          <p className="text-sm text-white/50 mt-1">Stats will appear once users complete the quiz</p>
        </div>
      )}
    </div>
  )
}
