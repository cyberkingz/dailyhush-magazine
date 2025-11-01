import { useState, useCallback } from 'react'
import type {
  QuizQuestion,
  QuizAnswer,
  QuizState,
  QuizResult,
  OverthinkerType,
  LoopType,
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
  // Calculate total score by summing all answer values (for severity)
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

  // Calculate loop type scores
  const loopScores = calculateLoopScores(answers, questions)

  // Determine overthinker type based on total score ranges (severity)
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

  // Return result based on type and loop
  return getResultForType(type, loopScores.dominantLoop)
}

// Calculate scores for each loop type with weighting
function calculateLoopScores(
  answers: QuizAnswer[],
  questions: QuizQuestion[]
): { dominantLoop: LoopType; scores: Record<LoopType, number> } {
  // Question mapping to loop types
  const loopMapping: Record<string, LoopType> = {
    // Sleep Loop: Q14, Q15, Q16
    q14: 'sleep-loop',
    q15: 'sleep-loop',
    q16: 'sleep-loop',

    // Decision Loop: Q2, Q8, Q9, Q10
    q2: 'decision-loop',
    q8: 'decision-loop',
    q9: 'decision-loop',
    q10: 'decision-loop',

    // Social Loop: Q1, Q4, Q7, Q11, Q13
    q1: 'social-loop',
    q4: 'social-loop',
    q7: 'social-loop',
    q11: 'social-loop',
    q13: 'social-loop',

    // Perfectionism Loop: Q6, Q12, Q17, Q18, Q19
    q6: 'perfectionism-loop',
    q12: 'perfectionism-loop',
    q17: 'perfectionism-loop',
    q18: 'perfectionism-loop',
    q19: 'perfectionism-loop',
  }

  // Count questions per loop type
  const questionCounts: Record<LoopType, number> = {
    'sleep-loop': 3,
    'decision-loop': 4,
    'social-loop': 5,
    'perfectionism-loop': 5,
  }

  // Weights for each loop type
  const weights: Record<LoopType, number> = {
    'sleep-loop': 1.2,
    'decision-loop': 1.0,
    'social-loop': 0.9,
    'perfectionism-loop': 1.0,
  }

  // Calculate raw scores
  const rawScores: Record<LoopType, number> = {
    'sleep-loop': 0,
    'decision-loop': 0,
    'social-loop': 0,
    'perfectionism-loop': 0,
  }

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId)
    if (!question) return

    const loopType = loopMapping[answer.questionId]
    if (!loopType) return // Skip Q0, Q3, Q5, Q20 (trigger/severity questions)

    if (answer.optionId && question.options) {
      const option = question.options.find((o) => o.id === answer.optionId)
      if (option) {
        rawScores[loopType] += option.value
      }
    }
  })

  // Normalize and apply weights
  const normalizedScores: Record<LoopType, number> = {
    'sleep-loop': (rawScores['sleep-loop'] / (questionCounts['sleep-loop'] * 5)) * weights['sleep-loop'],
    'decision-loop': (rawScores['decision-loop'] / (questionCounts['decision-loop'] * 5)) * weights['decision-loop'],
    'social-loop': (rawScores['social-loop'] / (questionCounts['social-loop'] * 5)) * weights['social-loop'],
    'perfectionism-loop': (rawScores['perfectionism-loop'] / (questionCounts['perfectionism-loop'] * 5)) * weights['perfectionism-loop'],
  }

  // Find dominant loop
  let dominantLoop: LoopType = 'social-loop'
  let maxScore = 0

  Object.entries(normalizedScores).forEach(([loop, score]) => {
    if (score > maxScore) {
      maxScore = score
      dominantLoop = loop as LoopType
    }
  })

  return { dominantLoop, scores: normalizedScores }
}

function getResultForType(
  type: OverthinkerType,
  loopType: LoopType
): QuizResult {
  // Map each type to a normalized score out of 10
  // Everyone scores 8-9 - creates urgency while maintaining personalization
  const normalizedScores: Record<OverthinkerType, number> = {
    'mindful-thinker': 8,
    'gentle-analyzer': 8,
    'chronic-overthinker': 9,
    'overthinkaholic': 9,
  }

  const results: Record<OverthinkerType, Omit<QuizResult, 'score' | 'loopType'>> = {
    'mindful-thinker': {
      type: 'mindful-thinker',
      title: 'The Mindful Thinker',
      description:
        'You reflect, but rarely spiral. Your thoughts work for you, not against you.',
      insight:
        'You have healthy awareness. Keep using it to make intentional choices.',
      ctaHook:
        'Take your mental clarity to the next level with the F.I.R.E. Protocol.',
    },
    'gentle-analyzer': {
      type: 'gentle-analyzer',
      title: 'The Gentle Analyzer',
      description:
        'You think a lot; sometimes it leaks into worry. Awareness is there — you just need light guardrails.',
      insight:
        'Your overthinking is manageable — with the right system in place.',
      ctaHook:
        'Get the F.I.R.E. Protocol to turn your analysis into action.',
    },
    'chronic-overthinker': {
      type: 'chronic-overthinker',
      title: 'The Chronic Overthinker',
      description:
        'Your mind loops often. You crave peace, but certainty feels safer than calm.',
      insight:
        'You don\'t need more certainty. You need a system that works without it.',
      ctaHook:
        'Break the loop with the F.I.R.E. Protocol built for chronic overthinkers.',
    },
    'overthinkaholic': {
      type: 'overthinkaholic',
      title: 'The Overthinkaholic',
      description:
        'Your brain never clocks out — decisions, looks, texts, sleep. You don\'t need more plans; you need a reset ritual.',
      insight:
        'This isn\'t about willpower. It\'s about interrupting the pattern.',
      ctaHook:
        'Get the F.I.R.E. Protocol — the 48-hour protocol for people whose brains won\'t shut up.',
    },
  }

  return {
    ...results[type],
    score: normalizedScores[type],
    loopType,
  }
}
