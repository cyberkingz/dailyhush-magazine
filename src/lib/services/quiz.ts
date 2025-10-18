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

// ============================================================================
// QUIZ ANALYTICS FUNCTIONS (using quiz_events and quiz_sessions tables)
// ============================================================================

export interface DateRange {
  startDate: string // ISO date string
  endDate: string   // ISO date string
}

export interface QuizFunnelMetrics {
  pageViews: number
  quizStarts: number
  quizCompletions: number
  startRate: number // percentage
  completionRate: number // percentage
}

export interface QuestionMetrics {
  questionId: string
  questionIndex: number
  views: number
  answers: number
  completions: number
  dropoffCount: number
  dropoffRate: number // percentage
  avgTimeSpent: number // seconds
  medianTimeSpent: number // seconds
}

export interface CompletionTimeMetrics {
  avgCompletionTime: number // seconds
  medianCompletionTime: number // seconds
  totalCompletions: number
}

export interface DropoffPoint {
  questionIndex: number
  dropoffCount: number
  dropoffPercentage: number
}

export interface DailyMetrics {
  date: string // YYYY-MM-DD format
  pageViews: number
  starts: number
  completions: number
  emails: number
}

/**
 * Get quiz funnel metrics (page views → starts → completions)
 */
export async function getQuizFunnelMetrics(
  dateRange?: DateRange
): Promise<QuizFunnelMetrics> {
  try {
    // Build date filter
    const startDate = dateRange?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = dateRange?.endDate || new Date().toISOString()

    // Count each event type
    const { data: pageViewData } = await supabase
      .from('quiz_events')
      .select('session_id', { count: 'exact', head: false })
      .eq('event_type', 'page_view')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    const { data: startData } = await supabase
      .from('quiz_events')
      .select('session_id', { count: 'exact', head: false })
      .eq('event_type', 'quiz_start')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    const { data: completeData } = await supabase
      .from('quiz_events')
      .select('session_id', { count: 'exact', head: false })
      .eq('event_type', 'quiz_complete')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    // Count unique sessions for each stage
    const pageViews = new Set(pageViewData?.map(d => d.session_id) || []).size
    const quizStarts = new Set(startData?.map(d => d.session_id) || []).size
    const quizCompletions = new Set(completeData?.map(d => d.session_id) || []).size

    // Calculate rates
    const startRate = pageViews > 0 ? (quizStarts / pageViews) * 100 : 0
    const completionRate = quizStarts > 0 ? (quizCompletions / quizStarts) * 100 : 0

    return {
      pageViews,
      quizStarts,
      quizCompletions,
      startRate: Math.round(startRate * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
    }
  } catch (error) {
    console.error('Error fetching quiz funnel metrics:', error)
    return {
      pageViews: 0,
      quizStarts: 0,
      quizCompletions: 0,
      startRate: 0,
      completionRate: 0,
    }
  }
}

/**
 * Get question-level metrics (views, answers, dropoff, time spent)
 */
export async function getQuestionLevelMetrics(
  dateRange?: DateRange
): Promise<QuestionMetrics[]> {
  try {
    const startDate = dateRange?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = dateRange?.endDate || new Date().toISOString()

    // Fetch all question events
    const { data: events, error } = await supabase
      .from('quiz_events')
      .select('event_type, question_id, question_index, session_id, time_spent_ms')
      .in('event_type', ['question_view', 'question_answer', 'question_complete'])
      .not('question_id', 'is', null)
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (error) {
      console.error('Error fetching question events:', error)
      return []
    }

    // Group events by question
    const questionMap = new Map<string, {
      questionId: string
      questionIndex: number
      views: Set<string>
      answers: Set<string>
      completions: Set<string>
      timeSpents: number[]
    }>()

    events?.forEach(event => {
      if (!event.question_id) return

      if (!questionMap.has(event.question_id)) {
        questionMap.set(event.question_id, {
          questionId: event.question_id,
          questionIndex: event.question_index || 0,
          views: new Set(),
          answers: new Set(),
          completions: new Set(),
          timeSpents: [],
        })
      }

      const q = questionMap.get(event.question_id)!

      if (event.event_type === 'question_view') {
        q.views.add(event.session_id)
      } else if (event.event_type === 'question_answer') {
        q.answers.add(event.session_id)
        if (event.time_spent_ms) {
          q.timeSpents.push(event.time_spent_ms)
        }
      } else if (event.event_type === 'question_complete') {
        q.completions.add(event.session_id)
      }
    })

    // Calculate metrics for each question
    const metrics: QuestionMetrics[] = Array.from(questionMap.values()).map(q => {
      const views = q.views.size
      const answers = q.answers.size
      // Use answers for completions since we track 'question_answer' not 'question_complete'
      const completions = q.answers.size
      const dropoffCount = views - completions
      const dropoffRate = views > 0 ? (dropoffCount / views) * 100 : 0

      // Calculate average time spent (in seconds)
      const avgTimeSpent = q.timeSpents.length > 0
        ? q.timeSpents.reduce((sum, t) => sum + t, 0) / q.timeSpents.length / 1000
        : 0

      // Calculate median time spent (in seconds)
      const sortedTimes = [...q.timeSpents].sort((a, b) => a - b)
      const medianTimeSpent = sortedTimes.length > 0
        ? sortedTimes[Math.floor(sortedTimes.length / 2)] / 1000
        : 0

      return {
        questionId: q.questionId,
        questionIndex: q.questionIndex,
        views,
        answers,
        completions,
        dropoffCount,
        dropoffRate: Math.round(dropoffRate * 100) / 100,
        avgTimeSpent: Math.round(avgTimeSpent * 10) / 10,
        medianTimeSpent: Math.round(medianTimeSpent * 10) / 10,
      }
    })

    // Sort by question index
    return metrics.sort((a, b) => a.questionIndex - b.questionIndex)
  } catch (error) {
    console.error('Error fetching question-level metrics:', error)
    return []
  }
}

/**
 * Get completion time metrics
 */
export async function getCompletionTimeMetrics(
  dateRange?: DateRange
): Promise<CompletionTimeMetrics> {
  try {
    const startDate = dateRange?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = dateRange?.endDate || new Date().toISOString()

    const { data: sessions, error } = await supabase
      .from('quiz_sessions')
      .select('completion_time_ms')
      .eq('is_completed', true)
      .not('completion_time_ms', 'is', null)
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (error) {
      console.error('Error fetching completion times:', error)
      return {
        avgCompletionTime: 0,
        medianCompletionTime: 0,
        totalCompletions: 0,
      }
    }

    const completionTimes = sessions?.map(s => s.completion_time_ms).filter(t => t != null) || []

    if (completionTimes.length === 0) {
      return {
        avgCompletionTime: 0,
        medianCompletionTime: 0,
        totalCompletions: 0,
      }
    }

    // Calculate average (in seconds)
    const avgCompletionTime = completionTimes.reduce((sum, t) => sum + t, 0) / completionTimes.length / 1000

    // Calculate median (in seconds)
    const sortedTimes = [...completionTimes].sort((a, b) => a - b)
    const medianCompletionTime = sortedTimes[Math.floor(sortedTimes.length / 2)] / 1000

    return {
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      medianCompletionTime: Math.round(medianCompletionTime * 10) / 10,
      totalCompletions: completionTimes.length,
    }
  } catch (error) {
    console.error('Error fetching completion time metrics:', error)
    return {
      avgCompletionTime: 0,
      medianCompletionTime: 0,
      totalCompletions: 0,
    }
  }
}

/**
 * Get dropoff analysis (where users abandon the quiz)
 */
export async function getDropoffAnalysis(
  dateRange?: DateRange
): Promise<DropoffPoint[]> {
  try {
    const startDate = dateRange?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = dateRange?.endDate || new Date().toISOString()

    // Get all abandoned sessions and their last question
    const { data: sessions, error } = await supabase
      .from('quiz_sessions')
      .select('session_id, last_question_index')
      .eq('is_completed', false)
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (error) {
      console.error('Error fetching dropoff data:', error)
      return []
    }

    // Count dropoffs by question index
    const dropoffMap = new Map<number, number>()
    sessions?.forEach(session => {
      const index = session.last_question_index || 0
      dropoffMap.set(index, (dropoffMap.get(index) || 0) + 1)
    })

    // Calculate total dropoffs
    const totalDropoffs = sessions?.length || 0

    // Convert to array and calculate percentages
    const dropoffPoints: DropoffPoint[] = Array.from(dropoffMap.entries()).map(([questionIndex, dropoffCount]) => ({
      questionIndex,
      dropoffCount,
      dropoffPercentage: totalDropoffs > 0 ? Math.round((dropoffCount / totalDropoffs) * 10000) / 100 : 0,
    }))

    // Sort by question index
    return dropoffPoints.sort((a, b) => a.questionIndex - b.questionIndex)
  } catch (error) {
    console.error('Error fetching dropoff analysis:', error)
    return []
  }
}

export interface CampaignMetrics {
  campaign: string
  campaignType: 'cold_email' | 'post_quiz_retargeting'
  utmSource?: string
  utmMedium?: string
  views: number
  starts: number
  completions: number
  startRate: number
  completionRate: number
  overallConversionRate: number
}

/**
 * Get campaign-level metrics grouped by utm_campaign
 * Distinguishes between cold email campaigns (quiz invites) and post-quiz retargeting
 */
export async function getCampaignMetrics(
  dateRange?: DateRange
): Promise<CampaignMetrics[]> {
  try {
    const startDate = dateRange?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = dateRange?.endDate || new Date().toISOString()

    // Get all quiz sessions with utm_campaign
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('session_id, utm_campaign, utm_source, utm_medium, is_completed, started_at')
      .not('utm_campaign', 'is', null)
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (sessionsError) {
      console.error('Error fetching campaign sessions:', sessionsError)
      return []
    }

    if (!sessions || sessions.length === 0) {
      return []
    }

    // Get all quiz events for these sessions
    const sessionIds = sessions.map(s => s.session_id)
    const { data: events, error: eventsError } = await supabase
      .from('quiz_events')
      .select('session_id, event_type')
      .in('session_id', sessionIds)
      .in('event_type', ['page_view', 'quiz_start', 'quiz_complete'])

    if (eventsError) {
      console.error('Error fetching campaign events:', eventsError)
      return []
    }

    // Create maps for quick lookup
    const startedSessions = new Set(
      events?.filter(e => e.event_type === 'quiz_start').map(e => e.session_id) || []
    )
    const completedSessions = new Set(
      events?.filter(e => e.event_type === 'quiz_complete').map(e => e.session_id) || []
    )

    // Group sessions by campaign
    const campaignMap = new Map<string, {
      campaign: string
      utmSource?: string
      utmMedium?: string
      views: Set<string>
      starts: Set<string>
      completions: Set<string>
    }>()

    sessions.forEach(session => {
      const campaign = session.utm_campaign!

      if (!campaignMap.has(campaign)) {
        campaignMap.set(campaign, {
          campaign,
          utmSource: session.utm_source || undefined,
          utmMedium: session.utm_medium || undefined,
          views: new Set(),
          starts: new Set(),
          completions: new Set(),
        })
      }

      const c = campaignMap.get(campaign)!
      c.views.add(session.session_id)

      if (startedSessions.has(session.session_id)) {
        c.starts.add(session.session_id)
      }

      if (completedSessions.has(session.session_id)) {
        c.completions.add(session.session_id)
      }
    })

    // Calculate metrics for each campaign
    const metrics: CampaignMetrics[] = Array.from(campaignMap.values()).map(c => {
      const views = c.views.size
      const starts = c.starts.size
      const completions = c.completions.size

      const startRate = views > 0 ? (starts / views) * 100 : 0
      const completionRate = starts > 0 ? (completions / starts) * 100 : 0
      const overallConversionRate = views > 0 ? (completions / views) * 100 : 0

      // Determine campaign type based on utm_campaign value
      const campaignType = determineCampaignType(c.campaign)

      return {
        campaign: c.campaign,
        campaignType,
        utmSource: c.utmSource,
        utmMedium: c.utmMedium,
        views,
        starts,
        completions,
        startRate: Math.round(startRate * 10) / 10,
        completionRate: Math.round(completionRate * 10) / 10,
        overallConversionRate: Math.round(overallConversionRate * 10) / 10,
      }
    })

    // Sort by views descending
    return metrics.sort((a, b) => b.views - a.views)
  } catch (error) {
    console.error('Error fetching campaign metrics:', error)
    return []
  }
}

/**
 * Determine if a campaign is cold email or post-quiz retargeting
 */
function determineCampaignType(campaign: string): 'cold_email' | 'post_quiz_retargeting' {
  // Cold email campaigns target quiz page
  const coldEmailCampaigns = [
    'quiz_invite',
    'email_2',
    'email_3',
    'email_4',
    'email_5_final',
    'email_sequence',
    'google_sheet_invite'
  ]

  // Post-quiz retargeting campaigns target product page
  const postQuizCampaigns = [
    'quiz-retargeting',
    'day-0',
    'day-1',
    'day-3',
    'day-5',
    'day-7'
  ]

  if (coldEmailCampaigns.some(c => campaign.includes(c))) {
    return 'cold_email'
  }

  if (postQuizCampaigns.some(c => campaign.includes(c))) {
    return 'post_quiz_retargeting'
  }

  // Default: if it mentions "email" or "invite", it's cold email
  if (campaign.toLowerCase().includes('email') || campaign.toLowerCase().includes('invite')) {
    return 'cold_email'
  }

  // Otherwise, assume post-quiz retargeting
  return 'post_quiz_retargeting'
}

/**
 * Get daily time series metrics for trends over time
 */
export async function getDailyTimeSeriesMetrics(
  dateRange?: DateRange
): Promise<DailyMetrics[]> {
  try {
    const startDate = dateRange?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = dateRange?.endDate || new Date().toISOString()

    // Fetch all quiz events
    const { data: events, error: eventsError } = await supabase
      .from('quiz_events')
      .select('event_type, session_id, created_at')
      .in('event_type', ['page_view', 'quiz_start', 'quiz_complete'])
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (eventsError) {
      console.error('Error fetching events for time series:', eventsError)
      return []
    }

    // Fetch quiz submissions for email count
    const { data: submissions, error: submissionsError } = await supabase
      .from('quiz_submissions')
      .select('created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (submissionsError) {
      console.error('Error fetching submissions for time series:', submissionsError)
    }

    // Group events by date
    const dailyMap = new Map<string, {
      date: string
      pageViewSessions: Set<string>
      startSessions: Set<string>
      completionSessions: Set<string>
      emails: number
    }>()

    // Process events
    events?.forEach(event => {
      const date = event.created_at.split('T')[0] // Get YYYY-MM-DD

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          pageViewSessions: new Set(),
          startSessions: new Set(),
          completionSessions: new Set(),
          emails: 0,
        })
      }

      const dayData = dailyMap.get(date)!

      if (event.event_type === 'page_view') {
        dayData.pageViewSessions.add(event.session_id)
      } else if (event.event_type === 'quiz_start') {
        dayData.startSessions.add(event.session_id)
      } else if (event.event_type === 'quiz_complete') {
        dayData.completionSessions.add(event.session_id)
      }
    })

    // Process email submissions
    submissions?.forEach(submission => {
      const date = submission.created_at.split('T')[0]

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          pageViewSessions: new Set(),
          startSessions: new Set(),
          completionSessions: new Set(),
          emails: 0,
        })
      }

      dailyMap.get(date)!.emails += 1
    })

    // Convert to array and count unique sessions
    const dailyMetrics: DailyMetrics[] = Array.from(dailyMap.values()).map(day => ({
      date: day.date,
      pageViews: day.pageViewSessions.size,
      starts: day.startSessions.size,
      completions: day.completionSessions.size,
      emails: day.emails,
    }))

    // Sort by date
    return dailyMetrics.sort((a, b) => a.date.localeCompare(b.date))
  } catch (error) {
    console.error('Error fetching daily time series metrics:', error)
    return []
  }
}
