import { supabase } from '../supabase'
import { getCurrentTrackingContext } from './leads'
import type { LeadTrackingContext } from '../types/leads'

// Session storage key
const SESSION_STORAGE_KEY = 'quiz_session_id'

// Event types
export type QuizEventType =
  | 'page_view'
  | 'quiz_start'
  | 'question_view'
  | 'question_answer'
  | 'quiz_complete'
  | 'quiz_abandon'

// Quiz session interface
export interface QuizSession {
  id: string
  session_id: string
  total_questions?: number
  last_question_index?: number
  is_completed?: boolean
  started_at?: string
  completed_at?: string
  completion_time_ms?: number
  submission_id?: string
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
  created_at?: string
  updated_at?: string
}

// Quiz event interface
export interface QuizEvent {
  id?: string
  session_id: string
  event_type: QuizEventType
  question_id?: string
  question_index?: number
  time_spent_ms?: number
  metadata?: Record<string, any>
  created_at?: string
}

/**
 * Generate or retrieve session ID from localStorage
 */
export function getOrCreateQuizSession(): string {
  try {
    // Try to get existing session from localStorage
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY)

    if (!sessionId) {
      // Generate new session ID using crypto API
      sessionId = crypto.randomUUID()
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId)
      console.log('📝 Created new quiz session:', sessionId)
    } else {
      console.log('📝 Retrieved existing quiz session:', sessionId)
    }

    return sessionId
  } catch (error) {
    console.error('Error managing quiz session:', error)
    // Fallback: generate new session ID without storing
    return crypto.randomUUID()
  }
}

/**
 * Clear session ID from localStorage
 */
function clearQuizSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    console.log('🗑️ Cleared quiz session from localStorage')
  } catch (error) {
    console.error('Error clearing quiz session:', error)
  }
}

/**
 * Track quiz page view (first load)
 */
