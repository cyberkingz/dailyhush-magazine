# Agent Delegation Plan - Anna AI Implementation

## Available Agents & Their Responsibilities

### 🎨 **ui-design-expert**
**Specialization:** Visual design, component architecture, design systems, interface patterns
**Tasks Assigned:**
1. Design ChatBubble component (colors, spacing, typography)
2. Design ChatInput component (keyboard handling, send button states)
3. Review conversation screen layout for accessibility
4. Ensure calming color palette for Anna's messages

**Deliverables:**
- `components/anna/ChatBubble.tsx` - Styled message bubbles
- `components/anna/ChatInput.tsx` - Keyboard-aware input field

---

### 🧠 **ux-expert**
**Specialization:** User experience, user research, information architecture, interaction design
**Tasks Assigned:**
1. Design spiral-choice screen UX flow (Talk vs Quick decision)
2. Validate conversation patterns for anxiety users
3. Review exercise trigger transition smoothness
4. Ensure victory message timing and impact

**Deliverables:**
- `app/spiral-choice.tsx` - Choice screen with proper mental model
- UX validation document for conversation flow

---

### 🗄️ **supabase-expert**
**Specialization:** Supabase database, migrations, RLS policies, performance optimization
**Tasks Assigned:**
1. Design `ai_sessions` table schema
2. Create migration file with proper indexes
3. Write RLS policies for user data isolation
4. Add helper function for user stats calculation

**Deliverables:**
- `backend/supabase/migrations/20250103_add_ai_sessions.sql`
- Performance-optimized indexes
- Secure RLS policies

---

### ✍️ **david-ogilvy-copywriter**
**Specialization:** Persuasive copywriting, brand voice, emotional resonance
**Tasks Assigned:**
1. Write Anna's complete personality system prompt
2. Create conversation templates for common scenarios
3. Design counterfactual victory message format
4. Ensure calming, non-clinical language patterns

**Deliverables:**
- `backend/prompts/anna-personality.md` - Complete system prompt
- `backend/prompts/conversation-templates.md` - Reusable patterns

---

### 🔧 **general-purpose**
**Specialization:** Full-stack development, multi-step tasks, complex implementations
**Tasks Assigned:**
1. Initialize Node.js backend project structure
2. Implement AnnaAgent class with Claude SDK
3. Build Express + Socket.io server with authentication
4. Create useAnnaChat React hook for WebSocket
5. Build conversation screen with streaming support
6. Update spiral.tsx for Anna integration
7. Add analytics tracking
8. End-to-end testing
9. Deployment to Render + TestFlight

**Deliverables:**
- Complete backend application
- Mobile integration code
- Testing and deployment

---

## Task Breakdown by Priority

### Priority 1: Foundation (Must Complete First)
```
1. [david-ogilvy-copywriter] Anna's personality prompt
2. [general-purpose] Node.js project initialization
3. [general-purpose] Agent tools definition
4. [supabase-expert] Database schema + migration
```

### Priority 2: Core Backend (Depends on P1)
```
5. [general-purpose] AnnaAgent class implementation
6. [general-purpose] Express + Socket.io server
7. [general-purpose] Authentication middleware
8. [general-purpose] Local testing with mock data
```

### Priority 3: Core Mobile (Can parallel with P2)
```
9. [ui-design-expert] ChatBubble component
10. [ui-design-expert] ChatInput component
11. [ux-expert] Spiral-choice screen
12. [general-purpose] useAnnaChat hook
```

### Priority 4: Integration (Depends on P2 + P3)
```
13. [general-purpose] Anna conversation screen
14. [general-purpose] Update spiral.tsx
15. [general-purpose] Analytics integration
```

### Priority 5: Testing & Deployment
```
16. [general-purpose] E2E testing
17. [general-purpose] Deploy to Render
18. [general-purpose] TestFlight build
```

---

## Senior Developer Best Practices Applied

### 1. Modular Architecture
```typescript
// ❌ BAD: Monolithic component
function AnnaScreen() {
  // 500 lines of WebSocket, UI, state, logic...
}

// ✅ GOOD: Separation of concerns
function AnnaConversationScreen() {
  const { messages, sendMessage } = useAnnaChat(); // State management
  return <ConversationView messages={messages} onSend={sendMessage} />; // UI
}
```

### 2. Type Safety
```typescript
// ❌ BAD: Any types
function sendMessage(msg: any) { }

// ✅ GOOD: Explicit types
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
function sendMessage(msg: Message): void { }
```

