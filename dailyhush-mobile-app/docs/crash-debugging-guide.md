# Mood Widget Crash Debugging Guide

**Date**: 2025-11-07
**Issue**: Silent crash on mood submission
**Status**: 🔍 **DEBUGGING** - Comprehensive logging added

---

## What We've Done

### 1. ✅ Fixed Code Issues
- Converted `isPlaying` from SharedValue to React state
- Converted `isExpanded` from SharedValue to React state
- Removed shared values from useCallback dependency arrays
- Fixed Babel plugin conflicts
- Disabled haptics (suspected simulator crash)

### 2. ✅ Cleared All Caches
```bash
rm -rf .expo
rm -rf node_modules/.cache
watchman watch-del-all
rm -rf node_modules && npm install
npx expo start --clear
```

### 3. ✅ Added Comprehensive Debug Logging
All steps of the animation trigger are now logged:

```typescript
[Animation] Trigger start
[Animation] setIsPlaying done
[Animation] Starting path animation
[Animation] Path animation queued
[Animation] Starting scale animation
[Animation] Scale animation queued
[Animation] Setting rotation
[Animation] Rotation set
[Animation] Checking glow: true/false
[Animation] Starting glow animation (if enabled)
[Animation] Glow animation queued (if enabled)
[Animation] Setting completion callback, hasCallback: true/false
[Animation] Trigger complete
[Animation] Completion callback executing (after delay)
[Animation] setIsPlaying(false) done
[Animation] onComplete() done
```

---

## How to Test

### Step 1: Clear Everything
```bash
# Stop Metro if running (Ctrl+C)

# Clear Supabase logs (already done via MCP)
# Clear Metro cache
npx expo start --clear
```

### Step 2: Submit a Mood
1. Open app
2. Click "Log Mood"
3. Select a mood (e.g., "Calm")
4. Select intensity (e.g., 4/5)
5. Type notes (e.g., "test")
6. Click "Submit"
7. **WATCH THE LOGS CAREFULLY**

### Step 3: Identify Crash Location
Find the **LAST** log that appears before the crash:

---

## What the Logs Will Tell Us

### Scenario A: Crash Before Animation Start
```
LOG  NOTES_SUBMITTED {"notesLength": 4}
LOG  [Widget] Submitting mood: {...}
[APP CRASHES - NO OTHER LOGS]
```

**Meaning**: Crash happens in state machine or before animation trigger
**Likely cause**: API call or state transition issue
**Next step**: Add logging to submitNotes() in useWidgetStateMachine

---

### Scenario B: Crash During Animation Setup
```
LOG  [Animation] Trigger start
LOG  [Animation] setIsPlaying done
LOG  [Animation] Starting path animation
[APP CRASHES]
```

**Meaning**: Crash in drawProgress.value assignment
**Likely cause**: Shared value not properly initialized
**Next step**: Check SuccessCheckmark initialization

---

### Scenario C: Crash During Scale Animation
```
LOG  [Animation] Path animation queued
LOG  [Animation] Starting scale animation
[APP CRASHES]
```

**Meaning**: Crash in scale.value assignment
**Likely cause**: withSequence or withSpring issue
**Next step**: Simplify scale animation (remove sequence)

---

### Scenario D: Crash During Glow Setup
```
LOG  [Animation] Rotation set
LOG  [Animation] Checking glow: true
LOG  [Animation] Starting glow animation
[APP CRASHES]
```

**Meaning**: Crash in glowOpacity.value assignment
**Likely cause**: Conditional animation issue
**Next step**: Disable glow effect

---

### Scenario E: Crash After Trigger Complete
```
LOG  [Animation] Trigger complete
[APP CRASHES]
```

**Meaning**: Crash in component render after trigger
**Likely cause**: useAnimatedStyle or useAnimatedProps issue
**Next step**: Check SuccessCheckmark render logic

---

### Scenario F: Crash During Completion Callback
```
LOG  [Animation] Trigger complete
[... time passes ...]
LOG  [Animation] Completion callback executing
LOG  [Animation] setIsPlaying(false) done
[APP CRASHES]
```

**Meaning**: Crash when calling onComplete()
**Likely cause**: handleCompleteSuccess() issue in EmotionalWeatherWidget
**Next step**: Add logging to handleCompleteSuccess()

---

