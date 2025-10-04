import { useEffect, useState } from 'react'
import type { QuizSubmission } from '../../lib/services/quiz'
import { QuizTypeBadge } from './QuizTypeBadge'
import { QuizScoreIndicator } from './QuizScoreIndicator'
import type { OverthinkerType } from '../../types/quiz'

interface QuizSubmissionsListProps {
  submissions: QuizSubmission[]
  isLoading: boolean
  onSelectSubmission?: (submission: QuizSubmission) => void
}

export function QuizSubmissionsList({
  submissions,
  isLoading,
  onSelectSubmission,
}: QuizSubmissionsListProps) {
  const [filteredSubmissions, setFilteredSubmissions] = useState<QuizSubmission[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<OverthinkerType | 'all'>('all')

  // Initialize filtered submissions when submissions prop changes
  useEffect(() => {
    setFilteredSubmissions(submissions)
  }, [submissions])

  // Apply filters
  useEffect(() => {
    let filtered = [...submissions]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (sub) =>
          sub.email.toLowerCase().includes(query) ||
          sub.result_title.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((sub) => sub.overthinker_type === typeFilter)
    }

    setFilteredSubmissions(filtered)
  }, [submissions, searchQuery, typeFilter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by email or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Type filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as OverthinkerType | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Types</option>
              <option value="chronic-planner">Chronic Planner</option>
              <option value="research-addict">Research Addict</option>
              <option value="self-doubter">Self-Doubter</option>
              <option value="vision-hopper">Vision Hopper</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredSubmissions.length} of {submissions.length} submissions
        </div>
      </div>

      {/* Submissions list */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No submissions found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onSelectSubmission?.(submission)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{submission.email}</div>
                      {submission.utm_source && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          Source: {submission.utm_source}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <QuizTypeBadge type={submission.overthinker_type as OverthinkerType} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <QuizScoreIndicator score={submission.score} size="sm" showLabel={false} />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{submission.score}/100</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectSubmission?.(submission)
                        }}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