### 3. Prop Drilling vs Composition
```typescript
// ❌ BAD: Hardcoded values
<ChatBubble color="#E8F4F8" /> // What if we change brand colors?

// ✅ GOOD: Props with defaults
interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  theme?: 'light' | 'dark'; // Optional with default
}
<ChatBubble role="assistant" content={msg} theme="light" />
```

### 4. Environment Variables (No Hardcoding)
```typescript
// ❌ BAD: Hardcoded URL
const BACKEND_URL = 'https://dailyhush-anna.onrender.com';

// ✅ GOOD: Environment variable
const BACKEND_URL = process.env.EXPO_PUBLIC_ANNA_BACKEND_URL!;
if (!BACKEND_URL) throw new Error('ANNA_BACKEND_URL not configured');
```

### 5. Error Boundaries & Graceful Degradation
```typescript
// ❌ BAD: Crash on error
const data = await fetch(url).then(r => r.json());

// ✅ GOOD: Error handling
try {
  const data = await fetch(url).then(r => r.json());
  return data;
} catch (error) {
  console.error('Fetch failed:', error);
  return fallbackData; // Graceful degradation
}
```

### 6. Single Responsibility Principle
```typescript
// ❌ BAD: Component does everything
function ChatScreen() {
  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState([]);
  // WebSocket logic
  // Message formatting
  // UI rendering
  // Analytics tracking
}

// ✅ GOOD: Each piece has one job
// useAnnaChat.ts - WebSocket logic
// formatMessage.ts - Message formatting
// ChatScreen.tsx - UI rendering only
// analytics.ts - Tracking logic
```

### 7. Reusable Utilities
```typescript
// ❌ BAD: Duplicate logic everywhere
function Screen1() {
  const formatted = new Date(timestamp).toLocaleTimeString();
}
function Screen2() {
  const formatted = new Date(timestamp).toLocaleTimeString();
}

// ✅ GOOD: Shared utility
// utils/formatTime.ts
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

### 8. Proper TypeScript Configs
```json
// tsconfig.json - Strict mode
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## Implementation Order (2 Days)

### Day 1: Backend (8 hours)
```
Hour 1-2:   [david-ogilvy-copywriter] System prompt
            [general-purpose] Project init + tools
            [supabase-expert] Database schema

Hour 3-4:   [general-purpose] AnnaAgent class

Hour 5-6:   [general-purpose] Express + Socket.io server

Hour 7-8:   [general-purpose] Local testing + Render deployment
```

### Day 2: Mobile (8 hours)
```
Hour 1-2:   [ui-design-expert] ChatBubble + ChatInput
            [ux-expert] spiral-choice screen

Hour 3-4:   [general-purpose] useAnnaChat hook

Hour 5-6:   [general-purpose] Conversation screen + spiral.tsx updates

Hour 7-8:   [general-purpose] Analytics + E2E testing + TestFlight
```

---

## Code Style Guide

### Naming Conventions
```typescript
// Components: PascalCase
export function ChatBubble() {}

// Hooks: camelCase with 'use' prefix
export function useAnnaChat() {}

// Constants: UPPER_SNAKE_CASE
const MAX_MESSAGE_LENGTH = 500;

// Interfaces: PascalCase with 'I' prefix or Props suffix
interface ChatBubbleProps {}
interface IMessage {}

// Files: kebab-case for utilities, PascalCase for components
// chat-bubble.tsx (component)
// format-time.ts (utility)
```

### Import Organization
```typescript
// 1. External libraries
import React, { useState } from 'react';
import { View } from 'react-native';

// 2. Internal modules (absolute imports)
import { useAuth } from '@/contexts/AuthContext';
import { ChatBubble } from '@/components/anna/ChatBubble';

// 3. Relative imports
import { formatTime } from './utils';

// 4. Types
import type { Message } from '@/types';
```

### Component Structure
```typescript
// 1. Imports
import React from 'react';

// 2. Types/Interfaces
interface ComponentProps {
  prop1: string;
}

// 3. Component
export function Component({ prop1 }: ComponentProps) {
  // 3a. Hooks
  const [state, setState] = useState();

  // 3b. Derived state
  const computed = useMemo(() => transform(state), [state]);

  // 3c. Callbacks
  const handleClick = useCallback(() => {}, []);

  // 3d. Effects
  useEffect(() => {}, []);

  // 3e. Render
  return <View />;
}

// 4. Styles (at bottom)
const styles = StyleSheet.create({});
```

---

Ready to start implementation! Should I begin with:

**Option A: Sequential (Safer)**
Task 1 → Complete → Task 2 → Complete...

**Option B: Parallel (Faster)**
Launch multiple agents simultaneously for independent tasks

Which approach do you prefer?
