/**
 * DailyHush - Quiz Scoring Utility
 * Calculates overthinker type and loop type based on quiz answers
 * Synced with web app scoring logic
 * Updated: 2025-10-31
 */

import type { OverthinkerType, QuizResult, LoopType } from '@/data/quizQuestions';

export interface QuizAnswer {
  questionId: string;
  optionId: string;
  value: number;
}

/**
 * Calculate quiz result from answers
 * Score ranges for severity:
 * - 16-28: Mindful Thinker
 * - 29-44: Gentle Analyzer
 * - 45-60: Chronic Overthinker
 * - 61-80: Overthinkaholic
 */
export function calculateQuizResult(answers: QuizAnswer[]): QuizResult {
  // Calculate total raw score (for severity)
  const rawScore = answers.reduce((total, answer) => total + answer.value, 0);

  // Calculate loop type scores
  const loopScores = calculateLoopScores(answers);

  // Determine overthinker type based on score ranges (severity)
  let type: OverthinkerType;
  if (rawScore >= 16 && rawScore <= 28) {
    type = 'mindful-thinker';
  } else if (rawScore >= 29 && rawScore <= 44) {
    type = 'gentle-analyzer';
  } else if (rawScore >= 45 && rawScore <= 60) {
    type = 'chronic-overthinker';
  } else {
    type = 'overthinkaholic';
  }

  return getResultForType(type, loopScores.dominantLoop, rawScore);
}

/**
 * Calculate scores for each loop type with weighting
 * Same logic as web app
 */
function calculateLoopScores(
  answers: QuizAnswer[]
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
  };

  // Count questions per loop type
  const questionCounts: Record<LoopType, number> = {
    'sleep-loop': 3,
    'decision-loop': 4,
    'social-loop': 5,
    'perfectionism-loop': 5,
  };

  // Weights for each loop type
  const weights: Record<LoopType, number> = {
    'sleep-loop': 1.2,
    'decision-loop': 1.0,
    'social-loop': 0.9,
    'perfectionism-loop': 1.0,
  };

  // Calculate raw scores
  const rawScores: Record<LoopType, number> = {
    'sleep-loop': 0,
    'decision-loop': 0,
    'social-loop': 0,
    'perfectionism-loop': 0,
  };

  answers.forEach((answer) => {
    const loopType = loopMapping[answer.questionId];
    if (!loopType) return; // Skip Q0, Q3, Q5, Q20 (trigger/severity questions)

    rawScores[loopType] += answer.value;
  });

  // Normalize and apply weights
  const normalizedScores: Record<LoopType, number> = {
    'sleep-loop': (rawScores['sleep-loop'] / (questionCounts['sleep-loop'] * 5)) * weights['sleep-loop'],
    'decision-loop': (rawScores['decision-loop'] / (questionCounts['decision-loop'] * 5)) * weights['decision-loop'],
    'social-loop': (rawScores['social-loop'] / (questionCounts['social-loop'] * 5)) * weights['social-loop'],
    'perfectionism-loop': (rawScores['perfectionism-loop'] / (questionCounts['perfectionism-loop'] * 5)) * weights['perfectionism-loop'],
  };

  // Find dominant loop
  let dominantLoop: LoopType = 'social-loop';
  let maxScore = 0;

  Object.entries(normalizedScores).forEach(([loop, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantLoop = loop as LoopType;
    }
  });

  return { dominantLoop, scores: normalizedScores };
}

/**
 * Get result details for a specific overthinker type
 */
