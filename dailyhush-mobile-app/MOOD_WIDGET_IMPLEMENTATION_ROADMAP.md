# Mood Widget Implementation Roadmap
**Date**: 2025-11-06
**Project**: DailyHush Mobile App - Inline Mood Logging Widget
**Technology Stack**: React Native, Expo, Reanimated 4, TypeScript
**Status**: Planning & Delegation Phase

---

## 📋 Executive Summary

Transform the mood logging experience from a navigation-based multi-screen flow to an inline animated widget on the home page. This implementation follows senior developer best practices including:
- **Modular architecture** with reusable components
- **Props-based data flow** (no hardcoded values)
- **Type-safe TypeScript** interfaces
- **Separation of concerns** (presentation, logic, animation)
- **Performance optimization** (60 FPS target)
- **Accessibility-first** design

---

## 🎯 Current State Audit

### Dependencies Status ✅
All required dependencies are already installed:
- ✅ `react-native-reanimated@4.1.1`
- ✅ `react-native-gesture-handler@2.28.0`
- ✅ `react-native-svg@15.12.1`
- ✅ `moti@0.30.0`
- ✅ `expo-haptics@15.0.7`

### Configuration Needed ⚠️
- **Babel Config**: Needs `react-native-reanimated/plugin` addition
  - Current: Only has `react-native-worklets/plugin`
  - Required: Add Reanimated plugin (must be last in plugins array)

### Existing Infrastructure ✅
- ✅ `useMoodCapture` hook exists with excellent state management
- ✅ `EmotionalWeather` component exists (needs transformation)
- ✅ Design system tokens in place (`colors`, `spacing`, `SPACING`)
- ✅ UI components available (`PillButton`, `Text`, `Card`)

---

## 🏗️ Architecture Design

### Component Hierarchy

```
EmotionalWeather/ (Container)
├── hooks/
│   ├── useWidgetAnimation.ts          # Main animation orchestration
│   ├── useCardExpansion.ts            # Card height/background animations
│   ├── useMoodSelection.ts            # Mood choice stagger & selection
│   ├── useIntensitySlider.ts          # Slider gesture & snapping
│   └── useSuccessAnimation.ts         # Checkmark & collapse
│
├── components/
│   ├── EmptyState.tsx                 # Initial "Log Mood" prompt
│   ├── MoodSelector.tsx               # Mood choice grid with stagger
│   ├── IntensitySlider.tsx            # Gesture-based slider (1-7)
│   ├── QuickNotesInput.tsx            # Optional text input
│   ├── SuccessCheckmark.tsx           # SVG animated checkmark
│   └── WeatherDisplay.tsx             # Final completed state
│
├── types/
│   └── widget.types.ts                # All TypeScript interfaces
│
└── EmotionalWeatherWidget.tsx         # Main container component
```

### Data Flow Pattern

```typescript
// Props-based, no hardcoded values
interface WidgetProps {
  // Data
  weather?: EmotionalWeather;
  moodRating?: number;
  notes?: string;

  // Callbacks
  onMoodSubmit: (data: MoodSubmitData) => Promise<void>;
  onUpdate?: () => void;

  // Configuration
  config?: WidgetConfig;
}

interface WidgetConfig {
  // Animation timings (all configurable)
  expansionDuration?: number;        // default: 300ms
  moodStaggerDelay?: number;         // default: 50ms
  collapseDelay?: number;            // default: 800ms

  // Dimensions (responsive)
  collapsedHeight?: number;          // default: 240px
  expandedHeight?: number;           // default: 480px

  // Feature flags
  enableQuickNotes?: boolean;        // default: true
  enableVoiceInput?: boolean;        // default: false
  enableHaptics?: boolean;           // default: true

  // Mood options (customizable)
  moodChoices?: MoodChoice[];
  intensityRange?: [number, number]; // default: [1, 7]
}
```

---

## 📊 Implementation Phases

### **Phase 1: Foundation & Configuration** (1-2 hours)
**Agent**: None (direct implementation)

**Tasks**:
1. ✅ Update `babel.config.js` with Reanimated plugin
2. ✅ Create `types/widget.types.ts` with all interfaces
3. ✅ Set up folder structure: `components/mood-widget/`
4. ✅ Create base configuration file: `constants/widgetConfig.ts`

