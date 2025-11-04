# Anna AI - Complete User Flow
## From "I'm Spiraling" Click to Victory

---

## Option 1: Direct Protocol (Current)

```
[Home Screen]
    ↓ User clicks "I'm spiraling" button
[Pre-Check Screen]
    → Feeling scale: 1 (struggling) / 3 (anxious) / 5 (okay) / 7 (calm)
    ↓ User selects intensity
[90-Second Protocol]
    → 12 static prompts
    → 5-4-3-2-1 grounding
    → Breathing exercises
    ↓ Protocol completes
[Post-Check Screen]
    → Same feeling scale
    → Shows improvement
    ↓ Optional
[Trigger Selection]
    → Select what caused spiral
    ↓
[Home Screen]
```

**Problem:** No human connection, feels clinical

---

## Option 2: Talk to Anna (NEW)

```
[Home Screen]
    ↓ User clicks "I'm spiraling" button
[Choice Screen] ⭐ NEW
    ┌─────────────────────────┐
    │  How do you want help?  │
    │                         │
    │  [💬 Talk to Anna]      │ ← Main CTA (larger, top)
    │                         │
    │  [⚡ Quick Protocol]    │ ← Secondary (smaller, below)
    └─────────────────────────┘
```

---

### Path A: User Chooses "Talk to Anna"

```
[Choice Screen]
    ↓ User taps "💬 Talk to Anna"
[Connecting Screen]
    → Shows "Connecting to Anna..."
    → Establishes WebSocket
    ↓ (2-3 seconds)
[Anna Conversation Screen]
    ┌──────────────────────────────────┐
    │  ← Anna                          │
    │                                  │
    │  ╭─────────────────────╮         │
    │  │ Hi. What's got you  │         │ ← Anna's first message
    │  │ stuck right now?    │         │   (auto-appears)
    │  ╰─────────────────────╯         │
    │                                  │
    │                                  │
    │  [Type a message...]      [→]   │
    └──────────────────────────────────┘

    ↓ User types: "I can't stop thinking about what I said at work"

    ┌──────────────────────────────────┐
    │  ← Anna                          │
    │                                  │
    │  ╭─────────────────────╮         │
    │  │ Hi. What's got you  │         │
    │  │ stuck right now?    │         │
    │  ╰─────────────────────╯         │
    │                                  │
    │           ╭──────────────────╮   │
    │           │ I can't stop     │   │ ← User's message
    │           │ thinking about   │   │
    │           │ what I said at   │   │
    │           │ work             │   │
    │           ╰──────────────────╯   │
    │                                  │
    │  ╭─────────────────────╮         │
    │  │ That sounds really  │         │ ← Anna validates
    │  │ tough. Replaying    │         │   (streams in
    │  │ conversations can   │         │    word by word)
    │  │ feel endless.       │         │
    │  │                     │         │
    │  │ How intense is it   │         │
    │  │ feeling right now,  │         │
    │  │ 1-10?               │         │
    │  ╰─────────────────────╯         │
    │                                  │
    │  [Type a message...]      [→]   │
    └──────────────────────────────────┘

    ↓ User types: "8"

    ┌──────────────────────────────────┐
    │  ← Anna                          │
    │                                  │
    │  [Previous messages scroll up]   │
    │                                  │
    │           ╭──────────────────╮   │
    │           │ 8                │   │
    │           ╰──────────────────╯   │
    │                                  │
    │  ╭─────────────────────╮         │
    │  │ 8 is really high.   │         │ ← Anna assesses
    │  │ I'm going to guide  │         │   & decides to
    │  │ you through         │         │   trigger exercise
    │  │ something that can  │         │
    │  │ help. It'll take    │         │
    │  │ about 3 minutes.    │         │
    │  │ Ready?              │         │
    │  ╰─────────────────────╯         │
    │                                  │
    │  [Type a message...]      [→]   │
    └──────────────────────────────────┘

    ↓ User types: "yes" or "ok"

[Anna Conversation Screen]
    ╭─────────────────────╮
    │ Perfect. Starting   │ ← Anna confirms
    │ the exercise now... │   then TRIGGERS
    ╰─────────────────────╯   the protocol

    ↓ (Anna calls triggerExercise() tool)
    ↓ WebSocket sends event to mobile app

[Transition Animation] ⭐ NEW
    → Screen fade/slide transition
    → Shows "Anna's guiding you through this..."
    ↓

[5-4-3-2-1 Protocol Screen]
    ┌──────────────────────────────────┐
    │  Anna's Exercise                 │
    │  ━━━━━━━━ 1/12                   │
    │                                  │
    │  Look around and tell me:        │
    │  5 things you can see            │
    │                                  │
    │  [ Type your answer... ]   [→]  │
    └──────────────────────────────────┘

    ↓ User completes 5-4-3-2-1 grounding
    ↓ Then breathing exercises
    ↓ Protocol finishes (~3 minutes)

[Protocol Complete]
    → Shows completion animation
    ↓ Asks for post-feeling score

[Post-Check Screen]
    ┌──────────────────────────────────┐
    │  How are you feeling now?        │
    │                                  │
    │  😰    😟    😐    😊            │
    │  1     3     5     7             │
    │        ▲ (user taps)             │
    └──────────────────────────────────┘

    ↓ User selects: 5 (down from 8)
    ↓ Mobile app sends to backend via WebSocket

[Return to Anna] ⭐ NEW
    → Auto-navigates back to conversation
    ↓

[Anna Conversation Screen]
    ┌──────────────────────────────────┐
    │  ← Anna                          │
    │                                  │
    │  [Previous messages]             │
    │                                  │
    │  ╭─────────────────────╮         │
    │  │ That's a 3 point    │         │ ← Anna celebrates
    │  │ drop (38% reduction)│         │   the win with
    │  │                     │         │   COUNTERFACTUAL
    │  │ You just avoided    │         │
    │  │ ~45 minutes of      │         │
    │  │ spiraling about what│         │
    │  │ you said at work.   │         │
    │  │                     │         │
    │  │ You reclaimed your  │         │
    │  │ afternoon. That's   │         │
    │  │ real progress. 🎯   │         │
    │  ╰─────────────────────╯         │
    │                                  │
    │  [Close]                         │ ← User can close
    └──────────────────────────────────┘

    ↓ User taps Close

[Home Screen]
    → Shows "Last spiral interrupted: Just now"
    → Badge unlocked: "First successful interruption"
```

