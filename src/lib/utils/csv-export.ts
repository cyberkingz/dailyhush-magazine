import type { QuizSubmission } from '../services/quiz'
import { getQuizAnswers } from '../services/quiz'

// Escape CSV values (handle quotes and commas)
const escapeCsvValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  // If the value contains quotes, commas, or newlines, wrap in quotes and escape internal quotes
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

/**
 * Convert quiz submissions with all answers to CSV format and trigger download
 */
export async function exportQuizSubmissionsToCSV(
  submissions: QuizSubmission[],
  filename?: string
) {
  if (submissions.length === 0) {
    alert('No submissions to export')
    return
  }

  try {
    // Fetch all answers for all submissions
    console.log('Fetching answers for', submissions.length, 'submissions...')
    const submissionsWithAnswers = await Promise.all(
      submissions.map(async (submission) => {
        const answers = await getQuizAnswers(submission.id)
        return { submission, answers }
      })
    )

    // Define base CSV headers
    const baseHeaders = [
      'Email',
      'Overthinker Type',
      'Result Title',
      'Score',
      'Submission Date',
      'Source Page',
      'Source URL',
      'Referrer URL',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'UTM Term',
      'UTM Content',
      'Device Type',
      'Browser',
    ]

    // Add question headers (assuming 13 questions)
    const questionHeaders: string[] = []
    for (let i = 1; i <= 13; i++) {
      questionHeaders.push(`Q${i} - Question`)
      questionHeaders.push(`Q${i} - Answer`)
      questionHeaders.push(`Q${i} - Value`)
    }

    const headers = [...baseHeaders, ...questionHeaders]

    // Convert submissions to CSV rows
    const rows = submissionsWithAnswers.map(({ submission, answers }) => {
      // Base submission data
      const baseData = [
        submission.email,
        submission.overthinker_type,
        submission.result_title,
        submission.score,
        new Date(submission.created_at).toLocaleString(),
        submission.source_page || '',
        submission.source_url || '',
        submission.referrer_url || '',
        submission.utm_source || '',
        submission.utm_medium || '',
        submission.utm_campaign || '',
        submission.utm_term || '',
        submission.utm_content || '',
        submission.device_type || '',
        submission.browser || '',
      ]

      // Sort answers by question_id to ensure consistent ordering
      const sortedAnswers = [...answers].sort((a, b) => {
        const aNum = parseInt(a.question_id.replace('q', ''))
        const bNum = parseInt(b.question_id.replace('q', ''))
        return aNum - bNum
      })

      // Add answer data for each question
      const answerData: (string | number)[] = []
      for (let i = 1; i <= 13; i++) {
        const questionId = `q${i}`
        const answer = sortedAnswers.find((a) => a.question_id === questionId)

        if (answer) {
          answerData.push(answer.question_text || '')
          answerData.push(answer.option_text || answer.scale_value || '')
          answerData.push(answer.option_value !== null && answer.option_value !== undefined ? answer.option_value : '')
        } else {
          answerData.push('')
          answerData.push('')
          answerData.push('')
        }
      }

      return [...baseData, ...answerData]
    })

    // Build CSV content
    const csvContent = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map((row) => row.map(escapeCsvValue).join(',')),
    ].join('\n')

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    const defaultFilename = `quiz-submissions-detailed-${new Date().toISOString().split('T')[0]}.csv`

    link.setAttribute('href', url)
    link.setAttribute('download', filename || defaultFilename)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    URL.revokeObjectURL(url)

    console.log('✅ CSV export completed successfully!')
  } catch (error) {
    console.error('Error exporting CSV:', error)
    alert('Failed to export CSV. Please try again.')
  }
}
