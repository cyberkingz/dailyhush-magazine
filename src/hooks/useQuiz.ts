import { useState, useCallback } from 'react'
import type {
  QuizQuestion,
  QuizAnswer,
  QuizState,
  QuizResult,
  OverthinkerType,
} from '../types/quiz'

interface UseQuizOptions {
  questions: QuizQuestion[]
  onComplete?: (result: QuizResult) => void
}

export function useQuiz({ questions, onComplete }: UseQuizOptions) {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    isComplete: false,
  })

  const currentQuestion = questions[state.currentQuestion]
  const currentAnswer = state.answers.find(
    (a) => a.questionId === currentQuestion?.id
  )

  const handleAnswer = useCallback(
    (answer: QuizAnswer) => {
      setState((prev) => {
        const existingIndex = prev.answers.findIndex(
          (a) => a.questionId === answer.questionId
        )

        const newAnswers =
          existingIndex >= 0
            ? prev.answers.map((a, i) => (i === existingIndex ? answer : a))
            : [...prev.answers, answer]

        return {
          ...prev,
          answers: newAnswers,
        }
      })
    },
    []
  )

  const goToNext = useCallback(() => {
    setState((prev) => {
      const isLastQuestion = prev.currentQuestion === questions.length - 1

      if (isLastQuestion) {
        const result = calculateResult(prev.answers, questions)
        onComplete?.(result)
        return {
          ...prev,
          isComplete: true,
          result,
        }
      }

      return {
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }
    })
  }, [questions, onComplete])

  const goToPrevious = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }))
  }, [])

  const canGoNext =
    currentAnswer !== undefined &&
    (currentAnswer.optionId !== undefined ||
      currentAnswer.scaleValue !== undefined ||
      (currentAnswer.multipleOptionIds &&
        currentAnswer.multipleOptionIds.length > 0))

  const canGoPrevious = state.currentQuestion > 0

  return {
    currentQuestion,
    currentQuestionIndex: state.currentQuestion,
    totalQuestions: questions.length,
    currentAnswer,
    answers: state.answers,
    canGoNext,
    canGoPrevious,
    isComplete: state.isComplete,
    result: state.result,
    handleAnswer,
    goToNext,
    goToPrevious,
  }
}

// Calculate quiz result based on answers
function calculateResult(
  answers: QuizAnswer[],
  questions: QuizQuestion[]
): QuizResult {
  // Calculate total score by summing all answer values
  let totalScore = 0

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId)
    if (!question) return

    // Add the value from the selected option
    if (answer.optionId && question.options) {
      const option = question.options.find((o) => o.id === answer.optionId)
      if (option) {
        totalScore += option.value
      }
    }
  })

  // Determine overthinker type based on total score ranges
  let type: OverthinkerType
  if (totalScore >= 16 && totalScore <= 28) {
    type = 'mindful-thinker'
  } else if (totalScore >= 29 && totalScore <= 44) {
    type = 'gentle-analyzer'
  } else if (totalScore >= 45 && totalScore <= 60) {
    type = 'chronic-overthinker'
  } else {
    type = 'overthinkaholic'
  }

  // Return result based on type
  return getResultForType(type)
}

function getResultForType(
  type: OverthinkerType
): QuizResult {
  // Map each type to a normalized score out of 10
  // Everyone scores 8-9 - creates urgency while maintaining personalization
  const normalizedScores: Record<OverthinkerType, number> = {
    'mindful-thinker': 8,
    'gentle-analyzer': 8,
    'chronic-overthinker': 9,
    'overthinkaholic': 9,
  }

  const results: Record<OverthinkerType, Omit<QuizResult, 'score'>> = {
    'mindful-thinker': {
      type: 'mindful-thinker',
      title: 'The Mindful Thinker',
      description:
        'You reflect, but rarely spiral. Your thoughts work for you, not against you.',
      insight:
        'You have healthy awareness. Keep using it to make intentional choices.',
      ctaHook:
        'Take your mental clarity to the next level with the F.I.R.E. Kit.',
    },
    'gentle-analyzer': {
      type: 'gentle-analyzer',
      title: 'The Gentle Analyzer',
      description:
        'You think a lot; sometimes it leaks into worry. Awareness is there — you just need light guardrails.',
      insight:
        'Your overthinking is manageable — with the right system in place.',
      ctaHook:
        'Get the F.I.R.E. Kit to turn your analysis into action.',
    },
    'chronic-overthinker': {
      type: 'chronic-overthinker',
      title: 'The Chronic Overthinker',
      description:
        'Your mind loops often. You crave peace, but certainty feels safer than calm.',
      insight:
        'You don\'t need more certainty. You need a system that works without it.',
      ctaHook:
        'Break the loop with the F.I.R.E. Kit built for chronic overthinkers.',
    },
    'overthinkaholic': {
      type: 'overthinkaholic',
      title: 'The Overthinkaholic',
      description:
        'Your brain never clocks out — decisions, looks, texts, sleep. You don\'t need more plans; you need a reset ritual.',
      insight:
        'This isn\'t about willpower. It\'s about interrupting the pattern.',
      ctaHook:
        'Get the F.I.R.E. Kit — the 48-hour protocol for people whose brains won\'t shut up.',
    },
  }

  return {
    ...results[type],
    score: normalizedScores[type],
  }
}