---

### Path B: User Chooses "Quick Protocol"

```
[Choice Screen]
    ↓ User taps "⚡ Quick Protocol"
[Pre-Check Screen]
    → Same as current flow
    → Goes straight to 90-second protocol
    → No AI conversation
```

---

## Key UX Improvements

### 1. **Choice Empowerment**
User decides if they want connection (Anna) or speed (protocol).

**Why it works:**
- Respects user autonomy
- Accommodates different needs
- Reduces pressure ("I don't feel like talking today")

### 2. **Anna Feels Human**
- Streaming text (appears word-by-word like typing)
- Natural conversation flow (not a chatbot script)
- Validates feelings before jumping to solutions
- Uses contractions ("that's", "I'm") not formal language

### 3. **Seamless Exercise Trigger**
Anna doesn't say "now type /start exercise"—she just transitions naturally:
> "Perfect. Starting the exercise now..."

Then the mobile app receives WebSocket event and navigates automatically.

### 4. **Counterfactual Victory**
After protocol, Anna doesn't just say "good job"—she shows what they avoided:
> "You just avoided ~45 minutes of spiraling about what you said at work. You reclaimed your afternoon."

**This makes invisible victories visible** (Peter's key insight).

---

## Mobile App Screen Hierarchy

```
app/
├── index.tsx (Home)
│   └── "I'm spiraling" button
│
├── spiral-choice.tsx ⭐ NEW
│   ├── "Talk to Anna" button → /anna/conversation
│   └── "Quick Protocol" button → /spiral
│
├── anna/
│   └── conversation.tsx ⭐ NEW
│       ├── Chat interface
│       ├── WebSocket connection
│       └── Listens for triggerExercise event
│           → Navigates to /spiral with params
│
└── spiral.tsx (Existing)
    ├── Receives params from Anna (preFeelingScore, source)
    ├── Runs 5-4-3-2-1 protocol
    ├── Gets postFeelingScore
    └── If source="anna" → Navigate back to /anna/conversation
       Else → Navigate to home
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  Mobile App     │
│  (React Native) │
└────────┬────────┘
         │
         │ WebSocket (Socket.io)
         │ Auth: Supabase JWT
         │
         ↓
┌─────────────────────┐
│  Render Backend     │
│  (Node.js)          │
│                     │
│  ┌──────────────┐   │
│  │ Anna Agent   │   │
│  │ (Claude SDK) │───┼─→ Anthropic API
│  └──────────────┘   │   (Claude Sonnet 4.5)
│         │            │
│         ↓            │
│  ┌──────────────┐   │
│  │ Agent Tools  │   │
│  │ • triggerExercise│
│  │ • saveProgress  │
│  │ • getHistory    │───┼─→ Supabase Database
│  └──────────────┘   │   (ai_sessions table)
└─────────────────────┘
```

---

## What Changes in Existing Code

### Minimal Changes to Existing Files:

1. **`app/spiral.tsx`** (1 small change)
   - Add "Talk to Anna" button at the top
   - Accept `source` param to know if coming from Anna
   - If source="anna", navigate back to conversation after completion

2. **`supabase/schema.sql`** (1 new table)
   - Add `ai_sessions` table
   - No changes to existing tables

3. **`utils/analytics.ts`** (Add events)
   - Add Anna-specific tracking events

### New Files to Create:

1. **`app/spiral-choice.tsx`** - Choice screen
2. **`app/anna/conversation.tsx`** - Chat interface
3. **`components/anna/ChatBubble.tsx`** - Reusable bubble
4. **`components/anna/ChatInput.tsx`** - Reusable input
5. **`hooks/useAnnaChat.ts`** - WebSocket logic
6. **Entire backend folder** - Node.js + Claude SDK

---

## Why This Flow Works

### Psychological Benefits:
1. **Human Connection:** Talking to Anna fulfills need to be heard
2. **Autonomy:** User chooses their path (talk vs quick)
3. **Validation:** Anna acknowledges difficulty before solving
4. **Visible Progress:** Counterfactual shows concrete win

### Technical Benefits:
1. **Non-invasive:** Existing flow still works (quick protocol)
2. **Modular:** Anna is separate feature, can toggle on/off
3. **Scalable:** WebSocket handles real-time, no polling
4. **Measurable:** Can A/B test Anna vs static completion rates

### Business Benefits:
1. **Retention:** Users come back because Anna knows them
2. **Differentiation:** No other spiral app has conversational AI
3. **Data Goldmine:** Learn what triggers spiral most (anonymized)
4. **Upgrade Path:** Premium users get unlimited Anna sessions

---

## Alternative Flows (Future Iterations)

### If User Has Pattern:
```
User: "I'm spiraling again"
Anna: "Welcome back. Work stuff again? That's 3 this week."
      ↓ Shows pattern recognition
      "Want to try the 2-minute version since you know the drill?"
      ↓ Offers fast-track for experienced users
```

### If User Improved Quickly:
```
Anna: "That's a 6-point drop in 3 minutes. You're getting really good at this."
      ↓ Builds self-efficacy
      "What do you think made it work so fast this time?"
      ↓ Helps user internalize their own power
```

### If User Didn't Improve:
```
Anna: "Still at an 8. That's okay—sometimes it takes longer."
      "Want to try the breathing exercise for another minute?"
      ↓ Offers extension without judgment
      "Or we can just talk for a bit?"
      ↓ Flexibility shows it's not a rigid protocol
```

---

## Comparison: Static vs Anna

| Aspect | Static Protocol | With Anna |
|--------|----------------|-----------|
| **Time** | 90 seconds | 5-8 minutes (talk + exercise) |
| **Feels like** | Following instructions | Talking to a friend |
| **Personalization** | None | Remembers patterns, adapts tone |
| **Victory moment** | "Good job" | "You avoided 45 min of spiraling" |
| **Return likelihood** | Low (no relationship) | High (Anna knows them) |
| **Cost** | $0 | ~$0.025/session |

---

Ready to build this? Should I start with:
1. Creating the backend (Anna's brain)
2. Creating the mobile UI (chat interface)
3. Or both in parallel with agents?

Let me know! 🚀
