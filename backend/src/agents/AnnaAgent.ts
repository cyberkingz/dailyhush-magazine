/**
 * AnnaAgent - Core AI Agent using OpenAI Agents SDK
 * Manages conversational therapy sessions for spiral interruption
 */

import { Agent, run } from '@openai/agents';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createAllTools } from '../tools/agentTools';
import type { AnnaAgentOptions, Message } from '../types';

export class AnnaAgent {
  private userId: string;
  private conversationHistory: Message[] = [];
  private preFeelingScore?: number;
  private trigger?: string;
  private sessionStartTime: number;
  private systemPrompt: string;
  private onMessage: (message: string, isComplete?: boolean) => void;
  private onToolCall: (toolName: string, result: unknown) => void;
  private agent: Agent;

  constructor(options: AnnaAgentOptions) {
    this.userId = options.userId;
    this.onMessage = options.onMessage;
    this.onToolCall = options.onToolCall;
    this.sessionStartTime = Date.now();

    // Load Anna's personality from file
    this.systemPrompt = this.loadSystemPrompt();

    // Create OpenAI Agent with tools (using factory to inject userId)
    const sessionStats = this.getStats();
    const tools = createAllTools(this.userId, sessionStats.sessionDurationSeconds);

    console.log(`[AnnaAgent] Created ${tools.length} tools:`, tools.map(t => t.name));

    this.agent = new Agent({
      name: 'Anna',
      instructions: this.systemPrompt,
      model: 'gpt-4o',
      tools: tools,
    });

    console.log(`[AnnaAgent] Initializing for user: ${this.userId}`);

    // Send initial greeting
    this.sendInitialGreeting();
  }

  /**
   * Load Anna's personality system prompt from file
   */
  private loadSystemPrompt(): string {
    try {
      const promptPath = join(__dirname, '../../prompts/anna-personality.md');
      const prompt = readFileSync(promptPath, 'utf-8');
      console.log('[AnnaAgent] System prompt loaded successfully');
      return prompt;
    } catch (error) {
      console.error('[AnnaAgent] Failed to load system prompt:', error);
      // Fallback prompt if file loading fails
      return `You are Anna, an empathetic AI guide for DailyHush. Your role is to help users interrupt rumination spirals through conversation and guided exercises.

Be warm, validating, and action-oriented. When a user shares their spiral (intensity 6+), guide them through the 5-4-3-2-1 grounding exercise by calling the triggerExercise tool.

After they complete the exercise, celebrate their progress with specific counterfactual language showing what they avoided (e.g., "You just avoided 45 minutes of spiraling about work. You reclaimed your afternoon.").`;
    }
  }

  /**
   * Send initial greeting when conversation starts
   */
  private async sendInitialGreeting(): Promise<void> {
    const greeting = "Hi. What's got you stuck right now?";

    this.conversationHistory.push({
      role: 'assistant',
      content: greeting,
      timestamp: new Date().toISOString(),
    });

    this.onMessage(greeting, true); // Complete message
  }

