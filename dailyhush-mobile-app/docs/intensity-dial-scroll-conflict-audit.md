# Intensity Dial Scroll Conflict Audit

**Date**: 2025-11-07
**Issue**: Dragging intensity dial triggers page scrolling
**Status**: 🔍 **ANALYZING**

---

## Problem Statement

When dragging the intensity dial (Step 2 of mood widget), the parent ScrollView scrolls instead of or in addition to the dial rotation. This creates a poor UX where:
- User intends to rotate dial
- Page scrolls unexpectedly
- Dial interaction is interrupted
- User must try multiple times to adjust intensity

---

## Architecture Analysis

### Component Hierarchy
```
HomeModern (app/index.tsx)
  └─ ScrollFadeView (components/ScrollFadeView.tsx)
      └─ ScrollView (React Native built-in)
          └─ EmotionalWeatherWidget (components/mood-widget/EmotionalWeatherWidget.tsx)
              └─ IntensityCircular (components/mood-widget/IntensityCircular.tsx)
                  └─ Animated.View with PanResponder
```

### Current Gesture Implementation

**File**: `components/mood-widget/IntensityCircular.tsx`

#### PanResponder Configuration (Lines 162-227)
```typescript
const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true, // ✅ Claims gesture
    onMoveShouldSetPanResponder: () => true,  // ✅ Claims gesture
    onPanResponderTerminationRequest: () => false, // ✅ Prevents parent stealing

    onPanResponderGrant: () => {
      isDragging.current = true;
      // Scale animation + haptic
    },

    onPanResponderMove: (event, gestureState) => {
      // Calculate angle, move handle, update intensity
    },

    onPanResponderRelease: finishDrag,
    onPanResponderTerminate: finishDrag,
  })
).current;
```

**Analysis**:
- ✅ `onPanResponderTerminationRequest: false` - Prevents gesture stealing
- ✅ `onStartShouldSetPanResponder: true` - Claims gesture immediately
- ❌ **ISSUE**: ScrollView doesn't know to stop scrolling
- ❌ **ISSUE**: No communication between dial and ScrollView

---

## Root Cause

The PanResponder correctly prevents its gesture from being terminated, but the ScrollView is a **sibling/ancestor** that starts scrolling BEFORE the PanResponder can claim the gesture.

### Gesture Event Flow

1. **User touches dial and starts dragging down**
2. **ScrollView's gesture recognizer activates** (vertical scroll detected)
3. **Page starts scrolling**
4. **PanResponder activates** (claims gesture)
5. **PanResponder prevents termination** (keeps gesture)
6. **Result**: BOTH scroll and dial rotation happen simultaneously

### Why Current Solution Doesn't Work

```typescript
onPanResponderTerminationRequest: () => false
```

This only prevents the gesture from being **stolen** after it's been claimed. It doesn't prevent the ScrollView from **starting its own gesture** before the dial claims it.

---

## Solution Options

### Option 1: Disable ScrollView During Drag ⭐ **RECOMMENDED**

**Approach**: Pass scroll control from IntensityCircular to ScrollView

**Implementation**:
1. Add `scrollEnabled` prop to ScrollFadeView
2. Create context/callback to disable scroll from IntensityCircular
3. Disable scroll on `onPanResponderGrant`
4. Re-enable scroll on `onPanResponderRelease/Terminate`

**Pros**:
- ✅ Clean separation of concerns
- ✅ Works reliably across all devices
- ✅ No impact on other gestures
- ✅ Standard React Native pattern

**Cons**:
- ❌ Requires prop drilling or context
- ❌ Adds slight complexity

**Code Changes**:
```typescript
// 1. Create scroll control context
const ScrollControlContext = createContext({
  setScrollEnabled: (enabled: boolean) => {}
});

// 2. ScrollFadeView accepts controlled scroll
const [scrollEnabled, setScrollEnabled] = useState(true);
<ScrollView scrollEnabled={scrollEnabled} />

// 3. IntensityCircular uses context
const { setScrollEnabled } = useContext(ScrollControlContext);

onPanResponderGrant: () => {
  setScrollEnabled(false); // Disable scroll
  // ... existing code
},

onPanResponderRelease: () => {
  setScrollEnabled(true); // Re-enable scroll
  // ... existing code
},
```

---

### Option 2: Use GestureHandler (react-native-gesture-handler)

**Approach**: Replace PanResponder with GestureHandler's Pan + ScrollView integration

**Implementation**:
```typescript
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan()
  .onBegin(() => {
    // Scale + haptic
  })
  .onUpdate((event) => {
    // Calculate angle, move handle
  })
  .onEnd(() => {
    // Snap to position
  })
  .simultaneousWithExternalGesture(scrollRef); // Key integration
```

**Pros**:
- ✅ Better gesture coordination
- ✅ Built-in ScrollView integration
- ✅ Better performance (runs on UI thread)
- ✅ More reliable gesture handling

**Cons**:
- ❌ Requires adding/configuring gesture-handler
- ❌ Need to wrap app in GestureHandlerRootView
- ❌ Potential breaking changes to existing gestures
- ❌ More complex migration

---

### Option 3: Capture Responder Earlier

**Approach**: Use `onStartShouldSetResponderCapture` to block ScrollView

**Implementation**:
```typescript
<View
  onStartShouldSetResponderCapture={() => true} // Captures before children
  onMoveShouldSetResponderCapture={() => true}
  style={styles.dialContainer}
>
  <Animated.View {...panResponder.panHandlers}>
    {/* Dial */}
  </Animated.View>
</View>
```

**Pros**:
- ✅ Simple one-line change
- ✅ No prop drilling
- ✅ Works immediately

**Cons**:
- ❌ Blocks ALL touch events in area (including taps on markers)
- ❌ Less fine-grained control
- ❌ Can interfere with tap gestures

