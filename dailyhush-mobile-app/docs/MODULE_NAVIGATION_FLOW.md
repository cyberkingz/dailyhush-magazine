# DailyHush Module & Method Navigation System

## Overview

The module and method configuration system provides a flexible, scalable way for users to get help based on their immediate needs. Inspired by Stoic's "Exercises from Therapists" approach, users first select what type of help they need (module), then choose how they want to engage (method).

## User Journey

### Complete Flow Diagram

```
HOME SCREEN
    |
    v
MODULE SELECTION ("What do you need help with?")
    |
    +-- Stop Spiraling (free, urgent) ⚡
    +-- Calm Anxiety (free)
    +-- Process Emotions (premium) 💎
    +-- Better Sleep (premium) 💎
    +-- Gain Focus (premium) 💎
    |
    v
METHOD SELECTION ("How do you want to work on this?")
    |
    +-- Talk to Anna (5-10 min)
    |       |
    |       v
    |   /anna/conversation
    |       |
    |       v
    |   Conversational therapy session
    |
    +-- Quick Exercise (2-5 min)
    |       |
    |       v
    |   Module-specific exercise
    |   (e.g., /spiral, /exercises/grounding)
    |       |
    |       v
    |   Guided exercise completion
    |
    +-- Breathing Exercise (3-10 min)
    |       |
    |       v
    |   /exercises/breathing
    |       |
    |       v
    |   Guided breathing session
    |
    +-- Progress Dashboard (premium only)
            |
            v
        /insights/[type]
            |
            v
        Historical data & insights
```

### Step-by-Step User Flow

#### 1. User Arrives at Home Screen

- User is experiencing distress or wants to be proactive
- Home screen shows "What do you need help with?" or similar prompt
- User sees 5 module cards, ordered by urgency/premium status

#### 2. Module Selection Screen

**Display Logic:**

```typescript
// Free modules shown first, urgent flagged prominently
const displayModules = [
  stopSpiraling, // Free, Urgent, Red
  calmAnxiety, // Free, Orange
  processEmotions, // Premium, Purple
  betterSleep, // Premium, Blue
  gainFocus, // Premium, Green
];
```

**Module Card Contents:**

- Icon (emoji)
- Title + Subtitle
- Duration estimate
- Premium badge (if applicable)
- Color-coded by urgency/type

**User Actions:**

- Tap module to proceed
- If premium module + not premium user → show paywall
- If free module or premium user → proceed to method selection

#### 3. Method Selection Screen

**Screen Design:**

- Module context header (shows selected module)
- "How do you want to work on this?" heading
- 2-4 method cards depending on module

**Method Card Contents:**

- Icon (emoji)
- Title + Subtitle
- Duration estimate
- Brief description
- "Best for:" list
- Recommended badge (if applicable)

**Display Logic:**

```typescript
const methods = getMethodsForModule(selectedModuleId)
const recommendedMethod = methods.find(m => m.isRecommended)

// Sort: Recommended first, then by duration
const sortedMethods = [
  recommendedMethod,
  ...methods.filter(m => !m.isRecommended).sort(by duration)
]
```

**User Actions:**

- Tap method to proceed
- System navigates to method.route with method.params
- Premium methods show lock icon if user not premium

#### 4. Method Execution

Depending on selected method, user enters one of these flows:

**A. Talk to Anna**

```
/anna/conversation?moduleId=X&source=module-selection
    |
    v
Anna greeting contextual to module
    |
    v
Conversational therapy (5-10 min)
    |
    v
Suggested exercises or completion
    |
    v
Return to home or insights
```

**B. Quick Exercise**

```
/spiral OR /exercises/[type]?moduleId=X
    |
    v
Exercise intro screen
    |
    v
Guided exercise (2-5 min)
    |
    v
Post-exercise reflection
    |
    v
Completion + logging
    |
    v
Return to home
```

**C. Breathing Exercise**

```
/exercises/breathing?type=X&duration=Y
    |
    v
Breathing instructions
    |
    v
Guided breathing session (3-10 min)
    |
    v
Completion
    |
    v
Return to home
```

**D. Progress Dashboard**

```
/insights/[type]?moduleId=X
    |
    v
Historical data visualization
    |
    v
Pattern insights
    |
    v
User explores at own pace
```

## Module Specifications

### 1. Stop Spiraling

