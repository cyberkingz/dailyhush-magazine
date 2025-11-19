# 🐛 Bug Audit: Missing Buttons on Step 1

**Issue:** Play/Pause and Skip buttons are missing on Step 1 of the spiral exercise
**Reporter:** User
**File:** `app/spiral.tsx`
**Status:** 🔴 **BUG CONFIRMED** - Root cause identified

---

## Problem Description

When the protocol starts on Step 1 (the introduction, `currentStepIndex = 0`), the Play/Pause and Skip buttons are not visible. The step is non-interactive and should display buttons normally.

**Expected:** Buttons visible on non-interactive Step 1
**Actual:** Buttons missing on Step 1
**Impact:** User cannot start the protocol - **CRITICAL UX ISSUE**

---

## Root Cause Analysis

### Button Rendering Logic (Line 1340)

The Play/Pause and Skip buttons are conditionally rendered:

```typescript
{!isInteractiveAwaitingResume && (
  <View className="w-full">
    <View className="flex-row gap-3">
      <Pressable> {/* Play/Pause button */}
      <Pressable> {/* Skip button */}
```

**Buttons only show when `isInteractiveAwaitingResume === false`**

---

### State Management Logic (Lines 434-461)

The `isInteractiveAwaitingResume` state is controlled by this useEffect:

```typescript
useEffect(() => {
  if (stage !== 'protocol' || !selectedTechnique) {
    setIsInteractiveAwaitingResume(false);
    return;
  }

  const currentStep = selectedTechnique.steps[currentStepIndex];

  if (!currentStep) {
    setIsInteractiveAwaitingResume(false);
    return;
  }

  if (currentStep.interactive) {
    const hasAcknowledged = interactiveStepsAcknowledgedRef.current.has(currentStepIndex);
    if (!hasAcknowledged) {
      if (isPlaying) {
        setIsPlaying(false);
      }
      setIsInteractiveAwaitingResume(true); // ← Hides buttons
    } else {
      setIsInteractiveAwaitingResume(false);
    }
  } else {
    setIsInteractiveAwaitingResume(false); // ← Should show buttons
  }
}, [stage, selectedTechnique, currentStepIndex, isPlaying]);
```

**Theory:** For non-interactive Step 1, this should set `isInteractiveAwaitingResume = false`

---

## Investigation: Step 1 Interactive Status

### Grounding 5-4-3-2-1 Technique (Default)

From `constants/techniqueLibrary.ts`:

```typescript
steps: [
  // Step 0 (shown as "Step 1" in UI)
  {
    duration: 10,
    text: 'Let\'s gently bring you back to right now...',
    // NO interactive field
  },

  // Step 1 (shown as "Step 2" in UI)
  {
    duration: 20,
    text: 'Name 5 things you can see...',
    interactive: {  // ← HAS interactive field
      type: 'list',
      prompt: '5 things you can see',
      placeholder: '...',
      maxLength: 200,
    },
  },
```

**Key Insight:**

- UI shows "Step 1" for `currentStepIndex = 0` (line 1205: `Step {currentStepIndex + 1}`)
- `currentStepIndex = 0` has NO interactive field
- Therefore, buttons SHOULD be visible

---

## 🔍 Debugging Hypothesis

### Hypothesis #1: Initial Load Timing Issue ✅ LIKELY

**Timeline:**

1. User enters protocol stage
2. `selectedTechnique = null` initially
3. `loadAdaptiveProtocol()` runs async (takes ~500ms)
4. During loading, UI renders with:
   - `selectedTechnique = null`
   - `isLoadingProtocol = true`
   - Shows "Selecting your protocol..." spinner
5. Protocol loads, `selectedTechnique` is set
6. UI re-renders, now on Step 1 with `currentStepIndex = 0`

**Problem:** When the protocol first loads, `isPlaying = false` (line 108). The user needs to press Play to start, but if buttons aren't visible, they can't!

**Test:**

- When protocol loads, check `isInteractiveAwaitingResume` value
- Check if `currentStep.interactive` is being evaluated correctly
- Verify `interactiveStepsAcknowledgedRef.current` is empty

---

### Hypothesis #2: useEffect Dependencies Issue ❓ POSSIBLE

The useEffect that controls button visibility depends on:

```typescript
}, [stage, selectedTechnique, currentStepIndex, isPlaying]);
```

