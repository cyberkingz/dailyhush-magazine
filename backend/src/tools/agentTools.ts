/**
 * Agent Tools for Anna
 * These are the functions that OpenAI Agents SDK can autonomously call during conversations
 */

import { tool } from '@openai/agents';
import { z } from 'zod';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ExerciseTrigger, SessionProgress, SpiralHistory } from '../types';

// Lazy initialization of Supabase client to ensure env vars are loaded
let supabase: SupabaseClient;

function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabase;
}

/**
 * Tool 1: Trigger Exercise
 * Called by Anna when user is ready to start the spiral interruption protocol
 */
export const triggerExercise = tool({
  name: 'triggerExercise',
  description: 'Triggers the 5-4-3-2-1 grounding exercise in the mobile app. Use when user is ready to start the protocol after you\'ve connected and validated their feeling. User must have intensity score ≥6.',
  parameters: z.object({
    exerciseType: z.enum(['5-4-3-2-1', 'breathing']).describe('Type of exercise to trigger'),
    preFeelingScore: z.number().min(1).max(10).describe('User\'s intensity rating before exercise (1-10 scale)'),
  }),
  execute: async ({ exerciseType, preFeelingScore }): Promise<ExerciseTrigger> => {
    console.log(`[Tool: triggerExercise] Exercise type: ${exerciseType}, Pre-score: ${preFeelingScore}`);

    return {
      success: true,
      exerciseType: exerciseType,
      preFeelingScore: preFeelingScore,
      action: 'TRIGGER_EXERCISE', // Mobile app listens for this
    } as ExerciseTrigger;
  },
});

/**
 * Tool 2: Save Progress
 * Called by Anna after user completes the exercise to save session data
 */
export const createSaveProgressTool = (userId: string, sessionDurationSeconds: number) => tool({
  name: 'saveProgress',
  description: 'Saves the conversation session to database after user completes check-out. Include pre/post scores and key insights. Call this after exercise is complete and you\'ve received the post-feeling score.',
  parameters: z.object({
    preFeelingScore: z.number().min(1).max(10).describe('User\'s intensity before exercise'),
    postFeelingScore: z.number().min(1).max(10).describe('User\'s intensity after exercise'),
    trigger: z.string().describe('What they were ruminating about (their own words)'),
    conversationSummary: z.string().max(500).describe('2-3 sentence summary of the session'),
    exerciseCompleted: z.boolean().describe('Whether they completed the full exercise'),
  }),
  execute: async ({ preFeelingScore, postFeelingScore, trigger, conversationSummary, exerciseCompleted }) => {
    console.log(`[Tool: saveProgress] Saving session for user: ${userId}`);

    const reductionPercentage = preFeelingScore > 0
      ? Math.round(((preFeelingScore - postFeelingScore) / preFeelingScore) * 100)
      : 0;

    const { data, error } = await getSupabaseClient()
      .from('ai_sessions')
      .insert({
        user_id: userId,
        pre_feeling: preFeelingScore,
        post_feeling: postFeelingScore,
        trigger: trigger,
        conversation_summary: conversationSummary,
        exercise_completed: exerciseCompleted,
        reduction_percentage: reductionPercentage,
        session_duration_seconds: sessionDurationSeconds,
        model_used: 'gpt-4o',
        total_tokens: 0,
        cost_cents: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('[Tool: saveProgress] Error:', error);
      throw new Error(`Failed to save session: ${error.message}`);
    }

    console.log(`[Tool: saveProgress] Session saved with ${reductionPercentage}% reduction`);

    return {
      success: true,
      sessionId: data?.session_id,
      reductionPercentage,
      message: `Session saved successfully with ${reductionPercentage}% reduction`,
    };
  },
});

/**
 * Tool 3: Get Spiral History
 * Called by Anna if user mentions patterns ("this keeps happening") to personalize response
 */
export const createGetSpiralHistoryTool = (userId: string) => tool({
  name: 'getSpiralHistory',
  description: 'Gets user\'s recent spiral patterns to personalize conversation. Use if user mentions "this keeps happening" or wants to understand their patterns. Shows most common triggers and improvement trends.',
  parameters: z.object({
    limit: z.number().min(1).max(10).default(5).describe('Number of recent spirals to analyze (default: 5)'),
  }),
  execute: async ({ limit }): Promise<SpiralHistory> => {
    console.log(`[Tool: getSpiralHistory] Fetching history for user: ${userId}, limit: ${limit}`);

    // Get from spiral_logs (existing table)
    const { data: spiralLogs, error: spiralError } = await getSupabaseClient()
      .from('spiral_logs')
      .select('timestamp, trigger, pre_feeling, post_feeling, duration_seconds')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (spiralError) {
      console.error('[Tool: getSpiralHistory] Error fetching spiral logs:', spiralError);
    }

    // Get from ai_sessions (new table)
    const { data: aiSessions, error: aiError } = await getSupabaseClient()
      .from('ai_sessions')
      .select('timestamp, trigger, pre_feeling, post_feeling')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (aiError) {
      console.error('[Tool: getSpiralHistory] Error fetching AI sessions:', aiError);
    }

    // Combine both sources
    const allSpirals = [...(spiralLogs || []), ...(aiSessions || [])];
    const triggers = allSpirals.map(s => s.trigger).filter(Boolean);

    // Find most common trigger
    const triggerCounts = triggers.reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonTrigger = Object.keys(triggerCounts).length > 0
      ? Object.entries(triggerCounts).sort(([, a], [, b]) => b - a)[0][0]
      : null;

    // Calculate average improvement
    const improvements = allSpirals
      .filter(s => s.pre_feeling && s.post_feeling)
      .map(s => s.pre_feeling! - s.post_feeling!);

    const avgImprovement = improvements.length > 0
      ? improvements.reduce((sum, val) => sum + val, 0) / improvements.length
      : 0;

    console.log(`[Tool: getSpiralHistory] Found ${allSpirals.length} spirals, most common: ${mostCommonTrigger}`);

    return {
      recentSpirals: allSpirals.length,
      mostCommonTrigger,
      avgImprovement: Math.round(avgImprovement * 10) / 10, // Round to 1 decimal
    };
  },
});

// Export factory function to create all tools for a given user
export const createAllTools = (userId: string, sessionDurationSeconds: number) => [
  triggerExercise,
  createSaveProgressTool(userId, sessionDurationSeconds),
  createGetSpiralHistoryTool(userId),
];
