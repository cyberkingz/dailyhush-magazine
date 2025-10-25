/**
 * DailyHush - Quiz Scoring Utility
 * Calculates overthinker type based on quiz answers
 */

import type { OverthinkerType, QuizResult } from '@/data/quizQuestions';

export interface QuizAnswer {
  questionId: string;
  optionId: string;
  value: number;
}

/**
 * Calculate quiz result from answers
 * Score ranges:
 * - 16-28: Mindful Thinker
 * - 29-44: Gentle Analyzer
 * - 45-60: Chronic Overthinker
 * - 61-80: Overthinkaholic
 */
export function calculateQuizResult(answers: QuizAnswer[]): QuizResult {
  // Calculate total raw score (16-80 range)
  const rawScore = answers.reduce((total, answer) => total + answer.value, 0);

  // Determine overthinker type based on score ranges
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

  return getResultForType(type, rawScore);
}

/**
 * Get result details for a specific overthinker type
 */
function getResultForType(type: OverthinkerType, rawScore: number): QuizResult {
  // Map each type to a normalized score out of 10
  // Everyone scores 8-9 - creates urgency while maintaining personalization
  const normalizedScores: Record<OverthinkerType, number> = {
    'mindful-thinker': 8,
    'gentle-analyzer': 8,
    'chronic-overthinker': 9,
    'overthinkaholic': 9,
  };

  const results: Record<OverthinkerType, Omit<QuizResult, 'score' | 'rawScore'>> = {
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
  };

  return {
    ...results[type],
    score: normalizedScores[type],
    rawScore,
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

    // Prepare individual quiz answers for analytics
    const answersData = answers.map((answer) => ({
      submission_id: submission.id,
      question_id: answer.questionId,
      question_section: 'mobile-quiz', // Mobile app quiz section
      question_type: 'scale', // All mobile quiz questions are scale type (1-5)
      option_id: answer.optionId,
      option_value: answer.value,
      scale_value: answer.value,
    }));

    // Insert all individual answers for analytics
    const { error: answersError } = await supabase
      .from('quiz_answers')
      .insert(answersData);

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