**Deliverables**:
- Updated babel config
- Complete TypeScript type definitions
- Configuration file with defaults
- README for widget component usage

---

### **Phase 2: UX Expert Review** (30 mins - 1 hour)
**Agent**: `ux-expert`

**Delegation**:
```
Task: Review the mood widget flow and provide UX recommendations

Context:
- Read: dailyhush-mobile-app/MOOD_WIDGET_CONCEPT.md
- Current Flow: Navigation-based (4 screens)
- Proposed Flow: Inline widget (0 navigation)

Please analyze and provide:
1. Flow validation (is the 4-stage inline flow optimal?)
2. Cognitive load assessment (mood → intensity → notes → success)
3. Skip/escape patterns (how should users exit mid-flow?)
4. Error state handling (network failure, validation errors)
5. Accessibility concerns (screen readers, motor impairments)
6. Micro-interaction recommendations (haptics, sounds)

Deliverable: UX review document with specific recommendations
```

---

### **Phase 3: UI Design System** (1-2 hours)
**Agent**: `ui-design-expert`

**Delegation**:
```
Task: Create comprehensive UI design specifications for widget states

Context:
- Read: dailyhush-mobile-app/MOOD_WIDGET_CONCEPT.md
- Read: dailyhush-mobile-app/constants/colors.ts
- Read: dailyhush-mobile-app/constants/designTokens.ts

Please design:
1. Color palette for each widget state (empty, mood, intensity, success)
2. Typography scale (titles, labels, descriptions)
3. Spacing system (padding, margins, gaps)
4. Animation easing curves (expansion, collapse, stagger)
5. Mood choice visual design (emoji size, backgrounds, selection states)
6. Intensity slider design (track, thumb, step indicators)
7. Success checkmark style (stroke width, color, timing)
8. Responsive breakpoints (iPhone SE, Pro Max, iPad)

Deliverable: Design system document + Figma/mockups (if possible)
```

---

### **Phase 4: Animation Hooks** (3-4 hours)
**Agent**: None (direct implementation with best practices)

**Tasks**:

#### 4.1 `useCardExpansion.ts`
```typescript
/**
 * Manages card height, background color, and shadow animations
 *
 * @param config - Animation configuration
 * @returns Animated styles and control functions
 */
interface UseCardExpansionConfig {
  collapsedHeight: number;
  expandedHeight: number;
  duration: number;
  easing: Easing;
}

export function useCardExpansion(config: UseCardExpansionConfig) {
  const height = useSharedValue(config.collapsedHeight);
  const backgroundColor = useSharedValue(colors.background.card);

  const expand = () => { /* ... */ };
  const collapse = () => { /* ... */ };

  const animatedStyle = useAnimatedStyle(() => ({ /* ... */ }));

  return { expand, collapse, animatedStyle };
}
```

#### 4.2 `useMoodSelection.ts`
```typescript
/**
 * Manages mood choice animations (stagger, selection, fly-out)
 *
 * @param moods - Array of mood choices
 * @param config - Stagger and selection config
 * @returns Animation values per mood + selection handler
 */
export function useMoodSelection(
  moods: MoodChoice[],
  config: MoodSelectionConfig
) {
  // Stagger animations for entrance
  // Pulse animation for selection
  // Fly-out for non-selected moods
  // Wiggle effect
}
```

#### 4.3 `useIntensitySlider.ts`
```typescript
/**
 * Gesture-based slider with snapping to steps
 *
 * @param range - [min, max] intensity values
 * @param config - Slider configuration
 * @returns Gesture handler, animated value, current intensity
 */
export function useIntensitySlider(
  range: [number, number],
  config: IntensitySliderConfig
) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => { /* ... */ })
    .onEnd(() => { /* snap to step */ });

  return { panGesture, animatedStyle, currentValue };
}
```

#### 4.4 `useSuccessAnimation.ts`
```typescript
/**
 * Success checkmark SVG path animation + confetti (optional)
 *
 * @param config - Success animation config
 * @returns Trigger function, animated props, completion callback
 */
export function useSuccessAnimation(config: SuccessAnimationConfig) {
  const checkmarkProgress = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  const scaleValue = useSharedValue(0);

  const trigger = () => { /* ... */ };

  return { trigger, animatedProps };
}
```

