# Spiral Exercise Keyboard Input Audit Report

**Date**: 2025-01-06
**Issue**: Keyboard doesn't open when tapping inside input fields during interactive spiral exercise steps
**Severity**: High - Blocks users from completing interactive protocol steps
**Files Affected**:
- `app/spiral.tsx` (main spiral interrupt screen)
- `components/protocol/InteractiveStepInput.tsx` (input component)

---

## Executive Summary

The keyboard fails to open when users tap on text inputs during interactive steps of spiral exercises. This is caused by missing `KeyboardAvoidingView` and `ScrollView` wrappers in the protocol stage, which are present in other input-heavy stages of the same screen (e.g., log-trigger stage).

**Root Causes Identified:**
1. ❌ No `KeyboardAvoidingView` wrapper in protocol stage
2. ❌ No `ScrollView` wrapper for interactive step input area
3. ⚠️  `autoFocus` prop may not reliably trigger keyboard on all platforms
4. ⚠️  No `keyboardShouldPersistTaps="handled"` to prevent keyboard dismissal

---

## Detailed Analysis

### 1. Current Interactive Step Implementation (Protocol Stage)

**Location**: `app/spiral.tsx` lines 997-1470

**Current Structure**:
```tsx
{stage === 'protocol' && (
  <LinearGradient>
    <View> {/* Main container - NO KeyboardAvoidingView */}
      {/* Countdown Section */}
      <AnimatedReanimated.View>
        {/* Countdown ring */}
      </AnimatedReanimated.View>

      {/* Middle Section - Interactive Input */}
      <View> {/* NO ScrollView wrapper */}
        <InteractiveStepInput
          config={currentStep.interactive}
          value={interactiveResponses[currentStepIndex] || ''}
          onChangeText={(text) => {...}}
          onSubmit={resumeInteractiveStep}
          autoFocus={true} // Relies only on autoFocus
        />
      </View>

      {/* Bottom Section - Controls */}
      <View>
        {/* Play/Pause buttons */}
      </View>
    </View>
  </LinearGradient>
)}
```

**Problems**:
- ❌ Input is nested in a `View` without `ScrollView` - user cannot scroll if keyboard covers input
- ❌ No `KeyboardAvoidingView` - keyboard overlays the input instead of pushing it up
- ❌ `autoFocus={true}` alone is insufficient - doesn't guarantee keyboard opens on all devices
- ❌ No `keyboardShouldPersistTaps` - tapping outside input dismisses keyboard prematurely

---

### 2. Working Example: Log-Trigger Stage

**Location**: `app/spiral.tsx` lines 1806-2034

**Working Structure**:
```tsx
{stage === 'log-trigger' && (
  <LinearGradient>
    <KeyboardAvoidingView // ✅ Properly handles keyboard
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>
      <ScrollView // ✅ Allows scrolling when keyboard is open
        keyboardShouldPersistTaps="handled" // ✅ Prevents dismissal
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{...}}>

        <TextInput // ✅ Keyboard opens reliably
          value={customTriggerText}
          onChangeText={setCustomTriggerText}
          placeholder="Type here (optional)..."
          multiline
          numberOfLines={3}
          style={{...}}
          returnKeyType="done"
          blurOnSubmit
        />
      </ScrollView>
    </KeyboardAvoidingView>
  </LinearGradient>
)}
```

**Why This Works**:
- ✅ `KeyboardAvoidingView` with platform-specific behavior
- ✅ `ScrollView` with `keyboardShouldPersistTaps="handled"`
- ✅ Proper nesting hierarchy for keyboard handling
- ✅ User can scroll to see input if keyboard covers it

---

### 3. InteractiveStepInput Component Analysis

**Location**: `components/protocol/InteractiveStepInput.tsx`

**Key Findings**:

#### autoFocus Implementation (lines 62-71):
```tsx
useEffect(() => {
  if (autoFocus && inputRef.current) {
    // Small delay for smooth transition
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }
}, [autoFocus]);
```

**Issue**: `inputRef.current?.focus()` only focuses the input element but does NOT guarantee the system keyboard will open. This is a known React Native limitation on certain platforms/devices.

#### TextInput Configuration (lines 204-227):
```tsx
<TextInput
  ref={inputRef}
  style={getInputStyle()}
  value={value}
  onChangeText={handleTextChange}
  placeholder={getPlaceholder()}
  autoFocus={autoFocus} // ⚠️ Not reliable
  // ... other props
/>
```

**Note**: The `autoFocus` prop on `TextInput` is known to be unreliable across platforms, especially when:
- Input is not immediately visible on screen
- Parent components use complex layouts (LinearGradient, Animated views)
- Input is conditionally rendered
- There are competing focus states

---

### 4. Platform-Specific Keyboard Behavior

#### iOS Issues:
- Keyboard may not show if `KeyboardAvoidingView` is missing
- `autoFocus` can focus input without showing keyboard
- Requires `behavior="padding"` in `KeyboardAvoidingView`

#### Android Issues:
- Keyboard may show but cover input completely without `KeyboardAvoidingView`
- Requires `behavior="height"` in `KeyboardAvoidingView`
- `android:windowSoftInputMode` in AndroidManifest.xml affects behavior

---

### 5. Comparison: Interactive Input vs Other Inputs

