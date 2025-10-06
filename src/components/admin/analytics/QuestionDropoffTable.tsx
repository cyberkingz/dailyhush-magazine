import { useState } from 'react'
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react'

interface QuestionData {
  id: string
  question: string
  section: string
  views: number
  completions: number
  dropoffRate: number
  avgTimeSpent: number
  answers?: {
    text: string
    count: number
    percentage: number
  }[]
}

interface QuestionDropoffTableProps {
  data: QuestionData[]
  className?: string
}

type SortField = 'dropoffRate' | 'views' | 'avgTimeSpent'
type SortDirection = 'asc' | 'desc'

export function QuestionDropoffTable({ data, className = '' }: QuestionDropoffTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>('dropoffRate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1
    return (a[sortField] - b[sortField]) * multiplier
  })

  const getDropoffColor = (rate: number) => {
    if (rate < 10) return 'text-green-600 bg-green-50'
    if (rate < 25) return 'text-amber-600 bg-amber-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                {/* Expand icon column */}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('views')}
              >
                <div className="flex items-center gap-1">
                  Views
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('dropoffRate')}
              >
                <div className="flex items-center gap-1">
                  Drop-off
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('avgTimeSpent')}
              >
                <div className="flex items-center gap-1">
                  Avg. Time
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row) => {
              const isExpanded = expandedRows.has(row.id)
              return (
                <>
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleRow(row.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.answers && (
                        isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2">
                        {row.question}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{row.section}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{row.views.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDropoffColor(row.dropoffRate)}`}>
                        {row.dropoffRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{row.avgTimeSpent}s</span>
                    </td>
                  </tr>
                  {isExpanded && row.answers && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-gray-700 mb-3">
                            Answer Distribution
                          </div>
                          {row.answers.map((answer, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="text-sm text-gray-700 mb-1">{answer.text}</div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-amber-500 h-2 rounded-full"
                                    style={{ width: `${answer.percentage}%` }}
                                  />
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-600 min-w-[80px] text-right">
                                {answer.count} ({answer.percentage}%)
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