**Best Practices**:
- All timings via props (no magic numbers)
- Worklets for on-UI-thread animations
- Cleanup on unmount
- TypeScript generics for reusability

---

### **Phase 5: Presentation Components** (4-5 hours)
**Agent**: None (direct implementation)

#### 5.1 `MoodSelector.tsx`
```typescript
interface MoodSelectorProps {
  moods: MoodChoice[];
  onSelect: (mood: MoodChoice) => void;
  visible: boolean;
  config: MoodSelectorConfig;
}

/**
 * Grid of mood choices with staggered entrance
 * - Configurable grid layout (2x3, 3x2, 5x1)
 * - Haptic feedback on selection
 * - Accessibility labels
 */
export function MoodSelector({ moods, onSelect, visible, config }: MoodSelectorProps) {
  const { animatedValues, selectMood } = useMoodSelection(moods, config);

  return (
    <Animated.View>
      {moods.map((mood, index) => (
        <MoodChoice
          key={mood.id}
          mood={mood}
          animatedStyle={animatedValues[index]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            selectMood(mood);
            onSelect(mood);
          }}
        />
      ))}
    </Animated.View>
  );
}
```

#### 5.2 `IntensitySlider.tsx`
```typescript
interface IntensitySliderProps {
  range: [number, number];
  initialValue: number;
  onChange: (value: number) => void;
  visible: boolean;
  config: IntensitySliderConfig;
}

/**
 * Gesture-based slider with step snapping
 * - Visual step indicators (dots or numbers)
 * - Haptic feedback on step change
 * - Accessible (can use +/- buttons as fallback)
 */
export function IntensitySlider({ range, initialValue, onChange, visible, config }: IntensitySliderProps) {
  const { panGesture, animatedStyle, currentValue } = useIntensitySlider(range, config);

  // Watch currentValue and call onChange
  useEffect(() => {
    onChange(currentValue);
  }, [currentValue]);

  return (
    <GestureDetector gesture={panGesture}>
      {/* Slider UI */}
    </GestureDetector>
  );
}
```

#### 5.3 `QuickNotesInput.tsx`
```typescript
interface QuickNotesInputProps {
  value: string;
  onChange: (text: string) => void;
  onSkip: () => void;
  visible: boolean;
  config: QuickNotesConfig;
}

/**
 * Optional text input for quick mood notes
 * - Auto-focus when visible
 * - Character limit (optional)
 * - "Skip" button always available
 */
export function QuickNotesInput({ value, onChange, onSkip, visible, config }: QuickNotesInputProps) {
  // Auto-focus management
  // Keyboard handling
  // Placeholder variations
}
```

#### 5.4 `SuccessCheckmark.tsx`
```typescript
interface SuccessCheckmarkProps {
  visible: boolean;
  onComplete: () => void;
  config: SuccessCheckmarkConfig;
}

/**
 * SVG animated checkmark with optional confetti
 * - Path drawing animation (0 → 1)
 * - Rotation + scale bounce
 * - Auto-triggers collapse after duration
 */
export function SuccessCheckmark({ visible, onComplete, config }: SuccessCheckmarkProps) {
  const { trigger, animatedProps } = useSuccessAnimation(config);

  useEffect(() => {
    if (visible) {
      trigger();
      setTimeout(onComplete, config.displayDuration);
    }
  }, [visible]);

  return (
    <Svg>
      <AnimatedPath {...animatedProps} />
    </Svg>
  );
}
```

#### 5.5 `WeatherDisplay.tsx`
```typescript
interface WeatherDisplayProps {
  weather: EmotionalWeather;
  moodRating: number;
  notes?: string;
  onUpdate: () => void;
  visible: boolean;
}

/**
 * Final state showing logged mood as weather
 * - Weather icon + name
 * - Mood rating dots
 * - Notes preview (if any)
 * - "Update" button to re-enter flow
 */
export function WeatherDisplay({ weather, moodRating, notes, onUpdate, visible }: WeatherDisplayProps) {
  // Fade in animation
  // Display weather config
  // "Update" button → restarts widget
}
```

**Best Practices**:
- Pure presentation components (no business logic)
- All data via props
- Accessibility attributes on all interactive elements
- Memo for performance optimization
- Prop validation with TypeScript

---

