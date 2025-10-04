import { useEffect, useState } from 'react'
import { getQuizAnswers } from '../../lib/services/quiz'
import type { QuizSubmission, QuizAnswerRecord } from '../../lib/services/quiz'
import { QuizTypeBadge } from './QuizTypeBadge'
import { QuizScoreIndicator } from './QuizScoreIndicator'
import type { OverthinkerType } from '../../types/quiz'

interface QuizSubmissionDetailProps {
  submission: QuizSubmission | null
  isOpen: boolean
  onClose: () => void
}

export function QuizSubmissionDetail({
  submission,
  isOpen,
  onClose,
}: QuizSubmissionDetailProps) {
  const [answers, setAnswers] = useState<QuizAnswerRecord[]>([])
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false)

  useEffect(() => {
    if (submission && isOpen) {
      loadAnswers()
    }
  }, [submission, isOpen])

  async function loadAnswers() {
    if (!submission) return

    setIsLoadingAnswers(true)
    try {
      const data = await getQuizAnswers(submission.id)
      setAnswers(data)
    } catch (error) {
      console.error('Error loading quiz answers:', error)
    } finally {
      setIsLoadingAnswers(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  // Group answers by section
  const groupedAnswers = answers.reduce((acc, answer) => {
    const section = answer.question_section || 'other'
    if (!acc[section]) {
      acc[section] = []
    }
    acc[section].push(answer)
    return acc
  }, {} as Record<string, QuizAnswerRecord[]>)

  const sectionNames: Record<string, string> = {
    mental: 'Mental Loops',
    action: 'Action Tendencies',
    emotional: 'Emotional Drivers',
    habits: 'Everyday Habits',
    reflection: 'Final Self-Reflection',
  }

  if (!isOpen || !submission) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-2xl w-full bg-white shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Quiz Submission Details</h2>
            <p className="text-sm text-gray-500 mt-0.5">{submission.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Overview section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-amber-700 mb-2">Result Type</p>
                  <QuizTypeBadge type={submission.overthinker_type as OverthinkerType} size="lg" />
                </div>

                <div>
                  <p className="text-sm font-medium text-amber-700 mb-1">Result Title</p>
                  <p className="text-lg font-bold text-gray-900">{submission.result_title}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-amber-700 mb-2">Score</p>
                  <QuizScoreIndicator score={submission.score} size="lg" />
                </div>
              </div>

              <div className="text-4xl">🎯</div>
            </div>
          </div>

          {/* Result details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Result Details</h3>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-700">{submission.result_description}</p>
              </div>

              {submission.result_insight && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Insight
                  </p>
                  <p className="text-sm text-gray-700 italic">{submission.result_insight}</p>
                </div>
              )}

              {submission.result_cta_hook && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    CTA Hook
                  </p>
                  <p className="text-sm text-gray-700 font-medium">{submission.result_cta_hook}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tracking information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tracking Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Submission Date
                </p>
                <p className="text-sm text-gray-900">{formatDate(submission.created_at)}</p>
              </div>

              {submission.source_page && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Source Page
                  </p>
                  <p className="text-sm text-gray-900">{submission.source_page}</p>
                </div>
              )}

              {submission.utm_source && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    UTM Source
                  </p>
                  <p className="text-sm text-gray-900">{submission.utm_source}</p>
                </div>
              )}

              {submission.utm_campaign && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    UTM Campaign
                  </p>
                  <p className="text-sm text-gray-900">{submission.utm_campaign}</p>
                </div>
              )}

              {submission.device_type && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Device
                  </p>
                  <p className="text-sm text-gray-900">{submission.device_type}</p>
                </div>
              )}

              {submission.browser && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Browser
                  </p>
                  <p className="text-sm text-gray-900">{submission.browser}</p>
                </div>
              )}
            </div>
          </div>

          {/* Answers section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quiz Answers</h3>

            {isLoadingAnswers ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="animate-pulse">Loading answers...</div>
              </div>
            ) : Object.keys(groupedAnswers).length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                No answers found
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedAnswers).map(([section, sectionAnswers]) => (
                  <div key={section} className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      {sectionNames[section] || section}
                    </h4>

                    <div className="space-y-3">
                      {sectionAnswers.map((answer, idx) => (
                        <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            {idx + 1}. {answer.question_text}
                          </p>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                              {answer.option_text || `Value: ${answer.scale_value}`}
                            </span>
                            {answer.option_value !== null && answer.option_value !== undefined && (
                              <span className="text-xs text-gray-500">
                                (Weight: {answer.option_value})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
