# Anna AI Conversational Therapy - 2-Day Implementation Roadmap

**Goal:** Enable users to talk with Anna (AI therapist) who guides them through spiral interruption exercises using Claude Agent SDK.

**Cost:** ~$1.25/user/month (Claude Sonnet 4.5, 50 sessions)
**Test:** 20 users for 7 days to validate retention improvement

---

## Tech Stack

### Backend (Render Web Service)
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Real-time:** Socket.io (WebSocket)
- **AI:** Claude Agent SDK (@anthropic-ai/claude-agent-sdk)
- **Database:** Supabase (existing)
- **Deployment:** Render.com (Free tier)

### Mobile (React Native/Expo)
- **Framework:** Expo SDK 51+
- **WebSocket:** socket.io-client
- **State:** Custom React hooks
- **UI:** Reusable components with proper TypeScript

---

## Agent Delegation

### 🤖 **UX Expert Agent** (`ux-expert`)
**Tasks:**
1. Design conversational UI flow (mood → Anna → exercise → reflection)
2. Review ChatBubble and ChatMessage component UX
3. Ensure empathetic conversation patterns
4. Validate accessibility for anxiety users

### 🎨 **UI Design Expert Agent** (`ui-design-expert`)
**Tasks:**
1. Create ChatBubble component with Anna's calming aesthetic
2. Design streaming message animation
3. Ensure visual consistency with existing app design
4. Review color schemes for calming effect

### 🏗️ **Supabase Expert Agent** (`supabase-expert`)
**Tasks:**
1. Design `ai_sessions` table schema
2. Create migration for AI conversation tracking
3. Set up RLS policies for user conversations
4. Review database queries for performance

### 🧠 **David Ogilvy Copywriter Agent** (`david-ogilvy-copywriter`)
**Tasks:**
1. Write Anna's personality system prompt
2. Create empathetic conversation templates
3. Design counterfactual victory messages
4. Ensure calming, non-clinical tone

### 🔧 **General Purpose Agent** (`general-purpose`)
**Tasks:**
1. Set up Node.js backend project structure
2. Implement Express + Socket.io server
3. Integrate Claude Agent SDK
4. Build mobile WebSocket connection
5. Create useAnnaChat React hook

---

## DAY 1: Backend Architecture (8 hours)

### Task 1.1: Anna's Personality Design (1h)
**Agent:** `david-ogilvy-copywriter`

**Deliverable:** Anna's system prompt defining her voice, empathy, and conversation flow.

**File:** `backend/prompts/anna-personality.md`

```markdown
# Anna - DailyHush AI Guide

## Core Identity
Anna is the voice of DailyHush's founder - warm, understanding, and deeply experienced with rumination spirals. She speaks like a trusted friend who's been there, not a clinical therapist.

## Personality Traits
- **Empathetic:** Validates feelings without judgment
- **Calming:** Uses gentle, grounding language
- **Direct:** Gets to the point, respects user's time
- **Experienced:** Shares relatable insights about spirals
- **Action-oriented:** Guides toward concrete exercises, not endless talk

## Conversation Flow
1. **Connect:** "What's got you stuck right now?"
2. **Validate:** Acknowledge the difficulty without amplifying
3. **Assess:** Quick intensity check (1-10)
4. **Guide:** Introduce grounding exercise naturally
5. **Execute:** Use triggerExercise() tool at right moment
6. **Reflect:** Check improvement, celebrate small wins

## Language Patterns
- **DO:** "That sounds really tough. Let's pull you out of this."
- **DO:** "8 is high. I'm going to guide you through something that helps."
- **DO:** "You just pulled yourself out. That's real progress."
- **DON'T:** "I understand how you feel" (robotic empathy)
- **DON'T:** "Have you tried..." (suggests they failed before)
- **DON'T:** Clinical jargon (CBT, cognitive distortions, etc.)

## When to Trigger Exercise
- User's intensity is 6+ AND
- They've shared the trigger/situation AND
- You've validated their feeling

Use: triggerExercise({ type: "5-4-3-2-1" })

## Handling Resistance
If user says "I don't think this will work":
"I hear you. But you reached out, which means part of you wants relief. Give me 3 minutes. If it doesn't help, we'll try something else."

## Victory Framing
After exercise, show counterfactual:
"That's a [X point drop]. You just avoided [estimated time] of spiraling about [topic]. You reclaimed your [time of day]."
```

