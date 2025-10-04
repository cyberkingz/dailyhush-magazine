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
  // Score each overthinker type
  const scores: Record<OverthinkerType, number> = {
    'chronic-planner': 0,
    'research-addict': 0,
    'self-doubter': 0,
    'vision-hopper': 0,
  }

  // Simple scoring logic - you can refine this based on specific answer patterns
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId)
    if (!question) return

    // Section-based scoring (simplified for now)
    if (question.section === 'cognitive' && answer.scaleValue && answer.scaleValue > 3) {
      scores['research-addict'] += 2
      scores['chronic-planner'] += 1
    }

    if (question.section === 'action') {
      scores['chronic-planner'] += 2
      scores['vision-hopper'] += 1
    }

    if (question.section === 'emotional') {
      scores['self-doubter'] += 2
    }

    if (question.section === 'behavioral') {
      scores['vision-hopper'] += 2
    }

    // Add option-based scoring
    if (answer.optionId && question.options) {
      const option = question.options.find((o) => o.id === answer.optionId)
      if (option) {
        // Distribute points based on option value
        // This is a simplified example - refine based on your quiz logic
        if (option.value > 3) {
          scores['chronic-planner'] += 1
        }
      }
    }
  })

  // Determine dominant type
  const dominantType = (Object.entries(scores) as [OverthinkerType, number][])
    .sort(([, a], [, b]) => b - a)[0][0]

  // Return result based on type
  return getResultForType(dominantType, scores[dominantType])
}

function getResultForType(
  type: OverthinkerType,
  score: number
): QuizResult {
  const results: Record<OverthinkerType, Omit<QuizResult, 'score'>> = {
    'chronic-planner': {
      type: 'chronic-planner',
      title: 'The Chronic Planner',
      description:
        "You need control & perfect clarity before acting. You've planned every detail, but the execution keeps waiting for 'the right moment.'",
      insight:
        "Here's the truth: You don't need another plan. You need a deadline.",
      ctaHook:
        'Get the F.I.R.E. Kit built specifically for Chronic Planners like you.',
    },
    'research-addict': {
      type: 'research-addict',
      title: 'The Research Addict',
      description:
        "You feel 'productive' learning but never applying. One more course, one more article, one more tutorial... but still no launched product.",
      insight: "More info isn't the cure — it's the drug.",
      ctaHook:
        'Break the research loop with the F.I.R.E. Kit for Research Addicts.',
    },
    'self-doubter': {
      type: 'self-doubter',
      title: 'The Self-Doubter',
      description:
        "You overanalyze your self-worth before taking action. 'What if I'm not good enough?' 'What if they judge me?' Fear keeps you stuck.",
      insight: "You don't need confidence, just momentum.",
      ctaHook:
        'Get the F.I.R.E. Kit designed for Self-Doubters ready to break free.',
    },
    'vision-hopper': {
      type: 'vision-hopper',
      title: 'The Vision Hopper',
      description:
        'You constantly switch ideas before completion. Shiny object syndrome keeps you starting fresh instead of finishing strong.',
      insight: 'Finish one before chasing the next.',
      ctaHook:
        'Lock in your focus with the F.I.R.E. Kit for Vision Hoppers.',
    },
  }

  return {
    ...results[type],
    score,
  }
}