### **Phase 6: State Machine & Container** (3-4 hours)
**Agent**: None (direct implementation)

#### 6.1 `useWidgetStateMachine.ts`
```typescript
/**
 * State machine for widget flow
 * States: empty | mood | intensity | notes | success | display
 *
 * @param onSubmit - Callback when mood is submitted
 * @returns Current state, transitions, data
 */
type WidgetState = 'empty' | 'mood' | 'intensity' | 'notes' | 'success' | 'display';

export function useWidgetStateMachine(
  onSubmit: (data: MoodSubmitData) => Promise<void>
) {
  const [state, setState] = useState<WidgetState>('empty');
  const [data, setData] = useState<Partial<MoodSubmitData>>({});

  // Transitions
  const startFlow = () => setState('mood');
  const selectMood = (mood: MoodChoice) => {
    setData((prev) => ({ ...prev, mood }));
    setState('intensity');
  };
  const selectIntensity = (intensity: number) => {
    setData((prev) => ({ ...prev, intensity }));
    setState('notes');
  };
  const submitNotes = async (notes?: string) => {
    const finalData = { ...data, notes };
    setState('success');

    try {
      await onSubmit(finalData as MoodSubmitData);
      // Success animation will auto-transition to display
    } catch (error) {
      // Handle error (show error state)
    }
  };
  const completeSuccess = () => setState('display');
  const reset = () => {
    setState('empty');
    setData({});
  };

  return {
    state,
    data,
    startFlow,
    selectMood,
    selectIntensity,
    submitNotes,
    completeSuccess,
    reset,
  };
}
```

#### 6.2 `EmotionalWeatherWidget.tsx` (Main Container)
```typescript
interface EmotionalWeatherWidgetProps {
  // Existing mood data (if already logged today)
  weather?: EmotionalWeather;
  moodRating?: number;
  notes?: string;

  // Callbacks
  onMoodSubmit: (data: MoodSubmitData) => Promise<void>;

  // Configuration (all optional with defaults)
  config?: WidgetConfig;
}

/**
 * Main container orchestrating all widget states and animations
 *
 * Flow:
 * 1. Empty State → Click "Log Mood" → Expand
 * 2. Mood Selection → Select → Transition
 * 3. Intensity → Drag slider → Transition
 * 4. Notes (optional) → Type/Skip → Submit
 * 5. Success → Checkmark animation → Collapse
 * 6. Display → Show weather → "Update" to restart
 */
export function EmotionalWeatherWidget({
  weather,
  moodRating,
  notes,
  onMoodSubmit,
  config = DEFAULT_WIDGET_CONFIG,
}: EmotionalWeatherWidgetProps) {
  // State machine
  const {
    state,
    data,
    startFlow,
    selectMood,
    selectIntensity,
    submitNotes,
    completeSuccess,
    reset,
  } = useWidgetStateMachine(onMoodSubmit);

  // Animation hooks
  const { expand, collapse, animatedCardStyle } = useCardExpansion(config.animation);

  // Handle state transitions with animations
  const handleStartFlow = () => {
    expand();
    startFlow();
  };

  const handleSubmitNotes = async (notesText?: string) => {
    await submitNotes(notesText);
    // Success animation will trigger, then collapse
  };

  const handleCompleteSuccess = () => {
    collapse();
    completeSuccess();
  };

  // Determine which component to render based on state
  return (
    <Animated.View style={[styles.container, animatedCardStyle]}>
      {state === 'empty' && (
        <EmptyState onPress={handleStartFlow} config={config.emptyState} />
      )}

      {state === 'mood' && (
        <MoodSelector
          moods={config.moodChoices}
          onSelect={selectMood}
          visible={state === 'mood'}
          config={config.moodSelector}
        />
      )}

      {state === 'intensity' && (
        <IntensitySlider
          range={config.intensityRange}
          initialValue={4}
          onChange={selectIntensity}
          visible={state === 'intensity'}
          config={config.intensitySlider}
        />
      )}

      {state === 'notes' && config.enableQuickNotes && (
        <QuickNotesInput
          value={data.notes || ''}
          onChange={(text) => setData((prev) => ({ ...prev, notes: text }))}
          onSkip={() => handleSubmitNotes()}
          visible={state === 'notes'}
          config={config.quickNotes}
        />
      )}

      {state === 'success' && (
        <SuccessCheckmark
          visible={state === 'success'}
          onComplete={handleCompleteSuccess}
          config={config.successAnimation}
        />
      )}

      {state === 'display' && (weather && moodRating) && (
        <WeatherDisplay
          weather={weather}
          moodRating={moodRating}
          notes={notes}
          onUpdate={reset}
          visible={state === 'display'}
        />
      )}
    </Animated.View>
  );
}
```

