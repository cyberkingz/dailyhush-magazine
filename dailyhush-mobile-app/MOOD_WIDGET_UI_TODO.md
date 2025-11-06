# Mood Widget UI Implementation - Complete Todo List
**Date**: 2025-11-06
**Status**: Foundation Complete (40%) | UI Implementation Pending (60%)
**Estimated Time**: 12-16 hours

---

## 📋 OVERVIEW

This todo list covers the complete UI implementation of the mood widget, from building all presentation components to final testing and deployment. The tasks are organized by category and dependency order.

**Total Tasks**: 65
**Completed**: 0
**Remaining**: 65

---

## 🏗️ PHASE 1: COMPONENT STRUCTURE (1 task | 5 mins)

### Setup
- [ ] **1.1** Create components folder structure
  - Path: `dailyhush-mobile-app/components/mood-widget/`
  - Files to create: 12 components + index.ts

---

## 🎨 PHASE 2: BASE COMPONENTS (2 tasks | 1-2 hours)

Build simplest components first (no complex animations).

### 2.1 EmptyState Component
- [ ] **2.1.1** Build EmptyState.tsx (initial "Log Mood" prompt)
  - CloudSun icon from Lucide
  - "How are you feeling today?" title
  - Description text
  - Floating PillButton
  - Props: onPress, title?, description?, isLoading?
  - **Estimated time**: 30-45 mins

### 2.2 WeatherDisplay Component
- [ ] **2.2.1** Build WeatherDisplay.tsx (logged mood display)
  - Weather icon + name (from emotionalWeatherColors)
  - Mood rating dots (● ● ● ○ ○)
  - Notes preview (2 lines max, ellipsis)
  - "Today's Check-In" label
  - "Update" button (top-right)
  - Props: weather, moodRating, notes?, onUpdate, visible
  - **Estimated time**: 45-60 mins

---

## ✨ PHASE 3: ANIMATED COMPONENTS (3 tasks | 3-4 hours)

Build components with complex animations.

### 3.1 SuccessCheckmark Component
- [ ] **3.1.1** Build SuccessCheckmark.tsx (SVG animated checkmark)
  - Use react-native-svg
  - AnimatedPath with strokeDashoffset
  - Hook: useSuccessAnimation
  - Glow effect (optional)
  - Success message ("Mood logged!")
  - Auto-trigger on visible
  - Props: visible, onComplete, config
  - **Estimated time**: 1-1.5 hours

### 3.2 MoodSelector Component
- [ ] **3.2.1** Build MoodSelector.tsx (5 mood choices with animations)
  - Grid of 5 emoji buttons
  - Hook: useMoodSelection
  - Staggered entrance (50ms delay)
  - Haptic feedback on tap
  - Selection pulse + wiggle
  - Fly-out for non-selected
  - Accessibility labels per mood
  - Props: moods, onSelect, selected?, visible, config
  - **Estimated time**: 1.5-2 hours

### 3.3 IntensitySlider Component (CRITICAL - Accessibility)
- [ ] **3.3.1** Build IntensitySlider.tsx (gesture + tap-to-select)
  - **Gesture mode**: Pan gesture slider with snap-to-step
  - **Tap mode**: Tappable number buttons (1-7) for accessibility
  - Hook: useIntensitySlider
  - Scale labels: "Low intensity ← → High intensity" (UX P0 fix)
  - Step indicators: dots AND numbers (showIndicators: 'both')
  - Haptic feedback on step change
  - Active track fill animation
  - GestureDetector wrapper
  - Props: range, initialValue, onChange, visible, config
  - **Estimated time**: 2-2.5 hours
  - **⚠️ Must address UX P0 finding #3**

---

## ⌨️ PHASE 4: INPUT COMPONENT (1 task | 1 hour)