### Scenario G: Animation Works, Crash Later
```
LOG  [Animation] onComplete() done
LOG  [Widget] Success animation complete
[... time passes ...]
[APP CRASHES]
```

**Meaning**: Crash during state transition or collapse
**Likely cause**: Card collapse animation or display state rendering
**Next step**: Add logging to collapse() and completeSuccess()

---

## Most Likely Causes (Ranked)

### 1. 🔥 Haptics API (Most Likely - ALREADY DISABLED)
**Status**: ✅ Disabled
**Reason**: Haptics.notificationAsync() crashes on iOS simulator

### 2. 🔥 Shared Value in Render (Fixed - But May Be Cached)
**Status**: ✅ Fixed, but Metro may still be serving cached code
**Evidence**: Previous error showed this exact issue
**Solution**: Restart Metro with `--clear` flag

### 3. 🔥 Worklet/Reanimated Plugin Conflict
**Status**: ✅ Fixed in babel.config.js
**Evidence**: Duplicate plugin error resolved
**But**: Old transformed code may still be cached

### 4. 🔥 Native Module Crash (Silent - No JS Error)
**Evidence**: No error logs, just silent crash
**Suspects**:
  - Haptics (disabled)
  - SVG rendering
  - Animated props
  - Shadow rendering

### 5. 🔥 Component Unmount During Animation
**Status**: Should be safe (cleanup on unmount)
**But**: May crash if onComplete() runs after unmount
**Check**: isMounted pattern in useWidgetStateMachine

---

## Special Checks

### Check 1: Is Animation Even Triggered?
If you see **NO** `[Animation]` logs at all:
- Animation trigger is not being called
- SuccessCheckmark component not rendering
- State is not transitioning to 'success'

### Check 2: Metro Cache Still Serving Old Code?
If crash happens with old error message:
```
ERROR  [TypeError: Cannot create property 'value' on boolean 'false']
```
Then Metro is **STILL** serving cached code. Nuclear option:
```bash
# Kill all Metro/Expo processes
killall node
killall expo
killall watchman

# Remove ALL caches
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
watchman watch-del-all

# Reinstall
npm install

# Start completely fresh
npx expo start --clear --reset-cache
```

### Check 3: SVG Rendering Issue?
If crash happens in Scenario B or E (during/after trigger):
- May be SVG Path rendering issue
- Try disabling SVG checkmark temporarily
- Replace with simple Animated.View

---

## Next Steps Based on Results

**AFTER YOU TEST:**

1. Copy **ALL** logs starting from "LOG Mood" to crash
2. Identify the **LAST** log that appears
3. Match it to one of the scenarios above
4. I'll provide targeted fix for that specific scenario

---

## Code Changes Made

### File: hooks/widget/useSuccessAnimation.ts
- ✅ Converted isPlaying to React state
- ✅ Removed shared values from deps
- ✅ Disabled haptics
- ✅ Added comprehensive logging

### File: hooks/widget/useCardExpansion.ts
- ✅ Converted isExpanded to React state
- ✅ Removed shared values from deps

### File: babel.config.js
- ✅ Added unique plugin names

### File: components/mood-widget/EmotionalWeatherWidget.tsx
- ✅ Re-enabled cache clearing on mount (temporary)

---

## Expected Behavior (If Working)

You should see this log sequence:
```
LOG  NOTES_SUBMITTED {"notesLength": 4}
LOG  [Widget] Submitting mood: {...}
LOG  [Animation] Trigger start
LOG  [Animation] setIsPlaying done
LOG  [Animation] Starting path animation
LOG  [Animation] Path animation queued
LOG  [Animation] Starting scale animation
LOG  [Animation] Scale animation queued
LOG  [Animation] Setting rotation
LOG  [Animation] Rotation set
LOG  [Animation] Checking glow: true
LOG  [Animation] Starting glow animation
LOG  [Animation] Glow animation queued
LOG  [Animation] Setting completion callback, hasCallback: true
LOG  [Animation] Trigger complete
[... 400ms delay ...]
LOG  [Animation] Completion callback executing
LOG  [Animation] setIsPlaying(false) done
LOG  [Animation] onComplete() done
LOG  [Widget] Success animation complete
[Card collapses]
[Widget shows completed mood]
```

---

## Test Now

**Please submit a mood and copy all the logs!** 🔍

The logs will tell us exactly where it's crashing and we can fix it immediately.