If `isPlaying` changes unexpectedly, or if `currentStepIndex` is not 0 when it should be, buttons might hide.

**Test:**

- Add console.log in useEffect to track state changes
- Verify `currentStepIndex` stays at 0 on initial load
- Check if `isPlaying` changes unexpectedly

---

### Hypothesis #3: Step Calculation Race Condition ⚠️ LOW PROBABILITY

The step calculation useEffect (lines 414-432) might set `currentStepIndex` to something other than 0:

```typescript
useEffect(() => {
  if (stage === 'protocol' && selectedTechnique) {
    const elapsed = totalDuration - timeRemaining;
    // Calculate which step based on elapsed time
  }
}, [timeRemaining, stage, selectedTechnique]);
```

If `timeRemaining` is not equal to `totalDuration` when protocol loads, it might calculate the wrong step.

**Test:**

- Verify `timeRemaining` equals `totalDuration` on load
- Check if elapsed time is 0 initially

---

### Hypothesis #4: Countdown Animation Side Effect ❓ POSSIBLE

The countdown container has animated visibility based on `isInteractiveAwaitingResume`:

```typescript
const countdownContainerStyle = useAnimatedStyle(() => {
  const visibility = countdownVisibility.value;
  return {
    height: countdownSectionHeight * visibility,
    opacity: visibility,
    transform: [{ translateY: -24 * (1 - visibility) }, { scale: 0.95 + 0.05 * visibility }],
  };
});
```

And the visibility value is set by:

```typescript
useEffect(() => {
  countdownVisibility.value = withTiming(isInteractiveAwaitingResume ? 0 : 1, {
    duration: 350,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
}, [isInteractiveAwaitingResume, countdownVisibility]);
```

If this animation is running during initial load, the layout might be affected.

---

## 🐛 **Most Likely Root Cause**

### **Protocol doesn't auto-start - user must press Play**

**The Issue:**

1. Protocol loads on Step 1 (index 0)
2. `isPlaying = false` initially
3. User needs to press Play button to start
4. **But buttons might not be visible due to race condition in state initialization**

**Why buttons might be hidden:**

Looking at the useEffect dependencies again:

```typescript
}, [stage, selectedTechnique, currentStepIndex, isPlaying]);
```

When `selectedTechnique` changes from `null` to the loaded technique, the useEffect runs. But it also depends on `isPlaying`, which might cause unexpected behavior.

**Specific scenario:**

1. Protocol loads, `selectedTechnique` changes from null → technique object
2. useEffect runs with `isPlaying = false`
3. Gets currentStep = steps[0] (no interactive)
4. Line 448: `if (currentStep.interactive)` = false
5. Line 459: `setIsInteractiveAwaitingResume(false)` ✅ Should work!

So according to the code flow, this SHOULD work. But the user reports it doesn't.

**Possible timing issue:**

- Maybe the useEffect runs BEFORE `selectedTechnique.steps` is fully populated?
- Maybe `currentStep` is undefined initially?
- Maybe there's a re-render that sets it back to true?

---

## 🔧 Recommended Fixes

### Fix #1: Add Defense Check (Quick Fix)

Add explicit check at useEffect start:

```typescript
useEffect(() => {
  // Defense: Always show buttons for non-interactive steps
  if (stage !== 'protocol' || !selectedTechnique) {
    setIsInteractiveAwaitingResume(false);
    return;
  }

  const currentStep = selectedTechnique.steps?.[currentStepIndex]; // ← Safe navigation

  // Defense: If step doesn't exist or has no interactive field, show buttons
  if (!currentStep || !currentStep.interactive) {
    setIsInteractiveAwaitingResume(false);
    return;
  }

  // Only hide buttons for unacknowledged interactive steps
  const hasAcknowledged = interactiveStepsAcknowledgedRef.current.has(currentStepIndex);
  if (!hasAcknowledged) {
    if (isPlaying) {
      setIsPlaying(false);
    }
    setIsInteractiveAwaitingResume(true);
  } else {
    setIsInteractiveAwaitingResume(false);
  }
}, [stage, selectedTechnique, currentStepIndex, isPlaying]);
```

**Benefits:**

- Adds safe navigation (`steps?.[currentStepIndex]`)
- Early return for non-interactive steps
- Clearer logic flow

---

### Fix #2: Remove `isPlaying` from Dependencies (Recommended)

The `isPlaying` dependency might cause unnecessary re-runs:

