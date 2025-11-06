# Spiral Keyboard Fix - Implementation Status Check

**Date**: 2025-01-06
**Status**: Partially Implemented ⚠️

---

## ✅ What's Been Implemented

### 1. Keyboard Handling Infrastructure
```tsx
// Lines 121-122: Keyboard state variables
const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
const [keyboardHeight, setKeyboardHeight] = useState(0);

// Line 141-142: Refs for scrolling
const protocolScrollRef = useRef<ScrollView | null>(null);
const interactiveInputOffsetRef = useRef(0);

// Lines 144-146: Layout handler
const handleInteractiveInputLayout = useCallback((event: LayoutChangeEvent) => {
  interactiveInputOffsetRef.current = event.nativeEvent.layout.y;
}, []);
```
**Status**: ✅ **Complete**

### 2. Keyboard Event Listeners
```tsx
// Lines 206-239: Keyboard show/hide listeners
useEffect(() => {
  const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
  const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

  const handleKeyboardShow = (event: KeyboardEvent) => {
    const height = event.endCoordinates?.height ?? 0;
    setIsKeyboardVisible(true);
    setKeyboardHeight(height);
    if (isInteractiveAwaitingResume && protocolScrollRef.current) {
      requestAnimationFrame(() => {
        const targetOffset = Math.max(interactiveInputOffsetRef.current - 48, 0);
        protocolScrollRef.current?.scrollTo({ y: targetOffset, animated: true });
      });
    }
  };

  const handleKeyboardHide = () => {
    setIsKeyboardVisible(false);
    setKeyboardHeight(0);
    if (protocolScrollRef.current && !isInteractiveAwaitingResume) {
      requestAnimationFrame(() => {
        protocolScrollRef.current?.scrollTo({ y: 0, animated: true });
      });
    }
  };

  const showSub = Keyboard.addListener(showEvent, handleKeyboardShow);
  const hideSub = Keyboard.addListener(hideEvent, handleKeyboardHide);

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, [isInteractiveAwaitingResume]);
```
**Status**: ✅ **Complete** - Good use of platform-specific events and cleanup

### 3. KeyboardAvoidingView Wrapper
```tsx
// Lines 1090-1093
<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={0}>
```
**Status**: ✅ **Complete**

### 4. ScrollView Configuration
```tsx
// Lines 1094-1102
<ScrollView
  ref={protocolScrollRef}
  style={{ flex: 1, width: '100%' }}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    flexGrow: 1,
    width: '100%',
  }}>
```
**Status**: ✅ **Complete**

### 5. Dynamic Padding for Keyboard
```tsx
// Lines 152-157
const effectiveKeyboardPadding = Math.max(keyboardHeight - safeAreaBottom, 0);
const interactiveKeyboardPadding = isInteractiveAwaitingResume
  ? isKeyboardVisible
    ? effectiveKeyboardPadding + 40
    : 80
  : 0;

// Line 1109: Applied to paddingBottom
paddingBottom: protocolPaddingBottom + interactiveKeyboardPadding,
```
**Status**: ✅ **Complete**

### 6. Layout Tracking for Input
```tsx
// Line 1354: onLayout handler on interactive input wrapper
<View
  onLayout={handleInteractiveInputLayout}
  style={{...}}>
  <InteractiveStepInput ... />
</View>
```
**Status**: ✅ **Complete**

---

## ⚠️ Potential Issues / What Might Still Be Missing

### Issue #1: InteractiveStepInput autoFocus Reliability

**Current Implementation** (components/protocol/InteractiveStepInput.tsx lines 63-71):
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

**Problem**:
- `inputRef.current?.focus()` may not reliably open keyboard on iOS
- 300ms delay might not be sufficient in all cases
- No fallback if focus fails

**Recommended Fix**:
```tsx
import { InteractionManager } from 'react-native';

useEffect(() => {
  if (autoFocus && inputRef.current) {
    // Wait for layout animations to complete
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        inputRef.current?.focus();

        // iOS-specific: Force keyboard open
        if (Platform.OS === 'ios') {
          requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
        }
      }, 400); // Slightly longer delay
    });
  }
}, [autoFocus]);
```

