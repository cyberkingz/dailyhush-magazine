import { useState } from 'react'
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
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

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

  const handleNextClick = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      // Last question - this will trigger onComplete in useQuiz
      goToNext()
    } else {
      goToNext()
    }
  }

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !result) return

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
      cognitive: 'Mental Patterns',
      action: 'Action Tendencies',
      emotional: 'Emotional Drivers',
      behavioral: 'Behavioral Habits',
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
          <div className="quiz-email-capture__icon">🧠</div>
          <h2 className="quiz-email-capture__title">
            Your Overthinkaolic profile is being generated…
          </h2>
          <p className="quiz-email-capture__subtitle">
            You're a <strong>{result.title}</strong>
          </p>
          <p className="quiz-email-capture__description">
            Enter your email below to see your complete diagnosis and get your
            personalized 48h action plan.
          </p>

          <form
            onSubmit={handleEmailSubmit}
            className="quiz-email-capture__form"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="quiz-email-capture__input"
              disabled={isSubmittingEmail}
            />
            <button
              type="submit"
              disabled={!email || isSubmittingEmail}
              className="quiz-email-capture__button"
            >
              {isSubmittingEmail
                ? 'Generating your results...'
                : 'See My Results →'}
            </button>
          </form>

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
          question={currentQuestion}
          answer={currentAnswer}
          onAnswer={handleAnswer}
        />

        <div className="quiz-navigation">
          {canGoPrevious && (
            <button
              className="quiz-navigation__button quiz-navigation__button--back"
              onClick={goToPrevious}
            >
              ← Back
            </button>
          )}
          <button
            className="quiz-navigation__button quiz-navigation__button--next"
            onClick={handleNextClick}
            disabled={!canGoNext}
          >
            {currentQuestionIndex === totalQuestions - 1
              ? 'See My Results →'
              : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
