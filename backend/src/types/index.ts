/**
 * Shared TypeScript types for DailyHush Anna Backend
 */

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ExerciseTrigger {
  exerciseType: '5-4-3-2-1' | 'breathing';
  preFeelingScore: number;
  action: 'TRIGGER_EXERCISE';
}

export interface SessionProgress {
  userId: string;
  preFeelingScore: number;
  postFeelingScore: number;
  trigger: string;
  conversationSummary: string;
  exerciseCompleted: boolean;
}

export interface SpiralHistory {
  recentSpirals: number;
  mostCommonTrigger: string | null;
  avgImprovement: number;
}

export interface AnnaAgentOptions {
  userId: string;
  onMessage: (message: string) => void;
  onToolCall: (toolName: string, result: unknown) => void;
}

export interface SocketData {
  userId: string;
}

export interface UserMessage {
  message: string;
}

export interface ExerciseComplete {
  preFeelingScore?: number;
  postFeelingScore: number;
}

export interface ErrorResponse {
  message: string;
  code?: string;
}