**Status**: ⚠️ **Needs Enhancement**

---

### Issue #2: Keyboard Vertical Offset May Need Adjustment

**Current Setting** (line 1092):
```tsx
keyboardVerticalOffset={0}
```

**Problem**:
- On iOS, the keyboard might still cover part of the input
- Safe area insets not accounted for
- May need different values for iOS vs Android

**Recommended Fix**:
```tsx
<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? safeAreaTop : 0}>
```

**Status**: ⚠️ **May Need Adjustment**

---

### Issue #3: ScrollView Content Layout During Keyboard

**Current Implementation** (lines 1099-1116):
```tsx
contentContainerStyle={{
  flexGrow: 1,
  width: '100%',
}}

<View
  style={{
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: protocolPaddingTop,
    paddingBottom: protocolPaddingBottom + interactiveKeyboardPadding,
    alignItems: 'center',
    justifyContent: isInteractiveAwaitingResume
      ? isKeyboardVisible
        ? 'flex-start'  // Changed when keyboard is visible
        : 'center'
      : 'space-between',
    gap: isInteractiveAwaitingResume ? 40 : 0,
  }}>
```

**Observation**:
- `justifyContent` changes based on keyboard state
- This might cause layout jumps
- The countdown might get pushed off-screen when keyboard appears

**Potential Issue**:
- Users might not be able to see the countdown while typing
- Layout shift might feel jarring

**Status**: ⚠️ **Verify Behavior - May be intentional design**

---

### Issue #4: Scroll Behavior Dependency Array

**Current Implementation** (line 239):
```tsx
}, [isInteractiveAwaitingResume]);
```

**Problem**:
- Keyboard listeners only re-register when `isInteractiveAwaitingResume` changes
- If `protocolScrollRef` or `interactiveInputOffsetRef` change, handlers use stale values
- This is probably fine, but worth noting

**Status**: ⚠️ **Should work, but could be more defensive**

---

### Issue #5: Manual Focus Trigger Missing

**Observation**:
The InteractiveStepInput component doesn't have a Pressable wrapper to manually trigger focus if autoFocus fails.

**Recommended Addition** (in InteractiveStepInput.tsx):
```tsx
<Pressable
  onPress={() => inputRef.current?.focus()}
  style={{ width: '100%' }}>
  <TextInput
    ref={inputRef}
    {...props}
  />
</Pressable>
```

**Status**: ⚠️ **Optional but Recommended**

---

### Issue #6: Android Keyboard Behavior

**Observation**:
- Android uses `keyboardDidShow` (not `keyboardWillShow`)
- This means the layout adjustment happens AFTER the keyboard is visible
- Might cause a brief visual glitch

**Current Implementation** (line 207):
```tsx
const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
```

**Status**: ✅ **Standard practice** - This is the correct approach

---

## 🔍 Testing Checklist

To determine what's still not working, test these scenarios:

### Scenario 1: Keyboard Opens Automatically
- [ ] Start spiral protocol
- [ ] Wait for interactive step to appear
- [ ] **EXPECTED**: Keyboard opens automatically without tapping
- [ ] **IF FAILS**: autoFocus issue (Issue #1)

### Scenario 2: Keyboard Opens on Tap
- [ ] Interactive step appears but keyboard doesn't open
- [ ] Tap inside the input field
- [ ] **EXPECTED**: Keyboard opens immediately
- [ ] **IF FAILS**: Input might not be receiving touch events

### Scenario 3: Input Remains Visible
- [ ] Keyboard opens (either automatically or manually)
- [ ] **EXPECTED**: Input field scrolls up and remains visible above keyboard
- [ ] **IF FAILS**: KeyboardAvoidingView or scroll position issue (Issue #2)

### Scenario 4: Countdown Visibility
- [ ] Keyboard is open
- [ ] **CHECK**: Can you still see the countdown timer at the top?
- [ ] **IF NOT VISIBLE**: This might be intentional, but verify

### Scenario 5: Layout Doesn't Jump
- [ ] Keyboard opens and closes multiple times
- [ ] **EXPECTED**: Smooth transitions without jarring layout shifts
- [ ] **IF JUMPY**: Review justifyContent logic (Issue #3)

### Scenario 6: Keyboard Persists When Needed
- [ ] Tap outside input (but not on Submit button)
- [ ] **EXPECTED**: Keyboard stays open
- [ ] **IF DISMISSES**: keyboardShouldPersistTaps not working

### Scenario 7: Works on Both Platforms
- [ ] Test on iOS device/simulator
- [ ] Test on Android device/emulator
- [ ] **EXPECTED**: Consistent behavior on both
- [ ] **IF DIFFERENT**: Platform-specific adjustments needed

---

## 🎯 Most Likely Issues

Based on typical React Native keyboard problems, here are the most likely culprits:

### 1st Most Likely: autoFocus Not Reliable (Issue #1)
**Symptom**: Keyboard doesn't open automatically when interactive step appears
**Fix**: Enhance autoFocus implementation with InteractionManager
**Priority**: **HIGH**

### 2nd Most Likely: keyboardVerticalOffset Too Small (Issue #2)
**Symptom**: Keyboard covers part of the input field
**Fix**: Adjust keyboardVerticalOffset to account for safe area
**Priority**: **MEDIUM**

### 3rd Most Likely: Input Not Focusable
**Symptom**: Tapping input doesn't open keyboard
**Fix**: Add Pressable wrapper (Issue #5)
**Priority**: **MEDIUM**

---

## 📝 Recommended Next Steps

1. **Test the current implementation** on a real iOS device (simulator often behaves differently)
2. **Test on Android device** to see if behavior is consistent
3. **Identify specific failure scenarios** from the testing checklist above
4. **Apply targeted fixes** based on which tests fail

---

## 🔧 Quick Fixes to Try First

If keyboard still doesn't open, try these quick fixes in order:

### Fix A: Increase autoFocus Delay
In `InteractiveStepInput.tsx`, change line 68:
```tsx
const timer = setTimeout(() => {
  inputRef.current?.focus();
}, 600); // Increased from 300ms
```

### Fix B: Add Double Focus for iOS
In `InteractiveStepInput.tsx`, replace the autoFocus effect:
```tsx
useEffect(() => {
  if (autoFocus && inputRef.current) {
    const timer = setTimeout(() => {
      inputRef.current?.focus();

      // iOS-specific: Focus twice with delay
      if (Platform.OS === 'ios') {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }, 400);
    return () => clearTimeout(timer);
  }
}, [autoFocus]);
```

### Fix C: Adjust KeyboardAvoidingView Offset
In `spiral.tsx`, change line 1092:
```tsx
keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}>
```

### Fix D: Add Manual Focus Pressable
In `InteractiveStepInput.tsx`, wrap the TextInput:
```tsx
<Pressable onPress={() => inputRef.current?.focus()} style={{ width: '100%' }}>
  <TextInput
    ref={inputRef}
    style={getInputStyle()}
    // ... rest of props
  />
</Pressable>
```

---

## 💬 What to Ask the User

To help diagnose the issue, ask:

1. **Does the keyboard open at all?**
   - Not at all → autoFocus issue
   - Opens but covers input → offset issue
   - Opens inconsistently → timing issue

2. **What happens when you tap the input field?**
   - Nothing → Input not receiving touch events
   - Keyboard opens → autoFocus issue only
   - Layout breaks → KeyboardAvoidingView issue

3. **Which device/platform are you testing on?**
   - iOS Simulator → Try real device
   - Android Emulator → Check keyboard settings
   - Specific device → Device-specific issue

4. **What specifically is "not done completely"?**
   - Get exact description of failing behavior
   - Screenshots/video would help

---

**Analysis Complete**
**Ready for**: User feedback on specific failing behaviors