export async function trackQuizPageView(trackingContext: LeadTrackingContext): Promise<string> {
  try {
    const sessionId = getOrCreateQuizSession()

    // Create session record
    const sessionData: Partial<QuizSession> = {
      session_id: sessionId,
      source_url: trackingContext.source_url,
      source_page: trackingContext.source_page,
      referrer_url: trackingContext.referrer_url,
      user_agent: navigator.userAgent,
      browser: trackingContext.browser_info?.browser,
      device_type: trackingContext.browser_info?.device_type,
      ...trackingContext.utm_params
    }

    const { error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert([sessionData])

    if (sessionError) {
      console.error('❌ Error creating quiz session:', sessionError)
      // Non-critical error, continue anyway
    } else {
      console.log('✅ Quiz session created:', sessionId)
    }

    // Track page view event
    const eventData: Omit<QuizEvent, 'id' | 'created_at'> = {
      session_id: sessionId,
      event_type: 'page_view',
      metadata: {
        source_page: trackingContext.source_page,
        utm_source: trackingContext.utm_params?.utm_source,
        utm_campaign: trackingContext.utm_params?.utm_campaign
      }
    }

    const { error: eventError } = await supabase
      .from('quiz_events')
      .insert([eventData])

    if (eventError) {
      console.error('❌ Error tracking page view:', eventError)
    } else {
      console.log('✅ Page view tracked for session:', sessionId)
    }

    return sessionId
  } catch (error) {
    console.error('❌ Unexpected error tracking page view:', error)
    // Return session ID anyway
    return getOrCreateQuizSession()
  }
}

/**
 * Track when user clicks "Start Quiz"
 */
export async function trackQuizStart(sessionId: string, totalQuestions: number): Promise<void> {
  try {
    const startedAt = new Date().toISOString()

    // Update session with quiz start data
    await updateQuizSession(sessionId, {
      total_questions: totalQuestions,
      started_at: startedAt
    })

    // Track quiz start event
    const eventData: Omit<QuizEvent, 'id' | 'created_at'> = {
      session_id: sessionId,
      event_type: 'quiz_start',
      metadata: {
        total_questions: totalQuestions,
        started_at: startedAt
      }
    }

    const { error } = await supabase
      .from('quiz_events')
      .insert([eventData])

    if (error) {
      console.error('❌ Error tracking quiz start:', error)
    } else {
      console.log('✅ Quiz start tracked:', sessionId)
    }
  } catch (error) {
    console.error('❌ Unexpected error tracking quiz start:', error)
  }
}

/**
 * Track when a question is viewed
 */
export async function trackQuestionView(
  sessionId: string,
  questionId: string,
  questionIndex: number
): Promise<void> {
  try {
    const eventData: Omit<QuizEvent, 'id' | 'created_at'> = {
      session_id: sessionId,
      event_type: 'question_view',
      question_id: questionId,
      question_index: questionIndex,
      metadata: {
        question_id: questionId,
        question_index: questionIndex
      }
    }

    const { error } = await supabase
      .from('quiz_events')
      .insert([eventData])

    if (error) {
      console.error('❌ Error tracking question view:', error)
    } else {
      console.log(`✅ Question view tracked: Q${questionIndex + 1} (${questionId})`)
    }
  } catch (error) {
    console.error('❌ Unexpected error tracking question view:', error)
  }
}

/**
 * Track when a question is answered (with time spent)
 */
export async function trackQuestionAnswer(
  sessionId: string,
  questionId: string,
  questionIndex: number,
  timeSpentMs: number
): Promise<void> {
  try {
    const eventData: Omit<QuizEvent, 'id' | 'created_at'> = {
      session_id: sessionId,
      event_type: 'question_answer',
      question_id: questionId,
      question_index: questionIndex,
      time_spent_ms: timeSpentMs,
      metadata: {
        question_id: questionId,
        question_index: questionIndex,
        time_spent_ms: timeSpentMs
      }
    }

    const { error } = await supabase
      .from('quiz_events')
      .insert([eventData])

    if (error) {
      console.error('❌ Error tracking question answer:', error)
    } else {
      console.log(`✅ Question answer tracked: Q${questionIndex + 1} (${timeSpentMs}ms)`)
    }
  } catch (error) {
    console.error('❌ Unexpected error tracking question answer:', error)
  }
}

/**
 * Track quiz completion
 */
export async function trackQuizComplete(
  sessionId: string,
  submissionId: string,
  completionTimeMs: number
): Promise<void> {
  try {
    const completedAt = new Date().toISOString()

    // Update session with completion data
    await updateQuizSession(sessionId, {
      is_completed: true,
      completed_at: completedAt,
      completion_time_ms: completionTimeMs,
      submission_id: submissionId
    })

    // Track completion event
    const eventData: Omit<QuizEvent, 'id' | 'created_at'> = {
      session_id: sessionId,
      event_type: 'quiz_complete',
      metadata: {
        submission_id: submissionId,
        completion_time_ms: completionTimeMs,
        completed_at: completedAt
      }
    }

    const { error } = await supabase
      .from('quiz_events')
      .insert([eventData])

    if (error) {
      console.error('❌ Error tracking quiz complete:', error)
    } else {
      console.log(`✅ Quiz completion tracked: ${completionTimeMs}ms`)
    }

    // Clear session from localStorage
    clearQuizSession()
  } catch (error) {
    console.error('❌ Unexpected error tracking quiz complete:', error)
  }
}

/**
 * Track quiz abandonment (user leaves without completing)
 */
export async function trackQuizAbandon(
  sessionId: string,
  lastQuestionIndex: number
): Promise<void> {
  try {
    // Update session with abandonment data
    await updateQuizSession(sessionId, {
      is_completed: false,
      last_question_index: lastQuestionIndex
    })

    // Track abandonment event
    const eventData: Omit<QuizEvent, 'id' | 'created_at'> = {
      session_id: sessionId,
      event_type: 'quiz_abandon',
      question_index: lastQuestionIndex,
      metadata: {
        last_question_index: lastQuestionIndex
      }
    }

    const { error } = await supabase
      .from('quiz_events')
      .insert([eventData])

    if (error) {
      console.error('❌ Error tracking quiz abandon:', error)
    } else {
      console.log(`✅ Quiz abandonment tracked at Q${lastQuestionIndex + 1}`)
    }

    // Clear session from localStorage
    clearQuizSession()
  } catch (error) {
    console.error('❌ Unexpected error tracking quiz abandon:', error)
  }
}

/**
 * Update session record with partial data
 */
async function updateQuizSession(
  sessionId: string,
  updates: Partial<QuizSession>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('quiz_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)

    if (error) {
      console.error('❌ Error updating quiz session:', error)
    }
  } catch (error) {
    console.error('❌ Unexpected error updating quiz session:', error)
  }
}