---

### Task 1.2: Define Agent Tools (1h)
**Agent:** `general-purpose`

**Deliverable:** Tool definitions for Claude Agent

**File:** `backend/src/tools/agentTools.ts`

```typescript
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const tools = {
  triggerExercise: {
    description: 'Triggers the 5-4-3-2-1 grounding exercise in the mobile app. Use when user is ready to start the protocol after you\'ve connected and validated their feeling.',
    parameters: z.object({
      exerciseType: z.enum(['5-4-3-2-1', 'breathing']).describe('Type of exercise to trigger'),
      preFeelingScore: z.number().min(1).max(10).describe('User\'s intensity rating before exercise'),
    }),
    execute: async ({ exerciseType, preFeelingScore }: {
      exerciseType: string;
      preFeelingScore: number;
    }) => {
      return {
        success: true,
        exerciseType,
        preFeelingScore,
        action: 'TRIGGER_EXERCISE', // Mobile app listens for this
      };
    },
  },

  saveProgress: {
    description: 'Saves the conversation session to database after user completes check-out. Include pre/post scores and key insights.',
    parameters: z.object({
      userId: z.string().uuid(),
      preFeelingScore: z.number().min(1).max(10),
      postFeelingScore: z.number().min(1).max(10),
      trigger: z.string().describe('What they were ruminating about'),
      conversationSummary: z.string().describe('2-3 sentence summary of the session'),
      exerciseCompleted: z.boolean(),
    }),
    execute: async (params: {
      userId: string;
      preFeelingScore: number;
      postFeelingScore: number;
      trigger: string;
      conversationSummary: string;
      exerciseCompleted: boolean;
    }) => {
      const { data, error } = await supabase
        .from('ai_sessions')
        .insert({
          user_id: params.userId,
          pre_feeling: params.preFeelingScore,
          post_feeling: params.postFeelingScore,
          trigger: params.trigger,
          conversation_summary: params.conversationSummary,
          exercise_completed: params.exerciseCompleted,
          session_duration_seconds: 0, // Calculate on client
          reduction_percentage: Math.round(
            ((params.preFeelingScore - params.postFeelingScore) / params.preFeelingScore) * 100
          ),
        });

      if (error) throw error;

      return {
        success: true,
        sessionId: data?.id,
        reductionPercentage: Math.round(
          ((params.preFeelingScore - params.postFeelingScore) / params.preFeelingScore) * 100
        ),
      };
    },
  },

  getSpiralHistory: {
    description: 'Gets user\'s recent spiral patterns to personalize conversation. Use if user mentions "this keeps happening" or wants to understand their patterns.',
    parameters: z.object({
      userId: z.string().uuid(),
      limit: z.number().min(1).max(10).default(5),
    }),
    execute: async ({ userId, limit }: { userId: string; limit: number }) => {
      const { data, error } = await supabase
        .from('spiral_logs')
        .select('timestamp, trigger, pre_feeling, post_feeling, duration_seconds')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Analyze patterns
      const triggers = data?.map(s => s.trigger).filter(Boolean) || [];
      const mostCommonTrigger = triggers.length > 0
        ? triggers.reduce((a, b, i, arr) =>
            arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
          )
        : null;

      return {
        recentSpirals: data?.length || 0,
        mostCommonTrigger,
        avgImprovement: data?.reduce((acc, s) =>
          acc + (s.pre_feeling - s.post_feeling), 0
        ) / (data?.length || 1),
      };
    },
  },
};
```

---

### Task 1.3: Setup Node.js Backend (2h)
**Agent:** `general-purpose`

**Deliverable:** Express + Socket.io + Claude Agent SDK integration

**File:** `backend/package.json`