function getResultForType(type: OverthinkerType, loopType: LoopType, rawScore: number): QuizResult {
  // Map each type to a normalized score out of 10
  // Everyone scores 8-9 - creates urgency while maintaining personalization
  const normalizedScores: Record<OverthinkerType, number> = {
    'mindful-thinker': 8,
    'gentle-analyzer': 8,
    'chronic-overthinker': 9,
    overthinkaholic: 9,
  };

  const results: Record<OverthinkerType, Omit<QuizResult, 'score' | 'rawScore' | 'loopType'>> = {
    'mindful-thinker': {
      type: 'mindful-thinker',
      title: 'The Mindful Thinker',
      description: 'You reflect, but rarely spiral. Your thoughts work for you, not against you.',
      insight: 'You have healthy awareness. Keep using it to make intentional choices.',
      ctaHook: 'Take your mental clarity to the next level with the F.I.R.E. Protocol.',
    },
    'gentle-analyzer': {
      type: 'gentle-analyzer',
      title: 'The Gentle Analyzer',
      description:
        'You think a lot; sometimes it leaks into worry. Awareness is there — you just need light guardrails.',
      insight: 'Your overthinking is manageable — with the right system in place.',
      ctaHook: 'Get the F.I.R.E. Protocol to turn your analysis into action.',
    },
    'chronic-overthinker': {
      type: 'chronic-overthinker',
      title: 'The Chronic Overthinker',
      description: 'Your mind loops often. You crave peace, but certainty feels safer than calm.',
      insight: "You don't need more certainty. You need a system that works without it.",
      ctaHook: 'Break the loop with the F.I.R.E. Protocol built for chronic overthinkers.',
    },
    overthinkaholic: {
      type: 'overthinkaholic',
      title: 'The Overthinkaholic',
      description:
        "Your brain never clocks out — decisions, looks, texts, sleep. You don't need more plans; you need a reset ritual.",
      insight: "This isn't about willpower. It's about interrupting the pattern.",
      ctaHook:
        "Get the F.I.R.E. Protocol — the 48-hour protocol for people whose brains won't shut up.",
    },
  };

  return {
    ...results[type],
    score: normalizedScores[type],
    rawScore,
    loopType,
  };
}

/**
 * Submit quiz results to Supabase
 * Saves to quiz_submissions table with source='mobile-app'
 */
export async function submitQuizToSupabase(
  email: string,
  answers: QuizAnswer[],
  result: QuizResult,
  supabase: any
): Promise<{ success: boolean; submissionId?: string; error?: string }> {
  try {
    // Prepare submission data
    const submissionData = {
      email: email.trim().toLowerCase(),
      overthinker_type: result.type,
      routing: result.loopType, // Loop type for email sequence routing
      score: result.rawScore,
      result_title: result.title,
      result_description: result.description,
      result_insight: result.insight,
      result_cta_hook: result.ctaHook,
      source_url: 'dailyhush://app/quiz', // Mobile app identifier
      source_page: 'mobile-app', // Distinguish from web 'quiz'
      device_type: 'mobile',
      created_at: new Date().toISOString(),
    };

    // Insert submission
    const { data: submission, error: submissionError } = await supabase
      .from('quiz_submissions')
      .insert([submissionData])
      .select('id')
      .single();

    if (submissionError) {
      console.error('Error creating quiz submission:', submissionError);
      return {
        success: false,
        error: submissionError.message,
      };
    }

    if (!submission) {
      return {
        success: false,
        error: 'No submission ID returned',
      };
    }

    console.log('✅ Quiz submission saved:', submission.id);
    console.log('📊 Routing:', result.loopType, '| Severity:', result.type);

    // Prepare individual quiz answers for analytics
    const answersData = answers.map((answer) => ({
      submission_id: submission.id,
      question_id: answer.questionId,
      question_section: 'mobile-quiz', // Mobile app quiz section
      question_type: 'scale', // All mobile quiz questions are scale type (0-5)
      option_id: answer.optionId,
      option_value: answer.value,
      scale_value: answer.value,
    }));

    // Insert all individual answers for analytics
    const { error: answersError } = await supabase.from('quiz_answers').insert(answersData);

    if (answersError) {
      console.error('Error saving quiz answers:', answersError);
      console.warn('⚠️ Quiz submission successful but answers failed to save');
      // Note: This is non-critical - submission was successful
      // Analytics will be incomplete but user flow continues
    } else {
      console.log('✅ Quiz answers saved successfully! (', answersData.length, 'answers)');
    }

    return {
      success: true,
      submissionId: submission.id,
    };
  } catch (error: any) {
    console.error('Exception submitting quiz:', error);
    return {
      success: false,
      error: error?.message || 'Unknown error',
    };
  }
}