**Target State:** User is in active rumination loop, needs immediate intervention
**Color:** Red (#DC2626)
**Icon:** 🌀
**Free:** Yes
**Urgent:** Yes

**Available Methods:**

1. Talk to Anna (recommended) - 5-10 min
2. Quick Exercise - 2 min (direct to /spiral)
3. Breathing Exercise - 3 min

**Use Cases:**

- User pressing "I'm spiraling" panic button
- Detected rumination from conversation with Anna
- User returning who knows they're in a loop

### 2. Calm Anxiety

**Target State:** General anxiety, stress, overwhelm
**Color:** Orange (#F97316)
**Icon:** 🍃
**Free:** Yes
**Urgent:** No

**Available Methods:**

1. Talk to Anna (recommended) - 5-10 min
2. Grounding Exercise (5-4-3-2-1) - 3 min
3. Calming Breath (4-7-8) - 3 min

**Use Cases:**

- Pre-event anxiety (before meeting, social event)
- General stress management
- Building daily calm practices

### 3. Process Emotions

**Target State:** Complex emotional experiences needing processing
**Color:** Purple (#7C3AED)
**Icon:** 💜
**Free:** No (Premium)
**Urgent:** No

**Available Methods:**

1. Emotional Check-In with Anna (recommended) - 10-15 min
2. Emotion Wheel Exercise - 5 min
3. Emotion Insights Dashboard

**Use Cases:**

- After difficult conversations or events
- Confusion about what you're feeling
- Building emotional intelligence
- Relationship processing

### 4. Better Sleep

**Target State:** Nighttime rumination, racing thoughts before bed
**Color:** Blue (#3B82F6)
**Icon:** 🌙
**Free:** No (Premium)
**Urgent:** No

**Available Methods:**

1. Bedtime Check-In with Anna (recommended) - 5-10 min
2. Brain Dump Exercise - 5 min
3. Sleep Breathing - 10 min
4. Sleep Patterns Dashboard

**Use Cases:**

- Can't fall asleep due to thoughts
- Waking up anxious at 3am
- Building better sleep routine
- Chronic insomnia support

### 5. Gain Focus

**Target State:** Mental clutter preventing concentration
**Color:** Green (#059669)
**Icon:** 🎯
**Free:** No (Premium)
**Urgent:** No

**Available Methods:**

1. Focus Session with Anna (recommended) - 5-8 min
2. Mind Clear Exercise - 2 min
3. Productivity Insights Dashboard

**Use Cases:**

- Starting work/study session
- Afternoon slump
- ADHD management
- Between task transitions

## Method Specifications

### Talk to Anna

**Universal method available across all modules**

**Characteristics:**

- Personalized, conversational
- Adapts to module context
- 5-15 min depending on module
- Free for urgent modules, premium otherwise
- Always recommended method

**Benefits:**

- Understands user's unique situation
- Provides tailored advice
- Can redirect to exercises
- Builds relationship over time

**Best For:**

- First-time users
- Complex situations
- Need to verbally process
- Unclear about what to do

### Quick Exercise

**Module-specific, direct action**

**Characteristics:**

- Immediate, no conversation
- 2-5 min completion
- Proven protocols
- Different exercise per module
- Free or premium based on module

**Benefits:**

- Fastest relief
- No thinking required
- Repeatable daily
- Builds muscle memory

**Best For:**

- Crisis moments
- Repeat users
- Time pressure
- Just want relief

### Breathing Exercise

**Physiological intervention**

**Characteristics:**

- Guided breathing patterns
- 3-10 min sessions
- Different patterns per module
- Visual + audio guidance
- Free or premium based on module

**Benefits:**

- Portable technique
- Physical calm response
- Can do anywhere
- Builds daily habit

**Best For:**

- Physical anxiety symptoms
- Public places
- Can't or don't want to talk
- Complement to other methods

### Progress Dashboard

**Premium only, reflective**

**Characteristics:**

- Historical data visualization
- Pattern insights
- Trigger identification
- Unlimited time to explore
- Premium exclusive

**Benefits:**

- Understand long-term patterns
- Celebrate progress
- Identify triggers
- Share with therapist

**Best For:**

- Regular users with history
- Optimizing routines
- Pattern recognition
- Professional consultation prep

## Technical Implementation

### Navigation Example

```typescript
import { useRouter } from 'expo-router'
import { getModule, getMethodsForModule, getMethodNavigationParams } from '@/constants'

function MethodSelectionScreen({ moduleId }) {
  const router = useRouter()
  const module = getModule(moduleId)
  const methods = getMethodsForModule(moduleId)

  const handleMethodSelect = (methodId) => {
    const nav = getMethodNavigationParams(moduleId, methodId)
    if (!nav) return

    router.push({
      pathname: nav.route,
      params: nav.params
    })
  }

  return (
    <View>
      <Text>{module.title}</Text>
      {methods.map(method => (
        <MethodCard
          key={method.id}
          method={method}
          onPress={() => handleMethodSelect(method.id)}
        />
      ))}
    </View>
  )
}
```

### Premium Gating Example

```typescript
import { hasModuleAccess, hasMethodAccess } from '@/constants'
import { useUser } from '@/store/useStore'

function ModuleCard({ moduleId }) {
  const user = useUser()
  const isPremium = user?.subscription_status === 'active'
  const hasAccess = hasModuleAccess(moduleId, isPremium)

  const handlePress = () => {
    if (!hasAccess) {
      router.push('/subscription')
      return
    }
    router.push(`/modules/${moduleId}/methods`)
  }

  return (
    <Pressable onPress={handlePress}>
      {!hasAccess && <PremiumBadge />}
      {/* Module content */}
    </Pressable>
  )
}
```

### Analytics Tracking

```typescript
// Track module selection
analytics.track('MODULE_SELECTED', {
  module_id: moduleId,
  module_name: module.title,
  is_premium: module.isPremium,
  has_access: hasAccess,
});

// Track method selection
analytics.track('METHOD_SELECTED', {
  module_id: moduleId,
  method_id: methodId,
  method_name: method.title,
  duration_minutes: method.durationMinutes,
  is_recommended: method.isRecommended,
});

// Track completion
analytics.track('METHOD_COMPLETED', {
  module_id: moduleId,
  method_id: methodId,
  actual_duration_seconds: timeSpent,
  user_rating: rating,
});
```

## Design Considerations

### Visual Hierarchy

1. **Urgent Free Modules** - Large, prominent, red color
2. **Free Modules** - Standard size, accessible
3. **Premium Modules** - Slightly muted if no access, premium badge

### Module Cards

- Large emoji icon
- Clear title + subtitle
- Duration estimate prominent
- Color-coded background/border
- Premium badge if applicable
- Tap area: entire card

### Method Cards

- Medium emoji icon
- Title + subtitle
- Duration + "Best for" preview
- Recommended badge (star or checkmark)
- Description expandable on tap/hold
- Tap area: entire card

### Loading States

- Skeleton screens while loading
- Preserved scroll position
- Smooth transitions between screens

### Error Handling

- Module unavailable → Show contact support
- Method route invalid → Fallback to talk-to-anna
- Premium gating → Clear upgrade path
- Network error → Offline mode indicator

## Future Scalability

### Adding New Modules

1. Add module definition to `constants/modules.ts`
2. Add methods for module to `constants/methods.ts`
3. Create exercise screens if needed
4. Update Anna conversation prompts for module context
5. Add analytics events
6. Test premium gating

### Adding New Methods

1. Add method definition to appropriate module section in `constants/methods.ts`
2. Create screen/component for method
3. Add route to app routing
4. Test navigation params
5. Add analytics

### A/B Testing Support

- Module order can be shuffled
- Method recommendations can be varied
- Default selections can be tested
- All configurable without code changes

## Accessibility

### Screen Reader Support

- All cards have proper labels
- Duration announced
- Premium status announced
- Navigation hints provided

### Motor Accessibility

- Large tap targets (minimum 44x44pt)
- No time-based interactions required
- All gestures have button alternatives

### Cognitive Accessibility

- Clear, simple language
- Consistent patterns
- Visual hierarchy
- Duration estimates for planning
- One decision at a time

## Success Metrics

### Module Selection

- Time to select module
- Module selection distribution
- Premium conversion from module selection
- Module abandonment rate

### Method Selection

- Method selection distribution per module
- Recommended vs non-recommended selection rate
- Time to select method
- Method completion rate

### Overall Flow

- Entry to exercise completion time
- Drop-off points in funnel
- Repeat usage patterns
- User satisfaction ratings

---

## File Locations

- Module Config: `/constants/modules.ts`
- Method Config: `/constants/methods.ts`
- This Documentation: `/docs/MODULE_NAVIGATION_FLOW.md`

## Related Documentation

- `/app/spiral.tsx` - Stop Spiraling quick exercise
- `/app/training/focus.tsx` - Example of modular training flow
- `/constants/loopTypes.ts` - User profile types that inform recommendations