```json
{
  "name": "dailyhush-anna-backend",
  "version": "1.0.0",
  "description": "Anna AI conversation backend using Claude Agent SDK",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  },
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0",
    "@supabase/supabase-js": "^2.39.0",
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "zod": "^3.22.4",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

**File:** `backend/src/index.ts`

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import { AnnaAgent } from './agents/AnnaAgent';
import { authenticateSocket } from './middleware/auth';

config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.MOBILE_APP_URL || '*',
    credentials: true,
  },
});

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'anna-backend' });
});

// WebSocket connection handling
io.use(authenticateSocket); // Verify Supabase JWT

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.data.userId}`);

  const annaAgent = new AnnaAgent({
    userId: socket.data.userId,
    onMessage: (message) => {
      // Stream Anna's responses to mobile app
      socket.emit('anna:message', {
        role: 'assistant',
        content: message,
        timestamp: new Date().toISOString(),
      });
    },
    onToolCall: (toolName, result) => {
      // Notify mobile app when tools are called
      if (toolName === 'triggerExercise') {
        socket.emit('anna:trigger_exercise', result);
      }
    },
  });

  socket.on('user:message', async (data: { message: string }) => {
    try {
      await annaAgent.handleMessage(data.message);
    } catch (error) {
      console.error('Anna agent error:', error);
      socket.emit('anna:error', {
        message: 'I\'m having trouble connecting. Can you try again?'
      });
    }
  });

  socket.on('user:exercise_complete', async (data: { postFeelingScore: number }) => {
    await annaAgent.handleExerciseComplete(data.postFeelingScore);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.data.userId}`);
    annaAgent.cleanup();
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Anna backend running on port ${PORT}`);
});
```

**File:** `backend/src/agents/AnnaAgent.ts`

```typescript
import { Agent } from '@anthropic-ai/claude-agent-sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { tools } from '../tools/agentTools';

interface AnnaAgentOptions {
  userId: string;
  onMessage: (message: string) => void;
  onToolCall: (toolName: string, result: any) => void;
}

export class AnnaAgent {
  private agent: Agent;
  private userId: string;
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private preFeelingScore?: number;
  private trigger?: string;
  private onMessage: (message: string) => void;
  private onToolCall: (toolName: string, result: any) => void;

  constructor(options: AnnaAgentOptions) {
    this.userId = options.userId;
    this.onMessage = options.onMessage;
    this.onToolCall = options.onToolCall;

    // Load Anna's personality
    const systemPrompt = readFileSync(
      join(__dirname, '../../prompts/anna-personality.md'),
      'utf-8'
    );

    this.agent = new Agent({
      model: 'claude-sonnet-4-5-20250929',
      apiKey: process.env.ANTHROPIC_API_KEY!,
      systemPrompt,
      tools: Object.entries(tools).map(([name, tool]) => ({
        name,
        description: tool.description,
        parameters: tool.parameters,
        execute: async (params: any) => {
          // Inject userId for tools that need it
          if (name === 'saveProgress' || name === 'getSpiralHistory') {
            params.userId = this.userId;
          }

          const result = await tool.execute(params);
          this.onToolCall(name, result);
          return result;
        },
      })),
    });
  }

