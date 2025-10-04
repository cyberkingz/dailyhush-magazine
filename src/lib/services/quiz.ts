import { supabase } from '../supabase'
import type { QuizAnswer, QuizResult, QuizQuestion } from '../../types/quiz'
import type { LeadTrackingContext } from '../types/leads'
import { getCurrentTrackingContext } from './leads'
import { notifyN8nQuizCompletion } from './webhook'

export interface QuizSubmissionData {
  email: string
  answers: QuizAnswer[]
  result: QuizResult
  questions: QuizQuestion[]
  context?: Partial<LeadTrackingContext>
}

export interface QuizSubmissionResponse {
  success: boolean
  message: string
  submissionId?: string
  error?: string
}

export interface QuizSubmission {
  id: string
  email: string
  overthinker_type: string
  score: number
  result_title: string
  result_description: string
  result_insight: string
  result_cta_hook: string
  source_url?: string
  source_page?: string
  referrer_url?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  user_agent?: string
  browser?: string
  device_type?: string
  created_at: string
  updated_at: string
}

export interface QuizAnswerRecord {
  id: string
  submission_id: string
  question_id: string
  question_section: string
  question_type: string
  question_text?: string
  option_id?: string
  option_text?: string
  option_value?: number
  scale_value?: number
  multiple_option_ids?: string[]
  created_at: string
}

/**
 * Submit quiz results and answers to Supabase
 */
export async function submitQuiz(data: QuizSubmissionData): Promise<QuizSubmissionResponse> {
  try {
    // Get tracking context
    const trackingContext = data.context || getCurrentTrackingContext()

    // Prepare submission data
    const submissionData = {
      email: data.email.trim().toLowerCase(),
      overthinker_type: data.result.type,
      score: data.result.score,
      result_title: data.result.title,
      result_description: data.result.description,
      result_insight: data.result.insight,
      result_cta_hook: data.result.ctaHook,
      source_url: trackingContext.source_url,
      source_page: trackingContext.source_page || 'quiz',
      referrer_url: trackingContext.referrer_url,
      user_agent: navigator.userAgent,
      browser: trackingContext.browser_info?.browser,
      device_type: trackingContext.browser_info?.device_type,
      ...trackingContext.utm_params,
    }

    // Insert submission and get the ID back
    const { data: submission, error: submissionError } = await supabase
      .from('quiz_submissions')
      .insert([submissionData])
      .select('id')
      .single()

    if (submissionError) {
      console.error('Error creating quiz submission:', submissionError)
      return {
        success: false,
        message: 'Failed to save quiz results. Please try again.',
        error: submissionError.message,
      }
    }

    if (!submission) {
      return {
        success: false,
        message: 'Failed to save quiz results. Please try again.',
        error: 'No submission ID returned',
      }
    }

    // Prepare answers data
    console.log('📊 Preparing answers data:', {
      totalAnswers: data.answers.length,
      totalQuestions: data.questions.length,
      submissionId: submission.id,
    })

    const answersData = data.answers.map((answer) => {
      const question = data.questions.find((q) => q.id === answer.questionId)
      const option = question?.options?.find((o) => o.id === answer.optionId)

      const answerRecord = {
        submission_id: submission.id,
        question_id: answer.questionId,
        question_section: question?.section || 'unknown',
        question_type: question?.type || 'unknown',
        question_text: question?.question,
        option_id: answer.optionId,
        option_text: option?.text,
        option_value: option?.value,
        scale_value: answer.scaleValue,
        multiple_option_ids: answer.multipleOptionIds,
      }

      console.log('📝 Answer record:', answerRecord)
      return answerRecord
    })

    console.log('💾 Inserting answers to database:', answersData.length, 'answers')

    // Insert all answers
    const { error: answersError } = await supabase
      .from('quiz_answers')
      .insert(answersData)

    if (answersError) {
      console.error('❌ Error creating quiz answers:', answersError)
      console.error('❌ Answers data that failed:', answersData)
      // Note: Submission was created, but answers failed
      // This is non-critical since we have the main submission
      console.warn('⚠️ Quiz submission successful but answers failed to save')
    } else {
      console.log('✅ Quiz answers saved successfully!')
    }

    // Notify N8N webhook of quiz completion (for beehiiv tagging and automation)
    notifyN8nQuizCompletion({
      email: data.email.trim().toLowerCase(),
      overthinker_type: data.result.type,
      result_title: data.result.title,
      score: data.result.score,
      source_page: trackingContext.source_page || 'quiz',
      source_url: trackingContext.source_url,
      utm_source: trackingContext.utm_params?.utm_source,
      utm_medium: trackingContext.utm_params?.utm_medium,
      utm_campaign: trackingContext.utm_params?.utm_campaign,
      utm_term: trackingContext.utm_params?.utm_term,
      utm_content: trackingContext.utm_params?.utm_content,
      browser: trackingContext.browser_info?.browser,
      device_type: trackingContext.browser_info?.device_type,
      referrer_url: trackingContext.referrer_url,
    }).catch(webhookError => {
      console.warn('N8N quiz webhook notification failed (quiz still saved):', webhookError)
    })

    return {
      success: true,
      message: 'Quiz results saved successfully!',
      submissionId: submission.id,
    }
  } catch (error) {
    console.error('Unexpected error submitting quiz:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get all quiz submissions (for admin)
 */
export async function getQuizSubmissions(
  limit = 50,
  offset = 0
): Promise<{ submissions: QuizSubmission[]; count: number }> {
  try {
    const { data, error, count } = await supabase
      .from('quiz_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching quiz submissions:', error)
      return { submissions: [], count: 0 }
    }

    return { submissions: data || [], count: count || 0 }
  } catch (error) {
    console.error('Unexpected error fetching quiz submissions:', error)
    return { submissions: [], count: 0 }
  }
}

/**
 * Get quiz answers for a specific submission (for admin)
 */
export async function getQuizAnswers(
  submissionId: string
): Promise<QuizAnswerRecord[]> {
  try {
    const { data, error } = await supabase
      .from('quiz_answers')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching quiz answers:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching quiz answers:', error)
    return []
  }
}

/**
 * Get quiz analytics by overthinker type
 */
export async function getQuizAnalytics(days = 30) {
  try {
    const { data, error } = await supabase
      .from('quiz_analytics')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching quiz analytics:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching quiz analytics:', error)
    return []
  }
}

/**
 * Get overthinker type distribution
 */
export async function getOverthinkerTypeDistribution() {
  try {
    const { data, error } = await supabase
      .from('overthinker_type_distribution')
      .select('*')
      .order('count', { ascending: false })

    if (error) {
      console.error('Error fetching type distribution:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching type distribution:', error)
    return []
  }
}

/**
 * Get quiz submissions by overthinker type
 */
export async function getSubmissionsByType(
  overthinkerType?: string
): Promise<QuizSubmission[]> {
  try {
    let query = supabase
      .from('quiz_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (overthinkerType) {
      query = query.eq('overthinker_type', overthinkerType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching submissions by type:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching submissions by type:', error)
    return []
  }
}
