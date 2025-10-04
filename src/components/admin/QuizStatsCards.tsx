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
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Total submissions card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-700">Total Quiz Completions</p>
            <p className="text-3xl font-bold text-amber-900 mt-1">{totalSubmissions.toLocaleString()}</p>
          </div>
          <div className="text-4xl">📊</div>
        </div>
      </div>

      {/* Type distribution cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {typeDistribution.map((item) => (
          <div
            key={item.overthinker_type}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-3">
              <QuizTypeBadge type={item.overthinker_type} size="sm" />

              <div>
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {item.percentage}% of total
                </p>
              </div>

              {/* Visual bar */}
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
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
          <p className="text-gray-500">No quiz submissions yet</p>
          <p className="text-sm text-gray-400 mt-1">Stats will appear once users complete the quiz</p>
        </div>
      )}
    </div>
  )
}
