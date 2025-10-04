import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { QuizQuestion } from '../components/quiz/QuizQuestion'
import { QuizProgress } from '../components/quiz/QuizProgress'
import { useQuiz } from '../hooks/useQuiz'
import { quizQuestions } from '../data/quizQuestions'
import '../styles/quiz.css'

export default function Quiz() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const autoAdvanceTimerRef = useRef<number | null>(null)

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    currentAnswer,
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

  const handleNextClick = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      // Last question - this will trigger onComplete in useQuiz
      goToNext()
    } else {
      goToNext()
    }
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
      // TODO: Backend integration
      // - Store email in Supabase
      // - Trigger n8n workflow
      // - Show SparkLoop modal

      console.log('Email captured:', email)
      console.log('Quiz result:', result.type)

      // For now, just redirect to thank you page
      // This will use the existing flow (tripwire, one-click upsell, etc.)
      navigate('/thank-you')
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
                onClick={goToPrevious}
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