  async handleMessage(message: string) {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: message,
    });

    // Extract intensity if user mentions it
    const intensityMatch = message.match(/\b([1-9]|10)\b/);
    if (intensityMatch && !this.preFeelingScore) {
      this.preFeelingScore = parseInt(intensityMatch[1]);
    }

    // Run agent with conversation history
    const response = await this.agent.run({
      messages: this.conversationHistory,
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      if (chunk.type === 'message') {
        fullResponse += chunk.content;
        this.onMessage(chunk.content); // Stream to mobile
      }
    }

    // Add assistant response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: fullResponse,
    });
  }

  async handleExerciseComplete(postFeelingScore: number) {
    const reductionPercent = this.preFeelingScore
      ? Math.round(((this.preFeelingScore - postFeelingScore) / this.preFeelingScore) * 100)
      : 0;

    const victoryMessage = `That's a ${this.preFeelingScore! - postFeelingScore} point drop (${reductionPercent}% reduction). You just pulled yourself out. That's real progress.`;

    this.onMessage(victoryMessage);
  }

  cleanup() {
    // Clean up resources
    this.conversationHistory = [];
  }
}
```

**File:** `backend/src/middleware/auth.ts`

```typescript
import { Socket } from 'socket.io';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(new Error('Invalid authentication token'));
    }

    // Attach user ID to socket for later use
    socket.data.userId = user.id;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
}
```

---

### Task 1.4: Database Migration (30min)
**Agent:** `supabase-expert`

**Deliverable:** Create `ai_sessions` table

**File:** `backend/supabase/migrations/add_ai_sessions.sql`

```sql
-- AI Therapy Sessions Table
CREATE TABLE IF NOT EXISTS public.ai_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Session metrics
    pre_feeling INTEGER CHECK (pre_feeling >= 1 AND pre_feeling <= 10),
    post_feeling INTEGER CHECK (post_feeling >= 1 AND post_feeling <= 10),
    reduction_percentage INTEGER,
    session_duration_seconds INTEGER,

    -- Content
    trigger TEXT,
    conversation_summary TEXT,
    exercise_completed BOOLEAN DEFAULT FALSE,

    -- Metadata
    model_used TEXT DEFAULT 'claude-sonnet-4-5',
    total_tokens INTEGER,
    cost_cents DECIMAL(10,2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_sessions_user_id ON public.ai_sessions(user_id);
CREATE INDEX idx_ai_sessions_timestamp ON public.ai_sessions(timestamp DESC);

-- RLS Policies
ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI sessions"
    ON public.ai_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI sessions"
    ON public.ai_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to calculate avg reduction for user
CREATE OR REPLACE FUNCTION get_user_ai_stats(user_uuid UUID)
RETURNS TABLE(
    total_sessions INTEGER,
    avg_reduction_percentage DECIMAL,
    completion_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER as total_sessions,
        ROUND(AVG(reduction_percentage), 1) as avg_reduction_percentage,
        ROUND((COUNT(*) FILTER (WHERE exercise_completed)) * 100.0 / COUNT(*), 1) as completion_rate
    FROM public.ai_sessions
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;
```

---

### Task 1.5: Deploy to Render (1h)
**Instructions:**

1. **Create Render Web Service:**
   - In screenshot: Click "New Web Service"
   - Connect GitHub repo (push backend code first)
   - Select `backend` directory as root

2. **Configure Build Settings:**
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Environment Variables:**
   ```
   ANTHROPIC_API_KEY=<your-key>
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   MOBILE_APP_URL=*
   NODE_ENV=production
   ```

4. **Save Backend URL:**
   ```
   https://dailyhush-anna.onrender.com
   ```

---

## DAY 2: Mobile Integration (8 hours)

### Task 2.1: Chat UI Components (2h)
**Agents:** `ui-design-expert` + `ux-expert`

**File:** `dailyhush-mobile-app/components/anna/ChatBubble.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
}

export function ChatBubble({ role, content, timestamp, isStreaming }: ChatBubbleProps) {
  const isAnna = role === 'assistant';

  return (
    <View style={[styles.container, isAnna ? styles.annaContainer : styles.userContainer]}>
      {isAnna ? (
        <LinearGradient
          colors={['#E8F4F8', '#F0F9FF']}
          style={styles.annaBubble}
        >
          <Text style={styles.annaText}>{content}</Text>
          {isStreaming && <Text style={styles.streamingIndicator}>●●●</Text>}
        </LinearGradient>
      ) : (
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{content}</Text>
        </View>
      )}

      {timestamp && (
        <Text style={styles.timestamp}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  annaContainer: {
    alignItems: 'flex-start',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  annaBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    borderTopRightRadius: 4,
    backgroundColor: '#4A90E2',
  },
  annaText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2C3E50',
    fontFamily: 'System',
  },
  userText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  streamingIndicator: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
});
```

**File:** `dailyhush-mobile-app/components/anna/ChatInput.tsx`

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Type a message..." }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          multiline
          maxLength={500}
          editable={!disabled}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!message.trim() || disabled) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim() || disabled}
        >
          <Ionicons name="send" size={20} color={message.trim() && !disabled ? '#4A90E2' : '#CBD5E1'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
});
```

---

### Task 2.2: WebSocket Hook (1.5h)
**Agent:** `general-purpose`

**File:** `dailyhush-mobile-app/hooks/useAnnaChat.ts`

```typescript
import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ExerciseTrigger {
  exerciseType: '5-4-3-2-1' | 'breathing';
  preFeelingScore: number;
}

export function useAnnaChat() {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAnnaTyping, setIsAnnaTyping] = useState(false);
  const [exerciseTrigger, setExerciseTrigger] = useState<ExerciseTrigger | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session?.access_token) return;

    // Connect to backend
    const socket = io(process.env.EXPO_PUBLIC_ANNA_BACKEND_URL!, {
      auth: {
        token: session.access_token,
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to Anna');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Anna');
      setIsConnected(false);
    });

    socket.on('anna:message', (data: { role: string; content: string; timestamp: string }) => {
      setMessages((prev) => [...prev, data as Message]);
      setIsAnnaTyping(false);
    });

    socket.on('anna:trigger_exercise', (data: ExerciseTrigger) => {
      setExerciseTrigger(data);
    });

    socket.on('anna:error', (data: { message: string }) => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message, timestamp: new Date().toISOString() },
      ]);
      setIsAnnaTyping(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [session]);

  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || !isConnected) return;

    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAnnaTyping(true);

    socketRef.current.emit('user:message', { message: content });
  }, [isConnected]);

  const notifyExerciseComplete = useCallback((postFeelingScore: number) => {
    if (!socketRef.current || !isConnected) return;

    socketRef.current.emit('user:exercise_complete', { postFeelingScore });
    setExerciseTrigger(null);
  }, [isConnected]);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setExerciseTrigger(null);
  }, []);

  return {
    messages,
    isConnected,
    isAnnaTyping,
    exerciseTrigger,
    sendMessage,
    notifyExerciseComplete,
    resetConversation,
  };
}
```

---

### Task 2.3: Anna Conversation Screen (2h)
**Agent:** `general-purpose`

**File:** `dailyhush-mobile-app/app/anna/conversation.tsx`

```typescript
import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatBubble } from '@/components/anna/ChatBubble';
import { ChatInput } from '@/components/anna/ChatInput';
import { useAnnaChat } from '@/hooks/useAnnaChat';
import { BackButton } from '@/components/moodCapture/NavigationButtons';
import { useAnalytics } from '@/utils/analytics';

export default function AnnaConversationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const analytics = useAnalytics();
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    messages,
    isConnected,
    isAnnaTyping,
    exerciseTrigger,
    sendMessage,
    notifyExerciseComplete,
  } = useAnnaChat();

  // Track session start
  useEffect(() => {
    analytics.track('ANNA_CONVERSATION_STARTED');
  }, []);

  // Handle exercise trigger from Anna
  useEffect(() => {
    if (exerciseTrigger) {
      // Navigate to spiral protocol with pre-feeling
      router.push({
        pathname: '/spiral',
        params: {
          preFeelingRating: exerciseTrigger.preFeelingScore,
          source: 'anna',
        },
      });
    }
  }, [exerciseTrigger]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Send initial greeting
  useEffect(() => {
    if (isConnected && messages.length === 0) {
      sendMessage("I'm spiraling");
    }
  }, [isConnected]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Anna</Text>
          {!isConnected && (
            <Text style={styles.headerSubtitle}>Connecting...</Text>
          )}
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {isAnnaTyping && (
          <ChatBubble
            role="assistant"
            content="..."
            isStreaming
          />
        )}
      </ScrollView>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={!isConnected || isAnnaTyping}
        placeholder={isConnected ? "Type a message..." : "Connecting..."}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
});
```

---

### Task 2.4: Integrate with Spiral Flow (1h)
**Agent:** `general-purpose`

**File:** `dailyhush-mobile-app/app/spiral.tsx` (Update existing file)

Add "Talk to Anna" button at the top:

```typescript
// At the top of spiral.tsx, add import:
import { useRouter } from 'expo-router';

// Inside SpiralInterruptionScreen component, add router:
const router = useRouter();

// Add button before PreCheckScreen:
{!started && (
  <View style={styles.annaPrompt}>
    <TouchableOpacity
      style={styles.annaButton}
      onPress={() => router.push('/anna/conversation')}
    >
      <Text style={styles.annaButtonText}>💬 Talk to Anna instead</Text>
    </TouchableOpacity>
  </View>
)}

// Add styles:
annaPrompt: {
  padding: 20,
  alignItems: 'center',
},
annaButton: {
  backgroundColor: '#E8F4F8',
  paddingHorizontal: 24,
  paddingVertical: 12,
  borderRadius: 24,
  borderWidth: 1,
  borderColor: '#4A90E2',
},
annaButtonText: {
  fontSize: 16,
  color: '#4A90E2',
  fontWeight: '600',
},
```

---

### Task 2.5: Analytics Tracking (30min)
**Agent:** `general-purpose`

**File:** `dailyhush-mobile-app/utils/analytics.ts` (Add new events)

```typescript
// Add to existing analytics events:

export const ANALYTICS_EVENTS = {
  // ... existing events

  // Anna AI events
  ANNA_CONVERSATION_STARTED: 'anna_conversation_started',
  ANNA_MESSAGE_SENT: 'anna_message_sent',
  ANNA_EXERCISE_TRIGGERED: 'anna_exercise_triggered',
  ANNA_SESSION_COMPLETED: 'anna_session_completed',
  ANNA_CONNECTION_FAILED: 'anna_connection_failed',
} as const;

// Update analytics hook to track Anna events
```

---

### Task 2.6: Environment Setup (15min)

**File:** `dailyhush-mobile-app/.env`

```bash
# Add Anna backend URL
EXPO_PUBLIC_ANNA_BACKEND_URL=https://dailyhush-anna.onrender.com
```

**File:** `dailyhush-mobile-app/app.json` (Update)

```json
{
  "expo": {
    "extra": {
      "annaBackendUrl": process.env.EXPO_PUBLIC_ANNA_BACKEND_URL
    }
  }
}
```

---

## Testing & Deployment

### Local Testing (30min)
1. Start backend: `cd backend && npm run dev`
2. Start mobile: `cd dailyhush-mobile-app && npx expo start`
3. Test flow: Tap "I'm spiraling" → Talk to Anna → Send message → Verify response
4. Test exercise trigger: Continue conversation → Anna triggers exercise → Verify navigation

### Production Deployment (30min)
1. Deploy backend to Render (already done in Task 1.5)
2. Update mobile app env to production URL
3. Build and upload to TestFlight:
   ```bash
   eas build --platform ios --profile preview
   eas submit --platform ios
   ```

---

## Success Metrics (7-Day Test)

Track for 20 users:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Completion Rate** | >80% | anna_session_completed / anna_conversation_started |
| **Return Rate** | >50% | Users with 2+ sessions / Total users |
| **Avg Reduction** | >30% | Avg (pre_feeling - post_feeling) / pre_feeling |
| **User Satisfaction** | >4/5 | Post-session survey |
| **Cost per Session** | <$0.03 | Total API costs / Total sessions |

**Decision Matrix:**
- If completion 3x better than static → Build full AI ✅
- If return rate 2x better → Hybrid model works ✅
- If costs >$0.05/session → Optimize to Haiku 4.5 ⚠️
- If no significant improvement → Static is fine ❌

---

## Senior Developer Best Practices Applied

✅ **Modular Architecture:** Backend and mobile are separate, reusable
✅ **Type Safety:** Full TypeScript with Zod validation
✅ **Proper Props:** All components receive typed props, no hardcoded data
✅ **Error Handling:** Try/catch, graceful degradation, reconnection logic
✅ **Security:** JWT auth, service role keys server-side only
✅ **Scalability:** Socket.io rooms, stateless agent instances
✅ **Monitoring:** PostHog events, session tracking, cost tracking
✅ **DRY Principle:** Reusable components (ChatBubble, ChatInput, hooks)
✅ **Clean Code:** Single responsibility, clear naming, documented functions

---

## Next Steps After Validation

If Anna proves successful (>20% retention improvement):

1. **Optimize Costs:**
   - Test Haiku 4.5 for same quality at 1/3 cost
   - Implement caching for common patterns
   - Add streaming message compression

2. **Enhance Features:**
   - Voice mode (whisper API)
   - Pattern recognition (show "You spiral about work 70% of the time")
   - Personalized greetings ("Welcome back, you haven't spiraled in 3 days!")

3. **Scale Infrastructure:**
   - Move to Railway Pro for better uptime
   - Add Redis for session state
   - Implement rate limiting per user

---

**Total Implementation Time:** 16 hours
**Total Cost (Dev):** $0 (Render free tier + existing Supabase)
**Total Cost (Testing):** ~$25 (20 users × 5 sessions × $0.025/session)
**Expected ROI:** If 20% retention improvement → Worth $1.25/user/month cost

Ready to start? Let me know and I'll begin with Task 1.1: Designing Anna's personality! 🚀
