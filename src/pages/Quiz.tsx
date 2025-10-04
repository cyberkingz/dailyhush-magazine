import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { QuizQuestion } from '../components/quiz/QuizQuestion'
import { QuizProgress } from '../components/quiz/QuizProgress'
import { useQuiz } from '../hooks/useQuiz'
import { quizQuestions } from '../data/quizQuestions'
import { submitQuiz } from '../lib/services/quiz'
import { getCurrentTrackingContext } from '../lib/services/leads'
import { supabase } from '../lib/supabase'
import '../styles/quiz.css'

declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: Record<string, any>) => void
  }
}

export default function Quiz() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [waitingForSparkLoop, setWaitingForSparkLoop] = useState(false)
  const autoAdvanceTimerRef = useRef<number | null>(null)
  const skipAutoAdvanceRef = useRef(false)
  const emailForRedirect = useRef('')
  const quizResultForRedirect = useRef<{ type: string; score: number } | null>(null)

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    currentAnswer,
    answers,
    canGoNext,
    canGoPrevious,
    // `isComplete` available but not currently used in the UI flow
    result,
    handleAnswer,
    goToNext,
    goToPrevious,
  } = useQuiz({
    questions: quizQuestions,
    onComplete: () => {
      // Quiz complete, show email capture
      setShowEmailCapture(true)
    },
  })

  // Auto-advance to next question after 300ms delay
  // Only for single and scale questions (not multiple choice)
  useEffect(() => {
    // Clear any existing timer
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current)
      autoAdvanceTimerRef.current = null
    }

    // Skip auto-advance if user just clicked back button
    if (skipAutoAdvanceRef.current) {
      skipAutoAdvanceRef.current = false
      return
    }

    // Only auto-advance if:
    // 1. Question is answered
    // 2. Question type is 'single' or 'scale' (not 'multiple')
    if (
      currentAnswer &&
      (currentQuestion.type === 'single' || currentQuestion.type === 'scale')
    ) {
      autoAdvanceTimerRef.current = window.setTimeout(() => {
        goToNext()
      }, 500)
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current)
      }
    }
  }, [currentAnswer, currentQuestion.type, goToNext])

  // SparkLoop modal watcher - handles redirect after modal closes
  useEffect(() => {
    if (!waitingForSparkLoop) return

    let modalDetected = false
    let hasRedirected = false

    const redirectNow = () => {
      if (hasRedirected) return
      hasRedirected = true
      console.log('🚀 Redirecting to thank you page...')

      // Build thank you URL with quiz params
      if (quizResultForRedirect.current) {
        const thankYouUrl = `/subscriptions/thank-you?email=${encodeURIComponent(emailForRedirect.current)}&type=${quizResultForRedirect.current.type}&score=${quizResultForRedirect.current.score}`
        window.location.assign(thankYouUrl)
      }
    }

    // MutationObserver detects DOM changes instantly
    const observer = new MutationObserver(() => {
      // Check if modal is visible (not just present in DOM)
      const sparkloopEl = document.querySelector('[id*="sparkloop"]') as HTMLElement
      const upscribeEl = document.querySelector('[class*="upscribe"]') as HTMLElement
      const iframe = document.querySelector('iframe[src*="sparkloop"]') as HTMLElement
      const bodyHasModalClass = document.body.classList.contains('sl-modal-open')

      // Modal is "visible" if element exists AND is displayed OR body has modal class
      const modalVisible = bodyHasModalClass ||
                          !!(sparkloopEl && sparkloopEl.offsetParent !== null) ||
                          !!(upscribeEl && upscribeEl.offsetParent !== null) ||
                          !!(iframe && iframe.offsetParent !== null)

      console.log('🔍 Modal check:', {
        modalVisible,
        modalDetected,
        bodyHasModalClass,
        sparkloopVisible: sparkloopEl ? sparkloopEl.offsetParent !== null : false,
        upscribeVisible: upscribeEl ? upscribeEl.offsetParent !== null : false,
        iframeVisible: iframe ? iframe.offsetParent !== null : false
      })

      if (modalVisible && !modalDetected) {
        modalDetected = true
        console.log('✅ SparkLoop modal OPENED - detected!')
        // Cancel early redirect since modal appeared
        clearTimeout(earlyRedirectTimeout)
      } else if (!modalVisible && modalDetected) {
        // Modal closed (hidden) - redirect instantly
        console.log('❌ SparkLoop modal CLOSED - detected! Redirecting...')
        observer.disconnect()
        clearTimeout(earlyRedirectTimeout)
        clearTimeout(fallbackTimeout)
        redirectNow()
      }
    })

    // Watch entire document for changes (structure AND attributes)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,      // Watch for attribute changes (class, style)
      attributeFilter: ['class', 'style', 'hidden']  // Only watch relevant attributes
    })

    // Early redirect: if modal doesn't appear within 5 seconds, redirect anyway
    // This handles cases where SparkLoop doesn't load (IP location, ad blocker, etc.)
    const earlyRedirectTimeout = setTimeout(() => {
      if (!modalDetected) {
        observer.disconnect()
        console.log('⚠️ SparkLoop modal did not appear after 5s (blocked/restricted?) - redirecting now')
        clearTimeout(fallbackTimeout)
        redirectNow()
      }
    }, 5000)

    // Fallback: redirect after 30 seconds (safety net if something unexpected happens)
    const fallbackTimeout = setTimeout(() => {
      observer.disconnect()
      console.log('⏱️ Fallback timeout reached (30s) - redirecting now')
      clearTimeout(earlyRedirectTimeout)
      redirectNow()
    }, 30000)

    return () => {
      observer.disconnect()
      clearTimeout(earlyRedirectTimeout)
      clearTimeout(fallbackTimeout)
    }
  }, [waitingForSparkLoop])

  const handleNextClick = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      // Last question - this will trigger onComplete in useQuiz
      goToNext()
    } else {
      goToNext()
    }
  }

  const handleBackClick = () => {
    // Set flag to prevent auto-advance after going back
    skipAutoAdvanceRef.current = true
    goToPrevious()
  }

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value && emailError) {
      // Clear error on typing if there was an error
      validateEmail(value)
    }
  }

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!result) return

    // Validate email before submitting
    if (!validateEmail(email)) {
      return
    }

    setIsSubmittingEmail(true)

    try {
      // Log what we're submitting
      console.log('🎯 Submitting quiz:', {
        email,
        answersCount: answers.length,
        resultType: result.type,
        resultScore: result.score,
      })
      console.log('📋 All answers:', answers)
      console.log('🏆 Result:', result)

      // Submit quiz results to Supabase
      const quizResponse = await submitQuiz({
        email,
        answers,
        result,
        questions: quizQuestions,
      })

      if (!quizResponse.success) {
        console.error('Quiz submission failed:', quizResponse.error)
        // Continue anyway - user still gets their results
      }

      // Get tracking context for both leads table and n8n
      const trackingContext = getCurrentTrackingContext()

      // Save email to leads table for tracking (without triggering webhook to avoid duplicates)
      const { error: leadError } = await supabase
        .from('leads')
        .insert([{
          email: email.trim().toLowerCase(),
          source_page: 'quiz',
          source_url: trackingContext.source_url,
          referrer_url: trackingContext.referrer_url,
          user_agent: navigator.userAgent,
          browser: trackingContext.browser_info?.browser,
          device_type: trackingContext.browser_info?.device_type,
          utm_source: trackingContext.utm_params?.utm_source,
          utm_medium: trackingContext.utm_params?.utm_medium,
          utm_campaign: trackingContext.utm_params?.utm_campaign,
          utm_term: trackingContext.utm_params?.utm_term,
          utm_content: trackingContext.utm_params?.utm_content
        }])

      if (leadError && leadError.code !== '23505') {
        // Ignore duplicate email errors (23505), log others
        console.error('Lead table insert failed:', leadError)
      }

      // Fire Facebook Pixel Lead event
      if (window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'Overthinker Quiz Completion',
          content_category: result.type,
          value: 0,
          currency: 'USD'
        })
        console.log('🎯 Facebook Pixel Lead event fired:', result.type)
      }

      console.log('Email captured:', email)
      console.log('Quiz result:', result.type)
      console.log('Quiz submission ID:', quizResponse.submissionId)

      // Store email and quiz result in refs for redirect
      emailForRedirect.current = email
      quizResultForRedirect.current = { type: result.type, score: result.score }

      // Start watching for SparkLoop modal to close
      // The watcher will handle redirect with all quiz params
      setWaitingForSparkLoop(true)
    } catch (error) {
      console.error('Error submitting email:', error)
      setIsSubmittingEmail(false)
    }
  }

  const getSectionName = (section: string) => {
    const sections: Record<string, string> = {
      mental: 'Mental Loops',
      action: 'Action Tendencies',
      emotional: 'Emotional Drivers',
      habits: 'Everyday Habits',
      reflection: 'Final Self-Reflection',
    }
    return sections[section] || section
  }

  if (!hasStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-intro">
          <h1 className="quiz-intro__title">
            What's Your Overthinkaolic Type?
          </h1>
          <p className="quiz-intro__subtitle">
            Take the 48h Action Diagnostic
          </p>
          <p className="quiz-intro__description">
            Discover which overthinking pattern is keeping you stuck — and get
            your personalized 48h action plan to finally ship.
          </p>
          <div className="quiz-intro__stats">
            <span>⏱️ Takes 60 seconds</span>
            <span>📊 {totalQuestions} questions</span>
            <span>🎯 Personalized results</span>
          </div>
          <button
            className="quiz-intro__cta"
            onClick={() => setHasStarted(true)}
          >
            Start the Diagnostic →
          </button>
        </div>
      </div>
    )
  }

  if (showEmailCapture && result) {
    return (
      <div className="quiz-container">
        <div className="quiz-email-capture">
          <div className="quiz-email-capture__icon">🎯</div>
          <h2 className="quiz-email-capture__title">
            Your Results Are Being Generated...
          </h2>
          <p className="quiz-email-capture__subtitle">
            You're a <strong>{result.title}</strong>
          </p>
          <p className="quiz-email-capture__description">
            <strong>Enter your email to see your full results:</strong>
          </p>

          <div className="quiz-email-capture__benefits">
            <ul>
              <li>✓ Your complete Overthinkaolic profile</li>
              <li>✓ What makes you tick (and stuck)</li>
              <li>✓ Your personalized breakthrough plan</li>
            </ul>
          </div>

          <form
            onSubmit={handleEmailSubmit}
            className="quiz-email-capture__form"
          >
            <div className="quiz-email-capture__input-wrapper">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="your@email.com"
                className={`quiz-email-capture__input ${emailError ? 'quiz-email-capture__input--error' : ''} ${email && !emailError ? 'quiz-email-capture__input--valid' : ''}`}
                disabled={isSubmittingEmail}
                autoComplete="email"
                aria-label="Email address"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                inputMode="email"
              />
              {emailError && (
                <p id="email-error" className="quiz-email-capture__error" role="alert">
                  ⚠️ {emailError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!email || isSubmittingEmail}
              className={`quiz-email-capture__button ${isSubmittingEmail ? 'quiz-email-capture__button--loading' : ''}`}
            >
              {isSubmittingEmail
                ? 'Generating your results...'
                : 'See My Results →'}
            </button>
          </form>

          <p className="quiz-email-capture__social-proof">
            <span className="quiz-email-capture__avatars">👥</span>
            Join 12,487+ overthinkers who finally shipped
          </p>

          <p className="quiz-email-capture__privacy">
            🔒 Your data is safe. We'll send you your results + our best
            shipping strategies.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <QuizProgress
        current={currentQuestionIndex + 1}
        total={totalQuestions}
        section={getSectionName(currentQuestion.section)}
      />

      <div className="quiz-content">
        <QuizQuestion
          key={currentQuestionIndex}
          question={currentQuestion}
          answer={currentAnswer}
          onAnswer={handleAnswer}
        />

        {/* Show back button for all questions, Next button only for multiple choice */}
        {(canGoPrevious || currentQuestion.type === 'multiple') && (
          <div className="quiz-navigation">
            {canGoPrevious && (
              <button
                className="quiz-navigation__button quiz-navigation__button--back"
                onClick={handleBackClick}
                aria-label="Go to previous question"
              >
                ← Back
              </button>
            )}
            {currentQuestion.type === 'multiple' && (
              <button
                className="quiz-navigation__button quiz-navigation__button--next"
                onClick={handleNextClick}
                disabled={!canGoNext}
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