### 4.1 QuickNotesInput Component
- [ ] **4.1.1** Build QuickNotesInput.tsx (optional notes input)
  - TextInput with placeholder
  - Character counter (200 max)
  - Auto-focus when visible
  - KeyboardAvoidingView wrapper
  - Equal-weight buttons: "Skip" and "Submit" (UX P0 fix #5)
  - Accessibility labels
  - Props: value, onChange, onSkip, onSubmit, visible, config, isSubmitting?
  - **Estimated time**: 1 hour

---

## 🛠️ PHASE 5: UTILITY COMPONENTS (4 tasks | 1-2 hours)

Build supporting UI components.

### 5.1 CloseButton Component
- [ ] **5.1.1** Build CloseButton.tsx (top-right X, always visible)
  - X icon from Lucide
  - Position: absolute top-right
  - Circular background with opacity
  - Press state animation
  - Haptic feedback on press
  - Accessibility: "Cancel mood logging"
  - Props: onPress, style?
  - **Estimated time**: 20 mins
  - **⚠️ Addresses UX P0 finding #1**

### 5.2 ProgressIndicator Component
- [ ] **5.2.1** Build ProgressIndicator.tsx (Step X of Y)
  - Dots or numbers showing current step
  - Position: top-center
  - Smooth dot transitions
  - Accessibility announcement on step change
  - Props: currentStep, totalSteps, visible
  - **Estimated time**: 20 mins

### 5.3 LoadingOverlay Component
- [ ] **5.3.1** Build LoadingOverlay.tsx (during submission)
  - Semi-transparent overlay
  - ActivityIndicator (lime color)
  - "Saving..." text
  - Prevents double-tap
  - Props: visible, message?
  - **Estimated time**: 15 mins
  - **⚠️ Addresses UX P0 finding #8**

### 5.4 ErrorDisplay Component
- [ ] **5.4.1** Build ErrorDisplay.tsx (inline error + retry)
  - Error icon (AlertCircle from Lucide)
  - Error message (user-friendly)
  - "Try Again" button
  - "Cancel" button
  - Fade in/out animation
  - Props: error, onRetry, onCancel, visible
  - **Estimated time**: 30 mins
  - **⚠️ Addresses UX P0 finding #8**

### 5.5 Backdrop Component
- [ ] **5.5.1** Build Backdrop.tsx (tap-outside-to-cancel)
  - Semi-transparent overlay
  - Pressable wrapper
  - Fade in/out animation
  - Prevents interaction with content behind
  - Props: visible, onPress
  - **Estimated time**: 15 mins
  - **⚠️ Addresses UX P0 finding #2**

---

## 🎯 PHASE 6: MAIN CONTAINER (7 tasks | 3-4 hours)

Build the orchestrator that ties everything together.

### 6.1 Container Structure
- [ ] **6.1.1** Build EmotionalWeatherWidget.tsx (main container)
  - Animated.View wrapper (for card expansion)
  - Hook: useCardExpansion
  - Hook: useWidgetStateMachine
  - Props: weather?, moodRating?, notes?, onMoodSubmit, onUpdate?, config?, style?
  - **Estimated time**: 30 mins

### 6.2 Component Integration
- [ ] **6.2.1** Integrate all child components into container
  - EmptyState (state === 'empty')
  - MoodSelector (state === 'mood')
  - IntensitySlider (state === 'intensity')
  - QuickNotesInput (state === 'notes' && enableQuickNotes)
  - SuccessCheckmark (state === 'success')
  - WeatherDisplay (state === 'display')
  - CloseButton (always visible when expanded)
  - ProgressIndicator (when expanded)
  - LoadingOverlay (when isLoading)
  - ErrorDisplay (when error)
  - Backdrop (when expanded && enableTapOutside)
  - **Estimated time**: 1 hour

### 6.3 State-Based Rendering
- [ ] **6.3.1** Add state-based component rendering logic
  - Conditional rendering based on widgetState
  - Smooth transitions between states
  - Preserve data across state changes
  - **Estimated time**: 30 mins

### 6.4 Animation Integration
- [ ] **6.4.1** Wire up all animation triggers and transitions
  - startFlow() → expand card + show MoodSelector
  - selectMood() → hide other moods + show IntensitySlider
  - selectIntensity() → show QuickNotesInput (or skip to success)
  - submitNotes() → show SuccessCheckmark + API call
  - completeSuccess() → collapse card + show WeatherDisplay
  - **Estimated time**: 1 hour

### 6.5 Interaction Handlers
- [ ] **6.5.1** Add tap-outside-to-cancel functionality
  - Backdrop onPress → cancel()
  - Collapse card + reset state
  - **Estimated time**: 15 mins
  - **⚠️ Addresses UX P0 finding #2**

- [ ] **6.5.2** Add Android back button handler
  - useEffect with BackHandler
  - Intercept back press when expanded
  - cancel() instead of app navigation
  - Clean up listener on unmount
  - **Estimated time**: 20 mins
  - **⚠️ Addresses UX P0 finding #7**

### 6.6 Update Flow
- [ ] **6.6.1** Add update vs log flow logic
  - If weather/moodRating exists → pre-populate data
  - Change button text: "Log Mood" → "Update Mood"
  - startFlow() → populate existing mood/intensity/notes
  - **Estimated time**: 30 mins
  - **⚠️ Addresses UX P0 finding #9**

---

## ♿ PHASE 7: ACCESSIBILITY (4 tasks | 1-2 hours)

Ensure WCAG 2.1 AA compliance.

### 7.1 Accessibility Labels
- [ ] **7.1.1** Add accessibility labels to all interactive elements
  - accessibilityLabel on all Pressable/TouchableOpacity
  - accessibilityHint for context
  - accessibilityRole for semantic meaning
  - Use ACCESSIBILITY_LABELS from widgetConfig
  - **Estimated time**: 30 mins

### 7.2 Live Region Announcements
- [ ] **7.2.1** Add accessibility live region announcements
  - accessibilityLiveRegion="polite" on state containers
  - Announce state changes: "Mood selector visible", "Intensity slider visible", etc.
  - Announce success: "Mood logged successfully"
  - Announce errors: error message
  - **Estimated time**: 30 mins
  - **⚠️ Addresses UX P0 finding #8**

### 7.3 Haptic Feedback
- [ ] **7.3.1** Add haptic feedback to all interactions
  - Mood selection: Medium impact
  - Intensity change: Light impact
  - Submit: Success notification
  - Cancel: Warning impact
  - Error: Error notification
  - Use Haptics.impactAsync() and Haptics.notificationAsync()
  - Respect enableHaptics config flag
  - **Estimated time**: 20 mins

### 7.4 Minimum Touch Targets
- [ ] **7.4.1** Verify all touch targets are 44x44pt minimum
  - Mood emoji buttons
  - Intensity slider numbers
  - Close button
  - Skip/Submit buttons
  - Add hitSlop if needed
  - **Estimated time**: 20 mins

---

## 🎨 PHASE 8: ERROR & LOADING STATES (2 tasks | 30 mins)

### 8.1 Error State UI
- [ ] **8.1.1** Implement error state UI
  - Show ErrorDisplay component when error
  - Inline error (don't navigate away)
  - Retry button → retry same action
  - Cancel button → reset widget
  - **Estimated time**: 15 mins

### 8.2 Loading State UI
- [ ] **8.2.1** Implement loading state UI
  - Show LoadingOverlay when isLoading
  - Disable all buttons during submission
  - Prevent double-tap on submit
  - Show spinner + "Saving..." text
  - **Estimated time**: 15 mins

---

## 📦 PHASE 9: EXPORTS & INTEGRATION (4 tasks | 1 hour)

### 9.1 Component Exports
- [ ] **9.1.1** Create component index.ts with all exports
  - Export EmotionalWeatherWidget as default
  - Export all sub-components (named exports)
  - Export types (prop interfaces)
  - **Estimated time**: 10 mins

### 9.2 Home Page Integration
- [ ] **9.2.1** Update home page to import new widget
  - Replace: `import { EmotionalWeather } from '@/components/profile/EmotionalWeather'`
  - With: `import { EmotionalWeatherWidget } from '@/components/mood-widget'`
  - **Estimated time**: 5 mins

- [ ] **9.2.2** Remove old navigation to /mood-capture/mood
  - Delete: `const handleCheckIn = () => router.push('/mood-capture/mood');`
  - **Estimated time**: 2 mins

- [ ] **9.2.3** Wire up onMoodSubmit callback
  - Use useMoodLogging hook
  - onMoodSubmit={async (data) => { await submitMood(data); await refetchTodayMood(); }}
  - **Estimated time**: 10 mins

### 9.3 Fetch Today's Mood
- [ ] **9.3.1** Fetch and display existing mood on mount
  - Use getTodayMood() from useMoodLogging
  - Pass weather, moodRating, notes to widget
  - **Estimated time**: 15 mins

---

## 🧪 PHASE 10: FUNCTIONAL TESTING (15 tasks | 2-3 hours)

Test all user flows and interactions.

### 10.1 Happy Path Testing
- [ ] **10.1.1** Test empty state → log mood flow
  - Tap "Log Mood" → card expands
  - Moods appear with stagger
  - Select mood → moods fly out
  - Intensity slider appears
  - Set intensity → notes input appears
  - Type notes → submit
  - Success animation plays
  - Card collapses → weather displays
  - **Estimated time**: 15 mins

- [ ] **10.1.2** Test mood selection with all 5 moods
  - Test each mood emoji
  - Verify correct color/label
  - Verify pulse animation
  - Verify haptic feedback
  - **Estimated time**: 10 mins

- [ ] **10.1.3** Test intensity slider (both modes)
  - Gesture mode: drag slider
  - Tap mode: tap numbers 1-7
  - Verify snapping to steps
  - Verify haptic on change
  - **Estimated time**: 10 mins

- [ ] **10.1.4** Test quick notes (submit with notes)
  - Type notes
  - Character counter updates
  - Submit button enabled
  - Notes saved
  - **Estimated time**: 5 mins

- [ ] **10.1.5** Test quick notes (skip notes)
  - Tap "Skip" button
  - Goes to success
  - No notes saved
  - **Estimated time**: 5 mins

- [ ] **10.1.6** Test success animation
  - Checkmark draws
  - Rotation + scale bounce
  - Auto-collapse after 800ms
  - **Estimated time**: 5 mins

- [ ] **10.1.7** Test weather display state
  - Weather icon correct
  - Mood rating dots correct
  - Notes preview shown (if any)
  - "Today's Check-In" label
  - **Estimated time**: 5 mins

- [ ] **10.1.8** Test update flow
  - If mood already logged
  - Button says "Update Mood"
  - Pre-populates existing data
  - Can change and resubmit
  - **Estimated time**: 10 mins

### 10.2 Cancellation Testing
- [ ] **10.2.1** Test cancel at each stage
  - Cancel from mood selection
  - Cancel from intensity
  - Cancel from notes
  - Card collapses, state resets
  - **Estimated time**: 10 mins

- [ ] **10.2.2** Test tap-outside-to-cancel
  - Tap backdrop during flow
  - Card collapses
  - No data saved
  - **Estimated time**: 5 mins

- [ ] **10.2.3** Test Android back button
  - Press back during flow
  - Widget cancels (not app)
  - **Estimated time**: 5 mins

### 10.3 Error Handling Testing
- [ ] **10.3.1** Test error state (network failure)
  - Simulate network error
  - Error display shows
  - "Try Again" button works
  - "Cancel" button works
  - **Estimated time**: 10 mins

- [ ] **10.3.2** Test offline mode
  - Turn off network
  - Submit mood
  - Queued for sync
  - Turn on network
  - Auto-syncs in background
  - **Estimated time**: 15 mins

- [ ] **10.3.3** Test loading states
  - Slow network simulation
  - Loading overlay shows
  - Buttons disabled
  - Spinner visible
  - **Estimated time**: 5 mins

---

## 📱 PHASE 11: RESPONSIVE TESTING (4 tasks | 30 mins)

Test on different device sizes.

- [ ] **11.1** Test on iPhone SE (375x667, smallest)
  - Collapsed height: 220px
  - Expanded height: 420px
  - Emoji size: 40px
  - All text readable
  - **Estimated time**: 10 mins

- [ ] **11.2** Test on iPhone 14 Pro Max (430x932, largest phone)
  - Default dimensions
  - All spacing correct
  - **Estimated time**: 5 mins

- [ ] **11.3** Test on iPad (744x1133, tablet)
  - Collapsed height: 280px
  - Expanded height: 560px
  - Emoji size: 56px
  - Max width constraint works
  - **Estimated time**: 10 mins

- [ ] **11.4** Test in landscape orientation
  - Card height adjusts to viewport
  - Horizontal layout works
  - Keyboard doesn't obscure input
  - **Estimated time**: 5 mins

---

## ♿ PHASE 12: ACCESSIBILITY TESTING (3 tasks | 1 hour)

Test with assistive technologies.

- [ ] **12.1** Test with VoiceOver (iOS)
  - All elements have labels
  - State changes announced
  - Can navigate with swipes
  - Can activate with double-tap
  - Focus order is logical
  - **Estimated time**: 20 mins

- [ ] **12.2** Test with TalkBack (Android)
  - Same as VoiceOver but for Android
  - Test on Android device
  - **Estimated time**: 20 mins

- [ ] **12.3** Test with Switch Control (motor impairment)
  - All elements reachable
  - Tap targets large enough
  - No gesture-only interactions (slider has tap alternative)
  - **Estimated time**: 20 mins

---

## ⚡ PHASE 13: PERFORMANCE TESTING (2 tasks | 30 mins)

Ensure 60 FPS and no memory leaks.

- [ ] **13.1** Verify 60 FPS during animations
  - Use React Native Reanimated profiler
  - Monitor frame rate during:
    - Card expansion/collapse
    - Mood stagger
    - Slider drag
    - Success animation
  - All should maintain 60 FPS
  - **Estimated time**: 20 mins

- [ ] **13.2** Profile memory usage
  - Open widget, close widget (10 times)
  - Memory should return to baseline
  - No leaks detected
  - Use React DevTools Profiler
  - **Estimated time**: 10 mins

---

## 📊 PHASE 14: ANALYTICS INTEGRATION (7 tasks | 30 mins)

Track all user interactions.

- [ ] **14.1** Add MOOD_WIDGET_EXPANDED event
  - Track: source (home_page), hasExistingMood (boolean)
  - **Estimated time**: 5 mins

- [ ] **14.2** Add MOOD_SELECTED event
  - Track: mood (string), timeToSelect (ms)
  - **Estimated time**: 5 mins

- [ ] **14.3** Add INTENSITY_SELECTED event
  - Track: intensity (1-7), timeToSelect (ms)
  - **Estimated time**: 5 mins

- [ ] **14.4** Add NOTES_SUBMITTED event
  - Track: notesLength (number), wasSkipped (boolean)
  - **Estimated time**: 5 mins

- [ ] **14.5** Add MOOD_LOG_COMPLETED event
  - Track: totalTime (ms), includesNotes (boolean)
  - **Estimated time**: 5 mins

- [ ] **14.6** Add WIDGET_CANCELED event
  - Track: state (which stage canceled from)
  - **Estimated time**: 5 mins

- [ ] **14.7** Add WIDGET_ERROR event
  - Track: error (string), state (which stage errored)
  - **Estimated time**: 5 mins

---

## 📝 PHASE 15: DOCUMENTATION (2 tasks | 30 mins)

- [ ] **15.1** Create component usage documentation
  - How to use EmotionalWeatherWidget
  - Props reference
  - Configuration options
  - Examples
  - **Estimated time**: 20 mins

- [ ] **15.2** Create troubleshooting guide
  - Common issues and solutions
  - Debugging tips
  - Performance optimization
  - **Estimated time**: 10 mins

---

## 🐛 PHASE 16: BUG FIXES & OPTIMIZATION (2 tasks | 1-2 hours)

- [ ] **16.1** Fix any bugs discovered during testing
  - Document each bug
  - Fix and verify
  - **Estimated time**: 1-2 hours (variable)

- [ ] **16.2** Optimize animations based on profiling
  - Reduce unnecessary re-renders
  - Optimize spring configs
  - Reduce animation complexity if needed
  - **Estimated time**: 30 mins

---

## ✅ PHASE 17: FINALIZATION (3 tasks | 30 mins)

- [ ] **17.1** Final code review and cleanup
  - Remove console.logs
  - Remove commented code
  - Verify all TODOs addressed
  - Check code formatting
  - **Estimated time**: 15 mins

- [ ] **17.2** Commit and push all components
  - Clear commit message
  - Squash if needed
  - **Estimated time**: 10 mins

- [ ] **17.3** Create pull request with summary
  - Detailed PR description
  - Screenshots/video
  - Testing checklist
  - Link to UX review findings
  - **Estimated time**: 15 mins

---

## 📊 SUMMARY BY CATEGORY

| Category | Tasks | Est. Time | Priority |
|----------|-------|-----------|----------|
| **Component Structure** | 1 | 5 mins | High |
| **Base Components** | 2 | 1-2 hours | High |
| **Animated Components** | 3 | 3-4 hours | High |
| **Input Component** | 1 | 1 hour | High |
| **Utility Components** | 4 | 1-2 hours | High |
| **Main Container** | 7 | 3-4 hours | High |
| **Accessibility** | 4 | 1-2 hours | Critical |
| **Error & Loading** | 2 | 30 mins | High |
| **Exports & Integration** | 4 | 1 hour | High |
| **Functional Testing** | 15 | 2-3 hours | Critical |
| **Responsive Testing** | 4 | 30 mins | Medium |
| **Accessibility Testing** | 3 | 1 hour | Critical |
| **Performance Testing** | 2 | 30 mins | Medium |
| **Analytics** | 7 | 30 mins | Medium |
| **Documentation** | 2 | 30 mins | Low |
| **Bug Fixes** | 2 | 1-2 hours | High |
| **Finalization** | 3 | 30 mins | High |

**Total**: 65 tasks | **12-16 hours**

---

## 🎯 CRITICAL PATH (Must Do First)

These tasks must be done in order:

1. ✅ Create folder structure
2. ✅ Build EmptyState
3. ✅ Build WeatherDisplay
4. ✅ Build SuccessCheckmark
5. ✅ Build MoodSelector
6. ✅ Build IntensitySlider (with accessibility!)
7. ✅ Build QuickNotesInput
8. ✅ Build utility components (CloseButton, etc.)
9. ✅ Build main container
10. ✅ Integrate all components
11. ✅ Wire animations
12. ✅ Add accessibility
13. ✅ Integrate with home page
14. ✅ Test everything
15. ✅ Fix bugs
16. ✅ Commit & PR

---

## 🚨 UX P0 FIXES TO ADDRESS

From the UX expert review, these MUST be implemented:

1. ✅ **Close button** (always visible top-right) → Task 5.1.1
2. ✅ **Tap-outside-to-cancel** → Tasks 5.5.1 + 6.5.1
3. ✅ **Slider tap alternative** → Task 3.3.1 (tappable numbers 1-7)
4. ✅ **Intensity scale labels** → Task 3.3.1 ("Low ← → High")
5. ✅ **Notes optional** → Task 4.1.1 (equal-weight Skip button)
6. ✅ **Screen reader announcements** → Task 7.2.1
7. ✅ **Android back button** → Task 6.5.2
8. ✅ **Loading states** → Tasks 5.3.1 + 8.2.1
9. ✅ **Update flow** → Task 6.6.1

All P0 fixes are mapped to specific tasks above. ✅

---

**Ready to Start**: Yes ✅
**Estimated Completion**: 12-16 hours
**Complexity**: Medium-High
**Risk**: Low (foundation is solid)

Would you like me to start implementing? I recommend starting with Phase 1-3 (components) in this session.