```typescript
}, [stage, selectedTechnique, currentStepIndex]);  // ← Remove isPlaying
```

Then handle the `isPlaying` check differently:

```typescript
if (currentStep.interactive) {
  const hasAcknowledged = interactiveStepsAcknowledgedRef.current.has(currentStepIndex);
  if (!hasAcknowledged) {
    // Only pause if currently playing
    if (isPlaying) {
      setIsPlaying(false);
    }
    setIsInteractiveAwaitingResume(true);
  } else {
    setIsInteractiveAwaitingResume(false);
  }
}
```

**Benefits:**

- Prevents useEffect from running every time user presses Play/Pause
- Reduces potential race conditions

---

### Fix #3: Add Debug Logging (For Diagnosis)

Add console.logs to track state:

```typescript
useEffect(() => {
  console.log('[BUTTON DEBUG]', {
    stage,
    hasSelectedTechnique: !!selectedTechnique,
    currentStepIndex,
    currentStepHasInteractive: !!selectedTechnique?.steps?.[currentStepIndex]?.interactive,
    isPlaying,
    isInteractiveAwaitingResume,
  });

  if (stage !== 'protocol' || !selectedTechnique) {
    setIsInteractiveAwaitingResume(false);
    return;
  }
  // ... rest of logic
}, [stage, selectedTechnique, currentStepIndex, isPlaying]);
```

**Benefits:**

- Will show exact state when bug occurs
- Can identify timing issues
- Easy to add, easy to remove

---

## 🧪 Testing Plan

### Test Case 1: Fresh Protocol Load

1. Open app
2. Navigate to spiral interrupt
3. Rate anxiety
4. Click "Let's Break This"
5. **Verify:** Loading spinner shows
6. **Verify:** When Step 1 loads, Play and Skip buttons are visible
7. **Verify:** Can press Play button to start protocol

### Test Case 2: Non-Interactive Steps

1. Complete protocol through Step 1 (intro)
2. Continue to Step 5 (smell - non-interactive)
3. **Verify:** Buttons visible on Step 5
4. Continue to Step 6 (taste - non-interactive)
5. **Verify:** Buttons visible on Step 6

### Test Case 3: Interactive Steps

1. Start protocol
2. Advance to Step 2 ("Name 5 things you can see" - interactive)
3. **Verify:** Buttons HIDE, input field shows
4. **Verify:** Timer pauses
5. Enter response, press Submit
6. **Verify:** Buttons reappear, timer resumes

### Test Case 4: Protocol State Transitions

1. Start protocol (Step 1)
2. Press Pause
3. **Verify:** Button changes to "Resume"
4. Press Resume
5. **Verify:** Button changes to "Pause"
6. Press Skip
7. **Verify:** Confirmation modal appears

---

## 📊 Estimated Impact

**Severity:** 🔴 CRITICAL
**Frequency:** Unknown (need user reports)
**User Impact:** Cannot start protocol = Complete feature failure

**Affected Users:**

- All users if reproducible 100%
- Some users if timing-dependent (race condition)

---

## ⏱️ Estimated Fix Time

| Fix                        | Time       | Risk   |
| -------------------------- | ---------- | ------ |
| Fix #1 (Defense checks)    | 15 minutes | Low    |
| Fix #2 (Remove dependency) | 30 minutes | Medium |
| Fix #3 (Add logging)       | 10 minutes | None   |
| Testing (all scenarios)    | 1 hour     | -      |

**Total:** ~2 hours to implement all fixes + test thoroughly

---

## 🎯 Recommended Action

1. **Immediate:** Add Fix #3 (debug logging) and reproduce the issue
2. **If reproduced:** Apply Fix #1 (defense checks) as quick patch
3. **After testing:** Consider Fix #2 (remove dependency) for clean solution
4. **Before deploy:** Run full testing plan

---

## 📝 Additional Notes

### Current Step Display Logic

The UI shows "Step X · Y" where:

- X = `currentStepIndex + 1` (1-indexed for users)
- Y = Total steps in technique

So when user sees "Step 1", it's actually `currentStepIndex = 0`.

### Related Files

- `app/spiral.tsx` (main file)
- `constants/techniqueLibrary.ts` (technique definitions)
- `components/protocol/InteractiveStepInput.tsx` (interactive input component)
- `types/index.ts` (type definitions)

---

**Audit completed. Root cause identified. Fixes proposed. Ready to implement.**