---

### **Phase 7: Backend Integration** (2-3 hours)
**Agent**: `supabase-expert`

**Delegation**:
```
Task: Create mood logging API service with Supabase integration

Context:
- Read: dailyhush-mobile-app/hooks/useMoodCapture.ts (existing hook)
- Read: dailyhush-mobile-app/types/supabase.ts (database types)
- Widget needs to submit: mood, intensity, notes, timestamp

Please create:
1. Service file: services/moodLogging.ts
   - saveMoodLog(data: MoodSubmitData): Promise<MoodLog>
   - updateMoodLog(id: string, data: Partial<MoodSubmitData>): Promise<MoodLog>
   - getTodayMoodLog(userId: string): Promise<MoodLog | null>

2. Hook: hooks/useMoodLogging.ts
   - Wraps service methods with loading/error states
   - Optimistic UI updates
   - React Query integration (if available)

3. Error handling:
   - Network errors (retry logic)
   - Validation errors (user-friendly messages)
   - Offline support (queue for later sync)

4. Database schema validation:
   - Ensure mood_logs table has all required fields
   - Create migration if needed
   - Add RLS policies for user data

Deliverable: Service + hook with full error handling
```

---

### **Phase 8: Testing & Accessibility** (2-3 hours)
**Agent**: None (direct implementation)

**Tasks**:

#### 8.1 Accessibility Audit
- [ ] Screen reader labels for all interactive elements
- [ ] Minimum touch target size (44x44pt)
- [ ] Color contrast ratios (WCAG AA)
- [ ] Keyboard navigation support (if applicable)
- [ ] Haptic feedback for all state changes
- [ ] Voice-over friendly component names

#### 8.2 Responsive Testing
- [ ] iPhone SE (smallest screen)
- [ ] iPhone 14 Pro Max (largest phone)
- [ ] iPad Mini (tablet)
- [ ] Landscape orientation
- [ ] Dynamic text sizing

#### 8.3 Performance Testing
- [ ] 60 FPS during all animations (use Reanimated profiler)
- [ ] Memory usage stable
- [ ] No memory leaks on mount/unmount cycles
- [ ] Animation cancellation on component unmount

#### 8.4 Edge Case Testing
- [ ] Rapid taps during animation
- [ ] Back navigation mid-flow
- [ ] App backgrounded during submission
- [ ] Network timeout during submit
- [ ] Concurrent mood log attempts
- [ ] Invalid mood data handling

---

### **Phase 9: Home Page Integration** (1 hour)
**Agent**: None (direct implementation)

**Tasks**:
1. Replace current `EmotionalWeather` usage in `app/index.tsx`
2. Remove navigation to `/mood-capture/mood`
3. Integrate with existing data fetching
4. Add analytics tracking
5. Test full flow end-to-end

**Before**:
```typescript
<EmotionalWeather onPress={handleCheckIn} />
// handleCheckIn → router.push('/mood-capture/mood')
```

**After**:
```typescript
<EmotionalWeatherWidget
  weather={todayMood?.weather}
  moodRating={todayMood?.rating}
  notes={todayMood?.notes}
  onMoodSubmit={async (data) => {
    await saveMoodLog(data);
    await refetchTodayMood();
  }}
  config={widgetConfig}
/>
```

---

### **Phase 10: Analytics & Monitoring** (1-2 hours)
**Agent**: None (direct implementation)