  /**
   * Handle incoming user message
   */
  async handleMessage(message: string): Promise<void> {
    console.log(`[AnnaAgent] User message: "${message.substring(0, 50)}..."`);

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    });

    // Extract intensity score if user mentions a number (1-10)
    const intensityMatch = message.match(/\b([1-9]|10)\b/);
    if (intensityMatch && !this.preFeelingScore) {
      this.preFeelingScore = parseInt(intensityMatch[1], 10);
      console.log(`[AnnaAgent] Detected pre-feeling score: ${this.preFeelingScore}`);
    }

    // Try to extract trigger from first meaningful message
    if (!this.trigger && message.length > 10 && message.length < 200) {
      this.trigger = message;
      console.log(`[AnnaAgent] Potential trigger detected: "${this.trigger.substring(0, 50)}..."`);
    }

    try {
      let fullResponse = '';

      console.log('[AnnaAgent] Starting agent run with OpenAI...');

      // Run the agent with streaming
      const stream = await run(this.agent, message, {
        stream: true,
      });

      console.log('[AnnaAgent] Stream started, processing events...');

      // Iterate over streaming events
      for await (const event of stream) {
        // Handle tool execution events
        if (event.type === 'run_item_stream_event') {
          const item = event.item;
          console.log('[AnnaAgent] Run item event:', item.type, 'Full item:', JSON.stringify(item, null, 2));

          // Tool call output (result available)
          if (item.type === 'tool_call_output_item') {
            console.log('[AnnaAgent] Tool output received:', JSON.stringify(item, null, 2));

            // Notify mobile app about tool execution
            const rawItem = (item as any).rawItem;
            const toolName = rawItem?.name;

            // The output is nested: rawItem.output.text contains the JSON string
            const outputText = rawItem?.output?.text;

            if (toolName === 'triggerExercise' && outputText) {
              try {
                // Parse the JSON string output
                const result = JSON.parse(outputText);
                console.log('[AnnaAgent] Triggering exercise with parsed result:', result);
                this.onToolCall('triggerExercise', result);
              } catch (error) {
                console.error('[AnnaAgent] Failed to parse tool output:', error);
              }
            }
          }

          // Alternative: Tool call item (may have status)
          if (item.type === 'tool_call_item' && item.name === 'triggerExercise') {
            console.log('[AnnaAgent] Tool call detected:', item.name);
          }
        }

        // Extract text deltas from the stream
        if (event.type === 'raw_model_stream_event') {
          const data = event.data;

          // Handle text delta events (streaming text chunks)
          if (data.type === 'output_text_delta' && data.delta) {
            console.log('[AnnaAgent] Text delta:', data.delta);
            fullResponse += data.delta;

            // Stream each chunk to the mobile app in real-time
            this.onMessage(data.delta, false); // Not complete yet
          }

          // Handle completion event
          else if (data.type === 'response_done' && data.response) {
            console.log('[AnnaAgent] Response completed');
            // Signal completion to mobile app
            this.onMessage('', true); // Empty string with completion flag
          }
        }
      }

      console.log('[AnnaAgent] Stream iteration completed. Full response:', fullResponse);

      // Add complete assistant response to history
      if (fullResponse) {
        this.conversationHistory.push({
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.warn('[AnnaAgent] No response generated from agent');
      }
    } catch (error) {
      console.error('[AnnaAgent] Error processing message:', error);
      console.error('[AnnaAgent] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      const errorMessage = "I'm having trouble connecting right now. Can you try sending that again?";
      this.onMessage(errorMessage, true); // Complete message

      this.conversationHistory.push({
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Handle exercise completion from mobile app
   */
  async handleExerciseComplete(postFeelingScore: number, preFeelingScore?: number): Promise<void> {
    console.log(`[AnnaAgent] Exercise complete. Post-score: ${postFeelingScore}, Pre-score: ${preFeelingScore || this.preFeelingScore}`);

    // Use provided preFeelingScore or fall back to stored one
    const preScore = preFeelingScore || this.preFeelingScore;

    if (!preScore) {
      console.warn('[AnnaAgent] Missing pre-feeling score for victory message');
      this.preFeelingScore = 8; // Default assumption
    } else {
      this.preFeelingScore = preScore;
    }

    const reduction = this.preFeelingScore - postFeelingScore;
    const reductionPercent = Math.round((reduction / this.preFeelingScore) * 100);

    // Calculate estimated time saved (rough heuristic: 1 point = ~15 minutes)
    const estimatedMinutesSaved = Math.round(reduction * 15);

    // Determine time of day for message
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

    // Create counterfactual victory message
    const victoryMessage = `That's a ${reduction} point drop (${reductionPercent}% reduction). You just avoided ~${estimatedMinutesSaved} minutes of spiraling${this.trigger ? ` about ${this.trigger}` : ''}. You reclaimed your ${timeOfDay}. That's real progress.`;

    this.onMessage(victoryMessage, true); // Complete message

    this.conversationHistory.push({
      role: 'assistant',
      content: victoryMessage,
      timestamp: new Date().toISOString(),
    });

    // Optionally trigger saveProgress tool automatically
    // (or let Anna decide to call it based on the victory message)
  }

  /**
   * Get conversation statistics
   */
  getStats(): {
    messageCount: number;
    sessionDurationSeconds: number;
    preFeelingScore?: number;
  } {
    return {
      messageCount: this.conversationHistory.length,
      sessionDurationSeconds: Math.floor((Date.now() - this.sessionStartTime) / 1000),
      preFeelingScore: this.preFeelingScore,
    };
  }

  /**
   * Get conversation history (for debugging/logging)
   */
  getHistory(): Message[] {
    return [...this.conversationHistory];
  }

  /**
   * Update callbacks for reconnected socket
   */
  updateCallbacks(onMessage: (message: string, isComplete?: boolean) => void, onToolCall: (toolName: string, result: unknown) => void): void {
    console.log(`[AnnaAgent] Updating callbacks for reconnected user: ${this.userId}`);
    this.onMessage = onMessage;
    this.onToolCall = onToolCall;
  }

  /**
   * Clean up resources when session ends
   */
  cleanup(): void {
    console.log(`[AnnaAgent] Cleaning up session for user: ${this.userId}`);
    console.log(`[AnnaAgent] Final stats:`, this.getStats());

    // Clear conversation history to free memory
    this.conversationHistory = [];
  }
}