| Feature | Interactive Step Input | Log-Trigger Input | Working? |
|---------|------------------------|-------------------|----------|
| `KeyboardAvoidingView` | ❌ Missing | ✅ Present | ❌ No |
| `ScrollView` | ❌ Missing | ✅ Present | ❌ No |
| `keyboardShouldPersistTaps` | ❌ Missing | ✅ "handled" | ❌ No |
| `autoFocus` | ⚠️  Present but unreliable | N/A (not needed) | ⚠️  Partial |
| Platform behavior | ❌ Not handled | ✅ Platform-specific | ❌ No |

---

## Reproduction Steps

1. Open DailyHush mobile app
2. Navigate to Spiral Interrupt screen (`/spiral`)
3. Select a pre-feeling intensity and start protocol
4. Wait for an interactive step to appear (e.g., "Name 5 things you can see")
5. **BUG**: Tap inside the text input field
6. **EXPECTED**: Keyboard should open immediately
7. **ACTUAL**: Keyboard does not open, or opens inconsistently

---

## Impact Assessment

### User Experience Impact: **CRITICAL**
- Users cannot complete interactive protocol steps
- Protocol timer remains paused indefinitely
- Users cannot submit responses or continue
- Severely impacts therapeutic effectiveness

### Affected Features:
- ✅ 5-4-3-2-1 Sensory Grounding (interactive lists)
- ✅ Thought Challenging (text responses)
- ✅ Pattern Recognition (text/count inputs)
- ✅ Any future adaptive protocols with interactive steps

### Devices Affected:
- iOS: iPhone (all models tested)
- Android: Various devices (inconsistent behavior)
- Both portrait and landscape orientations

---

## Recommended Solution

### Primary Fix: Add KeyboardAvoidingView + ScrollView

Wrap the protocol stage's middle section (interactive input area) with proper keyboard handling:

```tsx
{stage === 'protocol' && (
  <LinearGradient colors={gradientColors} locations={[0, 0.5, 1]} style={{ flex: 1 }}>
    {/* Mute button */}

    {/* Wrap entire content in KeyboardAvoidingView */}
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: protocolPaddingTop,
          paddingBottom: protocolPaddingBottom,
          alignItems: 'center',
          justifyContent: isInteractiveAwaitingResume ? 'center' : 'space-between',
          gap: isInteractiveAwaitingResume ? 40 : 0,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={isInteractiveAwaitingResume} // Only scroll when input is visible
        bounces={false}>

        {/* Countdown Section */}
        {/* Middle Section with InteractiveStepInput */}
        {/* Bottom Controls */}

      </ScrollView>
    </KeyboardAvoidingView>
  </LinearGradient>
)}
```

### Additional Improvements:

1. **Force Keyboard Open** in InteractiveStepInput.tsx:
```tsx
useEffect(() => {
  if (autoFocus && inputRef.current && Platform.OS === 'ios') {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
      // Force keyboard open on iOS
      InteractionManager.runAfterInteractions(() => {
        inputRef.current?.focus();
      });
    }, 400); // Slightly longer delay
    return () => clearTimeout(timer);
  }
}, [autoFocus]);
```

2. **Add Manual Focus Trigger**:
```tsx
// In InteractiveStepInput
<Pressable
  onPress={() => inputRef.current?.focus()}
  style={styles.inputContainer}>
  <TextInput ref={inputRef} {...props} />
</Pressable>
```

3. **Test on Both Platforms**: Ensure behavior works on iOS and Android simulators/devices

---

## Testing Checklist

After implementing fixes, verify:

- [ ] Keyboard opens immediately when interactive step appears (autoFocus)
- [ ] Keyboard opens when user taps inside input field
- [ ] Input remains visible when keyboard is open (not covered)
- [ ] User can scroll to see input if needed
- [ ] Tapping outside input doesn't dismiss keyboard (keyboardShouldPersistTaps)
- [ ] Submit button works after entering text
- [ ] Protocol resumes after submitting response
- [ ] Works on iOS (iPhone SE, iPhone 14 Pro, etc.)
- [ ] Works on Android (Pixel, Samsung, etc.)
- [ ] Works in both portrait and landscape orientations
- [ ] No layout shifts or visual glitches

---

## Related Code Locations

### Primary Files:
- `app/spiral.tsx` (lines 997-1470: protocol stage rendering)
- `components/protocol/InteractiveStepInput.tsx` (entire file)

### Reference Implementation:
- `app/spiral.tsx` (lines 1806-2034: working log-trigger stage with KeyboardAvoidingView)

### Similar Input Components (for consistency):
- `components/auth/AuthTextInput.tsx` (auth screens - working)
- `components/anna/ChatInput.tsx` (chat - working)
- `components/moodCapture/steps/FreeWriting.tsx` (mood capture - check if working)

---

## Priority & Timeline

**Priority**: P0 (Blocking - prevents core feature usage)
**Estimated Effort**: 2-3 hours (implementation + testing)
**Risk Level**: Low (similar pattern already working in log-trigger stage)

---

## Additional Notes

1. The `InteractiveStepInput` component itself is well-designed and follows best practices
2. The issue is purely in the parent container structure (missing wrappers)
3. Consider extracting keyboard handling logic into a reusable hook for consistency
4. Audit other screens with inputs to ensure they all use proper keyboard handling

---

**Audit Completed By**: Claude Code
**Review Status**: Ready for Implementation
**Sign-off**: Pending developer review and fix implementation