**Events to Track**:
```typescript
// Widget opened
analytics.track('MOOD_WIDGET_EXPANDED', {
  source: 'home_page',
  hasExistingMood: boolean,
});

// Mood selected
analytics.track('MOOD_SELECTED', {
  mood: string,
  timeToSelect: number, // ms from widget open
});

// Intensity set
analytics.track('INTENSITY_SELECTED', {
  intensity: number,
  timeToSelect: number,
});

// Notes submitted
analytics.track('NOTES_SUBMITTED', {
  notesLength: number,
  wasSkipped: boolean,
});

// Success
analytics.track('MOOD_LOG_COMPLETED', {
  totalTime: number, // ms from open to submit
  includesNotes: boolean,
});

// Widget collapsed
analytics.track('MOOD_WIDGET_COLLAPSED', {
  state: 'success' | 'canceled',
});

// Errors
analytics.track('MOOD_WIDGET_ERROR', {
  error: string,
  state: WidgetState,
});
```

---

## 🎨 Design Specifications (To Be Completed by UI Expert)

### Animation Timings
- **Card Expansion**: 300ms (Easing.bezier(0.25, 0.1, 0.25, 1))
- **Mood Stagger**: 50ms per item
- **Mood Selection**: 150ms pulse + 300ms fly-out
- **Intensity Slider**: Spring (damping: 14, stiffness: 120)
- **Success Checkmark**: 400ms draw + 200ms scale
- **Card Collapse**: 400ms (same easing as expansion)

### Dimensions
- **Collapsed Height**: 240px
- **Expanded Height**: 480px (to be validated by UI expert)
- **Card Border Radius**: 24px (from SPACING.xxl)
- **Card Padding**: 24px horizontal, 28px vertical

### Color Palette (To Be Defined by UI Expert)
- Empty state background
- Mood selection backgrounds
- Intensity slider colors
- Success checkmark color
- Error state colors

---

## 📚 Best Practices Checklist

### Code Quality
- [ ] All components are pure (no side effects except hooks)
- [ ] TypeScript strict mode enabled
- [ ] No `any` types (use `unknown` if needed)
- [ ] All props have interfaces
- [ ] All callbacks are memoized with `useCallback`
- [ ] All objects are memoized with `useMemo` where appropriate

### Performance
- [ ] Worklets for all animations (run on UI thread)
- [ ] No bridge communication during gestures
- [ ] Batch state updates where possible
- [ ] Cancel animations on unmount
- [ ] Lazy load heavy components

### Accessibility
- [ ] All buttons have `accessibilityLabel`
- [ ] All buttons have `accessibilityHint`
- [ ] All state changes have `accessibilityLiveRegion`
- [ ] Haptic feedback for all interactions
- [ ] Minimum 44pt touch targets

### Testing
- [ ] Unit tests for hooks
- [ ] Component tests with React Native Testing Library
- [ ] Integration tests for full flow
- [ ] Performance tests (FPS monitoring)
- [ ] Accessibility tests (automated + manual)

### Documentation
- [ ] JSDoc comments for all public functions
- [ ] README for widget usage
- [ ] Configuration guide
- [ ] Migration guide from old flow
- [ ] Troubleshooting guide

---

## 🚀 Success Metrics

### Quantitative
- **Completion Time**: Target 50% reduction (45s → 22s)
- **Completion Rate**: Target 95%+ (up from ~70%)
- **Frame Rate**: 60 FPS throughout (measured via Reanimated profiler)
- **Error Rate**: <1% of submissions fail

### Qualitative
- User feedback: NPS score improvement
- App store reviews mentioning mood logging
- Support tickets reduction
- Developer satisfaction (maintainability)

---

## 👥 Agent Delegation Summary

| Phase | Agent | Task | Duration | Priority |
|-------|-------|------|----------|----------|
| 2 | `ux-expert` | UX flow review & recommendations | 30-60m | High |
| 3 | `ui-design-expert` | Design system & specifications | 1-2h | High |
| 7 | `supabase-expert` | Backend API integration | 2-3h | High |
| 1, 4, 5, 6, 8, 9, 10 | Direct Implementation | Core development | 18-22h | High |

**Total Estimated Time**: 22-28 hours

---

## 📝 Next Steps (Immediate)

1. ✅ **Review & approve this roadmap** with product/design team
2. 🔄 **Delegate to UX expert** for flow validation
3. 🔄 **Delegate to UI design expert** for visual specs
4. ⏳ **Begin Phase 1** (foundation setup) while waiting for expert feedback
5. ⏳ **Delegate to Supabase expert** for backend integration planning

---

**Document Version**: 1.0
**Last Updated**: 2025-11-06
**Owner**: Development Team
**Status**: Ready for delegation & implementation