---

### Option 4: Wrap in Non-Scrollable Container

**Approach**: Add a View that blocks scroll propagation

**Implementation**:
```typescript
<View
  style={styles.dialContainer}
  onMoveShouldSetResponder={() => true} // Blocks parent scroll
>
  <IntensityCircular />
</View>
```

**Pros**:
- ✅ Very simple
- ✅ No changes to IntensityCircular
- ✅ Isolated to widget only

**Cons**:
- ❌ May not work reliably on all platforms
- ❌ Blocks scroll even when not dragging dial
- ❌ User can't scroll past dial area

---

## Recommended Implementation

**Choice**: **Option 1** - Disable ScrollView During Drag

**Reasoning**:
1. Most reliable across platforms
2. Standard React Native pattern
3. Fine-grained control (only disables during actual drag)
4. No impact on tap gestures or other interactions
5. Clear, maintainable code

---

## Implementation Plan

### Step 1: Create Scroll Control Context
**File**: `components/mood-widget/ScrollControlContext.tsx` (new)

```typescript
import { createContext, useContext, useState } from 'react';

interface ScrollControlContextValue {
  scrollEnabled: boolean;
  setScrollEnabled: (enabled: boolean) => void;
}

const ScrollControlContext = createContext<ScrollControlContextValue>({
  scrollEnabled: true,
  setScrollEnabled: () => {},
});

export const ScrollControlProvider = ({ children }) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <ScrollControlContext.Provider value={{ scrollEnabled, setScrollEnabled }}>
      {children}
    </ScrollControlContext.Provider>
  );
};

export const useScrollControl = () => useContext(ScrollControlContext);
```

### Step 2: Update ScrollFadeView
**File**: `components/ScrollFadeView.tsx`

```typescript
import { useScrollControl } from '@/components/mood-widget/ScrollControlContext';

export const ScrollFadeView: React.FC<ScrollFadeViewProps> = ({ ... }) => {
  const { scrollEnabled } = useScrollControl();

  return (
    <ScrollView
      {...scrollViewProps}
      scrollEnabled={scrollEnabled} // ← Add this
      onScroll={handleScroll}
    >
      {children}
    </ScrollView>
  );
};
```

### Step 3: Update Home Screen
**File**: `app/index.tsx`

```typescript
import { ScrollControlProvider } from '@/components/mood-widget/ScrollControlContext';

export default function HomeModern() {
  return (
    <ScrollControlProvider>
      <View style={{ flex: 1 }}>
        <ScrollFadeView>
          {/* Existing content */}
        </ScrollFadeView>
      </View>
    </ScrollControlProvider>
  );
}
```

### Step 4: Update IntensityCircular
**File**: `components/mood-widget/IntensityCircular.tsx`

```typescript
import { useScrollControl } from './ScrollControlContext';

export function IntensityCircular({ ... }) {
  const { setScrollEnabled } = useScrollControl();

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderGrant: () => {
        isDragging.current = true;
        setScrollEnabled(false); // ← Disable scroll

        // Existing code...
      },

      onPanResponderRelease: () => {
        setScrollEnabled(true); // ← Re-enable scroll
        finishDrag();
      },

      onPanResponderTerminate: () => {
        setScrollEnabled(true); // ← Re-enable scroll
        finishDrag();
      },
    })
  ).current;
}
```

---

## Testing Checklist

After implementation:

- [ ] Drag dial smoothly without page scroll
- [ ] Page scrolls normally when not dragging dial
- [ ] Tap markers work correctly
- [ ] Dial drag works on iOS
- [ ] Dial drag works on Android
- [ ] Fast drag gestures don't cause scroll
- [ ] Releasing drag re-enables scroll immediately
- [ ] Scroll works above widget
- [ ] Scroll works below widget
- [ ] No performance issues during drag

---

## Alternative: Quick Fix (Option 3)

If full context implementation is too complex, use this quick fix:

**File**: `components/mood-widget/IntensityCircular.tsx` (line 235)

```typescript
<View
  style={styles.dialContainer}
  onStartShouldSetResponderCapture={() => true} // Block scroll in dial area
>
  <View ref={dialRef} onLayout={() => measureDial()} style={styles.dialBackground}>
    {/* Existing dial content */}
  </View>
</View>
```

**Pros**: One-line fix, immediate results
**Cons**: Blocks scroll in entire dial area (including empty space)

---

## Performance Considerations

### Memory
- Context adds negligible memory overhead
- No additional renders (boolean state only changes on drag start/end)

### Rendering
- ScrollView prop change is instant
- No visual flicker
- No layout shifts

### Gesture Performance
- No impact on gesture recognition speed
- No additional gesture processing overhead

---

## Accessibility Notes

- Screen readers should announce "Scrolling disabled" during drag (optional)
- Consider haptic feedback when scroll re-enables
- Ensure keyboard users can adjust intensity without dragging

---

## Related Issues

- Similar issue might affect other draggable components
- Consider creating reusable scroll-blocking hook
- Document pattern for future gesture implementations

---

## Conclusion

**Recommended**: Implement Option 1 (Scroll Control Context)

**Rationale**:
- Most reliable solution
- Standard React Native pattern
- No impact on other interactions
- Future-proof for additional draggable components

**Estimated Time**: 30-45 minutes
**Risk**: Low (isolated changes, easy to test)
**Impact**: High (fixes critical UX issue)

---

## Next Steps

1. ✅ Complete audit
2. ⏳ Implement scroll control context
3. ⏳ Update ScrollFadeView
4. ⏳ Update home screen
5. ⏳ Update IntensityCircular
6. ⏳ Test on iOS simulator
7. ⏳ Test on Android device (if available)
8. ⏳ Commit and merge
