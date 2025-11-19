# Adaptive Protocol Implementation - Task Delegation Plan

## Complete Codebase Inventory & Agent Assignment

**Date:** November 5, 2025
**Status:** Ready for Implementation
**Approach:** Senior Developer Best Practices

---

## Table of Contents

1. [Complete Codebase Inventory](#complete-codebase-inventory)
2. [Available Specialized Agents](#available-specialized-agents)
3. [Task Delegation Matrix](#task-delegation-matrix)
4. [Implementation Phases](#implementation-phases)
5. [Component Reuse Strategy](#component-reuse-strategy)
6. [Best Practices Checklist](#best-practices-checklist)

---

## Complete Codebase Inventory

### 1. Existing Components (95 components)

#### Core UI Components (9)

- `Button.tsx` - Generic button (CAN REUSE)
- `Container.tsx` - Layout container (CAN REUSE)
- `ErrorBoundary.tsx` - Error handler (CAN REUSE)
- `MagmaLoader.tsx` - Loading animation (CAN REUSE)
- `PageHeader.tsx` - Page headers (CAN REUSE)
- `ProgressIndicator.tsx` - Progress bars (CAN REUSE - 2 versions!)
- `ScreenContent.tsx` - Screen wrapper (CAN REUSE)
- `ScrollFadeView.tsx` - Scroll effects (CAN REUSE)
- `TopBar.tsx` / `BottomNav.tsx` - Navigation (EXISTS)

#### UI Primitives (4)

- `components/ui/button.tsx` - Shadcn button (CAN REUSE)
- `components/ui/card.tsx` - Shadcn card (CAN REUSE)
- `components/ui/pill-button.tsx` - Pill style button (CAN REUSE)
- `components/ui/text.tsx` - Typography component (CAN REUSE)

#### Exercise Components (7)

- `exercises/AnxietyRatingDial.tsx` - **PERFECT FOR INTENSITY SELECTION** ⭐
- `exercises/BreathingAnimation.tsx` - Animation (CAN REUSE)
- `exercises/CompletionScreen.tsx` - Success screen (CAN REUSE)
- `exercises/ExerciseContainer.tsx` - Exercise wrapper (CAN REUSE)
- `exercises/InstructionsCard.tsx` - Instructions UI (CAN REUSE)
- `exercises/PrePostRatingCard.tsx` - **EXACTLY WHAT WE NEED** ⭐
- `exercises/TriggerLogCard.tsx` - **TRIGGER LOGGING** ⭐

#### Auth Components (3)

- `auth/AuthButton.tsx` - Styled button (CAN REUSE)
- `auth/AuthTextInput.tsx` - **TEXT INPUT COMPONENT** ⭐
- `auth/ErrorAlert.tsx` - Error display (CAN REUSE)

#### Profile Components (7)

- `profile/EmotionalWeather.tsx` - Mood visualization
- `profile/PatternInsightCard.tsx` - **INSIGHTS CARD** ⭐
- `profile/ProductCard.tsx` - Product display
- `profile/ProfileStats.tsx` - **STATS DISPLAY** ⭐
- `profile/ProfileTextInput.tsx` - Profile input
- `profile/LoopCharacteristics.tsx` - Pattern display
- `profile/LoopTypeHero.tsx` - Hero section

#### Mood Capture Components (10) - HIGHLY RELEVANT!

- `moodCapture/AutoSaveIndicator.tsx` - Auto-save UI
- `moodCapture/MoodCaptureBottomSheet.tsx` - Bottom sheet
- `moodCapture/NavigationButtons.tsx` - **NAV BUTTONS** ⭐
- `moodCapture/ProgressIndicator.tsx` - Progress UI
- `moodCapture/PromptChips.tsx` - **INTERACTIVE CHIPS** ⭐
- `moodCapture/VoiceToTextButton.tsx` - Voice input
- `moodCapture/steps/FreeWriting.tsx` - **TEXT INPUT STEP** ⭐
- `moodCapture/steps/GentleSuggestion.tsx` - Suggestion UI
- `moodCapture/steps/IntensityScale.tsx` - **SCALE COMPONENT** ⭐
- `moodCapture/steps/MoodSelector.tsx` - **SELECTOR COMPONENT** ⭐

#### Training Components (7)

- `training/ContentCard.tsx` - Content display (CAN REUSE)
- `training/InteractiveExercise.tsx` - **INTERACTIVE COMPONENT** ⭐
- `training/KeyTakeaway.tsx` - Takeaway display
- `training/ModuleComplete.tsx` - Completion UI (CAN REUSE)
- `training/ProgressIndicator.tsx` - Progress UI (DUPLICATE?)
- `training/QuizQuestion.tsx` - Quiz UI

#### Paywall/Subscription Components (11)

- `paywall/*` - 6 paywall components
- `subscription/*` - 5 subscription components
- `LoopSpecificPaywall.tsx`, `TrialExpiredPaywall.tsx`, `PremiumCard.tsx`

#### Other Components

- `BackgroundPattern.tsx`, `CountdownRing.tsx`, `CrisisSupport.tsx`
- `QuoteCard.tsx`, `QuoteGem.tsx`, `SplashScreen.tsx`
- `SuccessRipple.tsx` - **SUCCESS ANIMATION** ⭐
- `TipCard.tsx`, `TropicalLeaf.tsx`

---

### 2. Existing Screens (55 screens)

#### Core Flow Screens

- `app/index.tsx` - Home
- `app/spiral.tsx` - **MAIN SPIRAL SCREEN (1,475 LINES!)** 🎯
- `app/history.tsx` - History
- `app/insights.tsx` - Insights (basic)
- `app/profile/index.tsx` - Profile
- `app/settings.tsx` - Settings

#### Auth Screens (4)

- `auth/index.tsx`, `auth/login.tsx`, `auth/signup.tsx`, `auth/forgot-password.tsx`

#### Onboarding Screens (8)

- `onboarding/index.tsx`, `onboarding/email-lookup.tsx`
- `onboarding/password-setup.tsx`, `onboarding/profile-setup.tsx`
- `onboarding/quiz-recognition.tsx`
- `onboarding/quiz/index.tsx`, `onboarding/quiz/paywall.tsx`
- `onboarding/quiz/results.tsx`, `onboarding/quiz/signup.tsx`

#### Mood Capture Flow (5)

- `mood-capture/_layout.tsx`, `mood-capture/mood.tsx`
- `mood-capture/intensity.tsx`, `mood-capture/suggestion.tsx`
- `mood-capture/writing.tsx`

#### Training/Modules (5)

- `training/index.tsx`, `training/focus.tsx`, `training/interrupt.tsx`
- `training/reframe.tsx`, `training/execute.tsx`
- `modules/index.tsx`, `modules/[moduleId]/method.tsx`

#### Exercise Screens (6)

- `exercises/brain-dump.tsx`, `exercises/breathing.tsx`
- `exercises/cyclic-sigh.tsx`, `exercises/emotion-wheel.tsx`
- `exercises/grounding.tsx`, `exercises/mind-clear.tsx`

#### Other Screens

- `anna/conversation.tsx`, `shift-pairing.tsx`
- `subscription.tsx`, `trial-expired.tsx`, `payment-failed.tsx`
- `settings/subscription.tsx`, `settings/delete-account.tsx`
- `legal/privacy.tsx`, `legal/terms.tsx`, `faq.tsx`

---

### 3. Existing Services (7 services)

- `services/analytics.ts` - Analytics tracking (PostHog)
- `services/auth.ts` - Authentication (Supabase auth)
- `services/insights.ts` - User insights generation
- `services/notifications.ts` - Push notifications
- `services/productsService.ts` - Product data
- `services/profileService.ts` - Profile API
- `services/training.ts` - Training module logic

**MISSING:** `adaptiveProtocol.ts`, `patternDetection.ts`

---

### 4. Existing Hooks (11 hooks)

- `useAnnaChat.ts` - AI chat integration
- `useAudio.ts` - Audio playback (CAN REUSE)
- `useAuthSync.ts` - Auth synchronization
- `useAutoSave.ts` - Auto-save functionality (CAN REUSE)
- `useExerciseSession.ts` - Exercise tracking
- `useExerciseTracking.ts` - Exercise analytics
- `useMoodCapture.ts` - Mood capture flow
- `useShiftBluetooth.ts` - Bluetooth device
- `useSpiral.ts` - **SPIRAL LOGGING** (ENHANCE THIS!)
- `useTrialGuard.ts` - Trial management
- `useVoiceToText.ts` - Voice input

**MISSING:** `useAdaptiveProtocol.ts`

---

### 5. Existing Utils (12 utils)

- `utils/analytics.ts` - Analytics helpers
- `utils/debounce.ts` - Debounce utility (CAN REUSE)
- `utils/quizScoring.ts` - Quiz logic
- `utils/retry.ts` - **RETRY LOGIC (CAN REUSE)** ⭐
- `utils/revenueCat.ts` - Payment handling
- `utils/subscription.ts` - Subscription helpers
- `utils/supabase.ts` - Database client
- `utils/trialManager.ts` - Trial logic
- `utils/supabase/exercise-logs.ts` - Exercise DB operations

**MISSING:** None needed for adaptive protocol

---

### 6. Existing Constants (28 constant files!)

Key constants:

- `constants/colors.ts` - Color system (USE THIS)
- `constants/design-tokens.ts` - Design tokens (USE THIS)
- `constants/exerciseConfigs.ts` - Exercise configs
- `constants/loopTypes.ts` - Loop type definitions
- `constants/moodOptions.ts` - Mood options
- `constants/routes.ts` - App routes
- `constants/spacing.ts` - Spacing system (USE THIS)
- `constants/theme.ts` - Theme config
- `constants/typography.ts` - Typography system (USE THIS)

**NEED TO CREATE:** `constants/techniqueLibrary.ts`

---

### 7. Existing Types (7 type files)

- `types/index.ts` - Main types
- `types/exercises.ts` - Exercise types
- `types/exercise-logs.ts` - Exercise log types
- `types/mood-database.ts` - Mood DB types
- `types/mood-entries.ts` - Mood entry types
- `types/supabase.ts` - **AUTO-GENERATED SUPABASE TYPES** ⭐

**NEED TO ADD:** Protocol types to `types/index.ts`

---

## Available Specialized Agents

### Relevant Agents for This Project

#### 1. **supabase-expert** (PRIMARY)

**Best for:**

- Database schema design
- SQL migrations
- RPC functions
- Database triggers
- Row Level Security (RLS)

**Assign to:**

- ✅ Database migration for adaptive protocols
- ✅ Supabase RPC function creation
- ✅ Pattern detection queries
- ✅ Stats calculation functions

#### 2. **ui-design-expert**

**Best for:**

- Component architecture
- Design systems
- Visual consistency
- Accessibility
- Modern UI patterns

**Assign to:**

- ✅ Interactive step component design
- ✅ Protocol intelligence screen layout
- ✅ Technique selection UI
- ✅ Component composition strategy

#### 3. **ux-expert**

**Best for:**

- User flows
- Information architecture
- Usability patterns
- User research
- Interaction design

**Assign to:**

- ✅ Adaptive selection flow UX
- ✅ Interactive step UX patterns
- ✅ Insights screen information architecture
- ✅ Pause & Reflect modal UX

#### 4. **general-purpose**

**Best for:**

- TypeScript coding
- Service layer implementation
- Hook development
- General refactoring

**Assign to:**

- ✅ Service implementation (adaptiveProtocol.ts)
- ✅ Hook implementation (useAdaptiveProtocol.ts)
- ✅ Integration with spiral.tsx
- ✅ Testing and bug fixes

---

## Task Delegation Matrix

### Phase 1: Database Foundation (Week 1, Days 1-3)

| Task                                               | Agent               | Deliverables                                | Dependencies     |
| -------------------------------------------------- | ------------------- | ------------------------------------------- | ---------------- |
| Create database schema for technique effectiveness | **supabase-expert** | `20251106_adaptive_protocols.sql` migration | None             |
| Create auto-update trigger function                | **supabase-expert** | `update_technique_stats()` SQL function     | Schema migration |
| Test migration locally                             | **supabase-expert** | Verified migration script                   | Functions        |
| Create TypeScript types for protocols              | **general-purpose** | Updated `types/index.ts`                    | None             |

**User Action Required:**

```bash
# After supabase-expert creates migration
Ask Supabase agent to run MCP:
"Run migration: dailyhush-mobile-app/supabase/migrations/20251106_adaptive_protocols.sql"
```

---

### Phase 2: Technique Library (Week 1, Days 4-5)

| Task                               | Agent                | Deliverables                    | Dependencies     |
| ---------------------------------- | -------------------- | ------------------------------- | ---------------- |
| Design technique library structure | **ui-design-expert** | Architecture document           | None             |
| Create technique library constant  | **general-purpose**  | `constants/techniqueLibrary.ts` | Type definitions |
| Review for design consistency      | **ui-design-expert** | Approved library                | Library file     |

**Reuse Existing:**

- ✅ Use `constants/exerciseConfigs.ts` as pattern
- ✅ Follow `constants/moodOptions.ts` structure
- ✅ Import from `constants/design-tokens.ts`

---

### Phase 3: Adaptive Selection Algorithm (Week 1, Days 6-7)

| Task                                  | Agent               | Deliverables                            | Dependencies                 |
| ------------------------------------- | ------------------- | --------------------------------------- | ---------------------------- |
| Create `services/adaptiveProtocol.ts` | **general-purpose** | Service with `selectAdaptiveProtocol()` | Technique library, DB schema |
| Implement scoring algorithm           | **general-purpose** | `scoreTechnique()` function             | Service file                 |
| Create `recordProtocolOutcome()`      | **general-purpose** | Outcome logging function                | Service file                 |
| Add error handling with retry         | **general-purpose** | Wrapped with `utils/retry.ts`           | Service complete             |

**Reuse Existing:**

- ✅ Import `utils/retry.ts` for error handling
- ✅ Import `utils/supabase.ts` for DB client
- ✅ Follow pattern from `services/profileService.ts`

---

### Phase 4: Pattern Detection Service (Week 2, Days 8-9)

| Task                                  | Agent               | Deliverables              | Dependencies |
| ------------------------------------- | ------------------- | ------------------------- | ------------ |
| Create `services/patternDetection.ts` | **general-purpose** | Pattern detection service | DB schema    |
| Implement `getPeakSpiralTime()`       | **general-purpose** | Peak time calculation     | Service file |
| Implement `getMostCommonTrigger()`    | **general-purpose** | Trigger analysis          | Service file |
| Implement `getTechniqueRankings()`    | **general-purpose** | Ranking calculation       | Service file |

**Reuse Existing:**

- ✅ Follow pattern from `services/insights.ts`
- ✅ Use `utils/supabase.ts` for queries

---

### Phase 5: Interactive Step Component (Week 2, Days 10-11)

| Task                                                  | Agent                | Deliverables       | Dependencies |
| ----------------------------------------------------- | -------------------- | ------------------ | ------------ |
| Design interactive input UX                           | **ux-expert**        | UX specification   | None         |
| Design visual component                               | **ui-design-expert** | Component spec     | UX spec      |
| Create `components/protocol/InteractiveStepInput.tsx` | **general-purpose**  | Reusable component | Design specs |
| Add accessibility labels                              | **ui-design-expert** | A11y compliance    | Component    |

**Reuse Existing:**

- ✅ `auth/AuthTextInput.tsx` as base pattern
- ✅ `moodCapture/steps/FreeWriting.tsx` for text input
- ✅ `constants/design-tokens.ts` for styling
- ✅ `constants/colors.ts` for colors

---

### Phase 6: Update spiral.tsx (Week 2, Days 12-14)

| Task                               | Agent               | Deliverables                    | Dependencies          |
| ---------------------------------- | ------------------- | ------------------------------- | --------------------- |
| Refactor spiral.tsx protocol steps | **general-purpose** | Use technique library           | Technique library     |
| Add adaptive protocol selection    | **general-purpose** | Call `selectAdaptiveProtocol()` | Service               |
| Render interactive steps           | **general-purpose** | Dynamic step rendering          | Interactive component |
| Add rationale display              | **general-purpose** | Show selection reasoning        | Adaptive logic        |
| Update outcome logging             | **general-purpose** | Call `recordProtocolOutcome()`  | Service               |

**Reuse Existing:**

- ✅ Keep existing `spiral.tsx` structure
- ✅ Replace `protocolSteps` array with dynamic selection
- ✅ Use existing `CountdownRing.tsx`
- ✅ Use existing `SuccessRipple.tsx`

---

### Phase 7: Protocol Intelligence Screen (Week 3, Days 15-17)

| Task                                            | Agent                | Deliverables                  | Dependencies              |
| ----------------------------------------------- | -------------------- | ----------------------------- | ------------------------- |
| Design insights screen UX                       | **ux-expert**        | Screen wireframe              | Pattern detection service |
| Design visual layout                            | **ui-design-expert** | Visual spec                   | UX wireframe              |
| Create `app/insights/protocol-intelligence.tsx` | **general-purpose**  | New screen                    | Design specs              |
| Create technique ranking component              | **general-purpose**  | `TechniqueRankingCard`        | Screen                    |
| Create pattern visualization                    | **general-purpose**  | `PatternInsightCard` (reuse!) | Screen                    |

**Reuse Existing:**

- ✅ `profile/PatternInsightCard.tsx` - **EXACT MATCH!**
- ✅ `profile/ProfileStats.tsx` for stats display
- ✅ `components/ui/card.tsx` for card layout
- ✅ `components/ProgressIndicator.tsx` for progress bars

---

### Phase 8: Replace Skip with Pause & Reflect (Week 3, Days 18-19)

| Task                                                  | Agent                | Deliverables        | Dependencies    |
| ----------------------------------------------------- | -------------------- | ------------------- | --------------- |
| Design pause/reflect UX flow                          | **ux-expert**        | UX specification    | None            |
| Design modal UI                                       | **ui-design-expert** | Modal design spec   | UX spec         |
| Create `components/protocol/PauseReflectionModal.tsx` | **general-purpose**  | Modal component     | Design specs    |
| Integrate into spiral.tsx                             | **general-purpose**  | Replace skip button | Modal component |
| Add pause analytics tracking                          | **general-purpose**  | Track pause events  | Modal           |

**Reuse Existing:**

- ✅ Existing skip confirmation modal pattern (lines 1082-1178)
- ✅ `auth/AuthTextInput.tsx` for text input
- ✅ `components/ui/button.tsx` for buttons

---

### Phase 9: Smart Alerts (Week 3, Days 20-21)

| Task                             | Agent               | Deliverables              | Dependencies        |
| -------------------------------- | ------------------- | ------------------------- | ------------------- |
| Design alert settings UX         | **ux-expert**       | Settings screen design    | Pattern detection   |
| Create alert scheduling function | **general-purpose** | `schedulePatternAlerts()` | Peak time detection |
| Add settings toggle              | **general-purpose** | Settings screen update    | Function            |
| Test notification delivery       | **general-purpose** | Working alerts            | Integration         |

**Reuse Existing:**

- ✅ `services/notifications.ts` - Already has notification system
- ✅ `app/settings.tsx` - Add toggle there
- ✅ Follow `sendEncouragementNotification()` pattern

---

## Component Reuse Strategy

### DO NOT CREATE - Already Exists ✅

| Need               | Existing Component                  | Location                |
| ------------------ | ----------------------------------- | ----------------------- |
| Text Input         | `auth/AuthTextInput.tsx`            | components/auth/        |
| Button             | `components/ui/button.tsx`          | components/ui/          |
| Card Layout        | `components/ui/card.tsx`            | components/ui/          |
| Progress Bar       | `components/ProgressIndicator.tsx`  | components/             |
| Rating Scale       | `exercises/AnxietyRatingDial.tsx`   | components/exercises/   |
| Pre/Post Rating    | `exercises/PrePostRatingCard.tsx`   | components/exercises/   |
| Success Animation  | `SuccessRipple.tsx`                 | components/             |
| Loading            | `MagmaLoader.tsx`                   | components/             |
| Error Display      | `auth/ErrorAlert.tsx`               | components/auth/        |
| Navigation Buttons | `moodCapture/NavigationButtons.tsx` | components/moodCapture/ |
| Insights Card      | `profile/PatternInsightCard.tsx`    | components/profile/     |
| Stats Display      | `profile/ProfileStats.tsx`          | components/profile/     |

### CREATE NEW - Doesn't Exist ❌

| Need                       | New Component                       | Reason                       |
| -------------------------- | ----------------------------------- | ---------------------------- |
| Interactive Protocol Step  | `protocol/InteractiveStepInput.tsx` | Unique to adaptive protocols |
| Technique Ranking          | `protocol/TechniqueRankingCard.tsx` | New visualization            |
| Pause Reflection Modal     | `protocol/PauseReflectionModal.tsx` | New UX pattern               |
| Protocol Rationale Display | `protocol/SelectionRationale.tsx`   | New feature                  |

**Total New Components:** 4 (vs 12 we could reuse!)

---

## Best Practices Checklist

### ✅ Senior Developer Principles

#### 1. **No Hardcoding**

```typescript
// ❌ BAD
const duration = 90;
const color = '#52B788';

// ✅ GOOD
import { TIMING } from '@/constants/timing';
import { colors } from '@/constants/colors';
const duration = TIMING.PROTOCOL_DURATION_MODERATE;
const color = colors.lime[500];
```

#### 2. **Props Over Context (When Possible)**

```typescript
// ❌ BAD - Global context for everything
const { technique } = useProtocolContext();

// ✅ GOOD - Props for component data
interface TechniqueCardProps {
  technique: Technique;
  onSelect: (id: string) => void;
}
```

#### 3. **Modular, Single Responsibility**

```typescript
// ❌ BAD - One giant component
function SpiralScreen() {
  // 1,475 lines of everything
}

// ✅ GOOD - Composed from smaller parts
function SpiralScreen() {
  return (
    <SpiralContainer>
      <ProtocolHeader technique={selected} />
      <ProtocolStepDisplay step={current} />
      <ProtocolControls onPause={} onComplete={} />
    </SpiralContainer>
  );
}
```

#### 4. **TypeScript Strict Mode**

```typescript
// ❌ BAD
const data: any = await fetchData();

// ✅ GOOD
interface TechniqueStats {
  techniqueId: string;
  avgReduction: number;
  timesUsed: number;
}
const data: TechniqueStats[] = await fetchData();
```

#### 5. **Error Handling**

```typescript
// ❌ BAD
const result = await supabase.from('table').select();

// ✅ GOOD
try {
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
  return data;
} catch (error) {
  console.error('[ServiceName] Operation failed:', error);
  throw new Error('User-friendly message');
}
```

#### 6. **Proper Nomenclature**

```typescript
// ❌ BAD
function getThing() {}
const stuff = [];
const temp = 5;

// ✅ GOOD
function getTechniqueEffectiveness() {}
const techniqueStats: TechniqueStats[] = [];
const intensityThreshold = 5;
```

#### 7. **Component Organization**

```
components/
  protocol/              # New feature namespace
    InteractiveStepInput.tsx
    TechniqueRankingCard.tsx
    PauseReflectionModal.tsx
    SelectionRationale.tsx
    index.ts            # Barrel export
```

#### 8. **Barrel Exports**

```typescript
// components/protocol/index.ts
export { InteractiveStepInput } from './InteractiveStepInput';
export { TechniqueRankingCard } from './TechniqueRankingCard';
export { PauseReflectionModal } from './PauseReflectionModal';
export { SelectionRationale } from './SelectionRationale';

// Usage
import { InteractiveStepInput, TechniqueRankingCard } from '@/components/protocol';
```

---

## Implementation Phases Summary

### **Phase 1: Foundation (Week 1)**

**Days 1-3:** Database (Supabase Expert)
**Days 4-5:** Technique Library (General Purpose + UI Design Expert)
**Days 6-7:** Selection Algorithm (General Purpose)

**Deliverables:**

- ✅ Database schema with triggers
- ✅ Technique library constant
- ✅ Adaptive selection service
- ✅ Pattern detection service

---

### **Phase 2: Integration (Week 2)**

**Days 8-9:** Pattern Detection (General Purpose)
**Days 10-11:** Interactive Components (UX + UI + General Purpose)
**Days 12-14:** Spiral.tsx Integration (General Purpose)

**Deliverables:**

- ✅ Interactive step component
- ✅ Updated spiral.tsx with adaptive selection
- ✅ Dynamic protocol rendering
- ✅ Outcome tracking

---

### **Phase 3: User Features (Week 3)**

**Days 15-17:** Insights Screen (UX + UI + General Purpose)
**Days 18-19:** Pause & Reflect (UX + UI + General Purpose)
**Days 20-21:** Smart Alerts (General Purpose)

**Deliverables:**

- ✅ Protocol intelligence screen
- ✅ Technique rankings
- ✅ Pattern visualizations
- ✅ Pause/reflect modal
- ✅ Smart alerts

---

## Agent Prompt Templates

### For Supabase Expert

```
Task: Create database schema for adaptive protocol system

Requirements:
1. Create table: user_technique_stats
   - Columns: user_id, technique_id, times_used, times_successful, avg_reduction, last_used_at
   - Auto-calculate running averages
   - Foreign key to auth.users

2. Enhance table: spiral_logs
   - Add columns: technique_id, technique_name, protocol_duration, selection_confidence, selection_rationale, interactive_responses (JSONB)

3. Create trigger function: update_technique_stats()
   - Automatically update user_technique_stats when spiral_logs inserted
   - Calculate running average reduction
   - Update success count if reduction >= 2

4. Create indexes for performance
   - Index on (user_id, technique_id)
   - Index on (user_id, last_used_at)

File location: dailyhush-mobile-app/supabase/migrations/20251106_adaptive_protocols.sql

Follow existing migration patterns from:
- supabase/migrations/20250125_create_spiral_logs_table.sql
```

### For UI Design Expert

```
Task: Design interactive step component for protocol execution

Context:
- Component will render during 90-second spiral interrupt
- Needs to collect user input (text, lists, counts) without disrupting flow
- Must match existing emerald/lime design system
- Should feel like a natural part of the breathing exercise

Reference existing components:
- components/auth/AuthTextInput.tsx (base pattern)
- components/moodCapture/steps/FreeWriting.tsx (multi-line input)
- constants/colors.ts (color system)
- constants/design-tokens.ts (spacing, radius)

Requirements:
1. Design props interface (type, prompt, placeholder, value, onChangeText)
2. Create 3 input types: text, list, count
3. Add helper text: "This helps us personalize your experience"
4. Show character count
5. Ensure accessibility (labels, hints)
6. Match existing emerald theme

Output:
- Component specification document
- Props interface
- Usage examples
```

### For UX Expert

```
Task: Design user flow for pause & reflect experience

Current Problem:
- Users have "Skip" button that trains quitting
- We lose data about why they want to quit
- No opportunity to adapt protocol in real-time

Proposed Solution:
- Replace Skip with "Pause & Reflect"
- Show empathetic modal: "What's making this hard right now?"
- Capture blocking thought
- Adapt protocol based on input

Requirements:
1. Design modal flow (trigger, content, actions)
2. Create empathetic copy (target: women 65+)
3. Define adaptation logic (how do we use their input?)
4. Ensure easy resume

Reference:
- Existing skip confirmation modal in app/spiral.tsx (lines 1082-1178)

Output:
- User flow diagram
- Copy specifications
- Component wireframe
```

### For General Purpose

```
Task: Implement adaptive protocol selection service

Requirements:
1. Create file: services/adaptiveProtocol.ts
2. Implement function: selectAdaptiveProtocol()
   - Parameters: userId, intensity, trigger?, shiftConnected
   - Returns: { technique, confidence, rationale }
   - Use simple scoring algorithm (no ML)

3. Implement function: recordProtocolOutcome()
   - Save to spiral_logs
   - Let trigger handle stats update

4. Import existing utilities:
   - utils/retry.ts for error handling
   - utils/supabase.ts for DB client

5. Follow patterns from:
   - services/profileService.ts (structure)
   - services/insights.ts (query patterns)

Scoring Rules:
- Past effectiveness × 10
- Trigger match × 8
- Intensity match × 6
- Recency penalty -10
- Exploration bonus +5

Output:
- Complete service file with types
- Error handling
- JSDoc comments
```

---

## Success Criteria

### Technical

- ✅ Zero duplicate components
- ✅ All props typed with TypeScript
- ✅ No hardcoded values
- ✅ Error handling on all async operations
- ✅ Reuses existing utilities (retry, debounce)
- ✅ Follows existing patterns

### User Experience

- ✅ Protocols adapt based on user data
- ✅ Users see why technique was chosen
- ✅ Interactive steps don't disrupt flow
- ✅ Insights show personal patterns
- ✅ Smart alerts predict spirals

### Performance

- ✅ All calculations client-side
- ✅ Database queries optimized with indexes
- ✅ No external API calls
- ✅ Total cost: $0

---

## Next Steps

1. ✅ Review this delegation plan
2. ✅ Confirm agent assignments
3. ✅ Start with Phase 1, Task 1 (Supabase Expert)
4. ✅ User runs Supabase MCP after migration created
5. ✅ Proceed sequentially through phases

**Ready to begin implementation?** 🚀

Say: "Start Phase 1" to begin with database schema creation.
