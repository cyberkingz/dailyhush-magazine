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
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-[2px] z-40 transition-opacity !m-0"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-2xl w-full bg-emerald-500/35 backdrop-blur-[48px] backdrop-saturate-[140%] border-l border-emerald-500/25 shadow-[0_16px_32px_-8px_rgba(16,185,129,0.15),0_24px_48px_-12px_rgba(16,185,129,0.20),0_1px_0_0_rgba(255,255,255,0.12)_inset] z-50 overflow-y-auto !m-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-emerald-950/90 backdrop-blur-[16px] border-b border-emerald-500/25 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Quiz Submission Details</h2>
            <p className="text-sm text-emerald-100/80 mt-0.5">{submission.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100/60 hover:text-white text-2xl font-light transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Overview section */}
          <div className="bg-emerald-900/40 backdrop-blur-[8px] rounded-[12px] p-6 border border-emerald-500/20 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-emerald-200 mb-2">Result Type</p>
                  <QuizTypeBadge type={submission.overthinker_type as OverthinkerType} size="lg" />
                </div>

                <div>
                  <p className="text-sm font-medium text-emerald-200 mb-1">Result Title</p>
                  <p className="text-lg font-bold text-white">{submission.result_title}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-emerald-200 mb-2">Score</p>
                  <QuizScoreIndicator score={submission.score} size="lg" />
                </div>
              </div>

              <div className="text-4xl">🎯</div>
            </div>
          </div>

          {/* Result details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Result Details</h3>

            <div className="bg-emerald-900/30 backdrop-blur-[8px] rounded-[12px] border border-emerald-500/20 shadow-sm p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-emerald-200 uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-sm text-emerald-50">{submission.result_description}</p>
              </div>

              {submission.result_insight && (
                <div>
                  <p className="text-xs font-medium text-emerald-200 uppercase tracking-wide mb-1">
                    Insight
                  </p>
                  <p className="text-sm text-emerald-50 italic">{submission.result_insight}</p>
                </div>
              )}

              {submission.result_cta_hook && (
                <div>
                  <p className="text-xs font-medium text-emerald-200 uppercase tracking-wide mb-1">
                    CTA Hook
                  </p>
                  <p className="text-sm text-white font-medium">{submission.result_cta_hook}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tracking information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Tracking Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-900/30 backdrop-blur-[8px] rounded-[10px] p-3 border border-emerald-500/20 shadow-sm">
                <p className="text-xs font-medium text-emerald-200 uppercase tracking-wide mb-1">
                  Submission Date
                </p>
                <p className="text-sm text-white">{formatDate(submission.created_at)}</p>
              </div>

              {submission.source_page && (
                <div className="bg-emerald-900/30 backdrop-blur-[8px] rounded-[10px] p-3 border border-emerald-500/20 shadow-sm">
                  <p className="text-xs font-medium text-emerald-200 uppercase tracking-wide mb-1">
                    Source Page
                  </p>
                  <p className="text-sm text-white">{submission.source_page}</p>
                </div>
              )}

              {submission.utm_source && (
                <div className="bg-emerald-900/30 backdrop-blur-[8px] rounded-[10px] p-3 border border-emerald-500/20 shadow-sm">
                  <p className="text-xs font-medium text-emerald-200 uppercase tracking-wide mb-1">
                    UTM Source
                  </p>
                  <p className="text-sm text-white">{submission.utm_source}</p>
                </div>
              )}

              {submission.utm_campaign && (
                <div className="bg-emerald-900/30 backdrop-blur-[8px] rounded-[10px] p-3 border border-emerald-500/20 shadow-sm">
                  <p className="text-xs font-medium text-emerald-200 uppercase tracking-wide mb-1">
                    UTM Campaign
                  </p>
                  <p className="text-sm text-white">{submission.utm_campaign}</p>
                </div>
              )}

              {submission.device_type && (
                <div className="bg-emerald-900/30 backdrop-blur-[8px] rounded-[10px] p-3 border border-emerald-500/20 shadow-sm">
                  <p className="text-xs font-medium text-emerald-200 uppercase tracking-wide mb-1">
                    Device
                  </p>
                  <p className="text-sm text-white">{submission.device_type}</p>
                </div>
              )}

              {submission.browser && (
                <div className="bg-emerald-900/30 backdrop-blur-[8px] rounded-[10px] p-3 border border-emerald-500/20 shadow-sm">
                  <p className="text-xs font-medium text-emerald-200 uppercase tracking-wide mb-1">
                    Browser
                  </p>
                  <p className="text-sm text-white">{submission.browser}</p>
                </div>
              )}
            </div>
          </div>

          {/* Answers section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quiz Answers</h3>

            {isLoadingAnswers ? (
              <div className="bg-emerald-900/30 backdrop-blur-[8px] rounded-[10px] p-8 text-center border border-emerald-500/20 shadow-sm">
                <div className="animate-pulse text-emerald-200">Loading answers...</div>
              </div>
            ) : Object.keys(groupedAnswers).length === 0 ? (
              <div className="bg-emerald-900/30 backdrop-blur-[8px] rounded-[10px] p-8 text-center text-emerald-200/70 border border-emerald-500/20 shadow-sm">
                No answers found
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedAnswers).map(([section, sectionAnswers]) => (
                  <div key={section} className="space-y-3">
                    <h4 className="text-sm font-semibold text-emerald-200 uppercase tracking-wide">
                      {sectionNames[section] || section}
                    </h4>

                    <div className="space-y-3">
                      {sectionAnswers.map((answer, idx) => (
                        <div key={answer.id} className="bg-emerald-900/30 backdrop-blur-[8px] rounded-[10px] p-4 border border-emerald-500/20 shadow-sm">
                          <p className="text-sm font-medium text-white mb-2">
                            {idx + 1}. {answer.question_text}
                          </p>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-200 border border-amber-500/30">
                              {answer.option_text || `Value: ${answer.scale_value}`}
                            </span>
                            {answer.option_value !== null && answer.option_value !== undefined && (
                              <span className="text-xs text-emerald-200/70">
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
