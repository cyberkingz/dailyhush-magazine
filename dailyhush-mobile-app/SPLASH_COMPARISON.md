# Splash Screen Comparison: Expo Default vs Custom DailyHush

This document compares the default Expo splash screen with the custom DailyHush splash screen.

---

## Side-by-Side Comparison

### Current Expo Default Splash

```
┌───────────────────────────┐
│                           │
│                           │
│                           │
│                           │
│                           │
│                           │
│       [Static Image]      │  Static splash.png
│        or Logo            │  No animation
│                           │  Solid background
│                           │  Shows while JS loads
│                           │
│                           │
│                           │
│                           │
│                           │
│                           │
└───────────────────────────┘

Properties:
• Static image
• No animation
• Single color background (#064e3b)
• Shows during initial JS load only
• Managed by native code
• Limited customization
```

### New Custom Splash Screen

```
┌───────────────────────────┐
│                           │
│                           │
│          🌙               │  Moon icon
│      DailyHush            │  App name (animated)
│                           │
│   Stop the Spiral of      │  Tagline (animated)
│     Overthinking          │
│                           │
│        ╱─────╲            │  Breaking spiral
│       │   •   │           │  (rotates 360°)
│        ╲─────╱            │  Shows interruption
│          • •              │
│                           │
│        • • •              │  Loading dots
│                           │  (wave animation)
│                           │
│                           │
└───────────────────────────┘

Properties:
• Dynamic animations
• Multiple visual elements
• Gradient background
• Communicates app purpose
• Interactive loading state
• Full control via React Native
```

---

## Detailed Comparison Table

| Feature                  | Expo Default            | Custom DailyHush            |
| ------------------------ | ----------------------- | --------------------------- |
| **Animation**            | None                    | Orchestrated sequence       |
| **Duration**             | Until JS loads (~1-2s)  | 2-3s minimum (controllable) |
| **Customization**        | Limited (image + color) | Full control                |
| **Loading Indicator**    | No                      | Optional animated dots      |
| **Brand Communication**  | Logo only               | Logo + tagline + metaphor   |
| **Platform Consistency** | Native splash APIs      | React Native (consistent)   |
| **Update Process**       | Requires rebuild        | Hot-reload in dev           |
| **File Size**            | Single image (~100KB)   | Component (~8KB)            |
| **Implementation**       | app.json config         | React component             |

---

## Visual Timeline Comparison

### Expo Default Splash

```
0s ────────────── 1-2s
[  Static Image  ]
     (no change)
```

### Custom DailyHush Splash

```
0s ─── 0.4s ─── 1.0s ─── 1.6s ─── 2.0s ─── 2.6s+
│       │        │        │        │        │
│   Background  Logo   Spiral  Tagline Loading
│   fade in    appears rotates  fades   animation
│                                   in
```

---

## User Experience Comparison

### Expo Default

```
User opens app
     ↓
Sees static logo/image
     ↓
Brief wait (feels passive)
     ↓
App appears suddenly
```

**Pros:**

- Fast and simple
- No code needed
- Minimal setup

**Cons:**

- Boring/generic
- No loading feedback
- Sudden transition
- Limited branding

### Custom DailyHush

```
User opens app
     ↓
Background fades in elegantly
     ↓
Logo appears with smooth animation
     ↓
Spiral rotates (engaging visual)
     ↓
Tagline reinforces value prop
     ↓
Loading dots show progress
     ↓
Smooth transition to main app
```

**Pros:**

- Engaging and memorable
- Communicates app purpose
- Professional polish
- Loading feedback
- Smooth transitions
- Aligns with brand

**Cons:**

- Slightly more complex
- Requires maintenance
- Small bundle size increase

---

## Technical Comparison

### Expo Default Splash

**Implementation:**

```json
// app.json
{
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#064e3b"
  }
}
```

**Process:**

1. Native splash screen shows immediately
2. React Native loads in background
3. Native splash hides when JS is ready
4. App content appears

**Limitations:**

- Can't add animations
- Can't show loading progress
- Can't run async operations
- Limited to static assets
- Different behavior per platform

### Custom DailyHush Splash

**Implementation:**

```tsx
// app/_layout.tsx
export default function Layout() {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return <SplashScreen onAnimationComplete={() => setIsReady(true)} showLoading={true} />;
  }

  return <Stack>...</Stack>;
}
```

**Process:**

1. Expo native splash shows (quick)
2. React Native loads
3. Custom splash component mounts
4. Animations play
5. App initializes in background
6. Smooth transition to main app

**Capabilities:**

- Full animation control
- Loading state management
- Async operation handling
- Platform-consistent experience
- Easy to update and test

---

## Performance Comparison

### Metrics

| Metric              | Expo Default | Custom Splash |
| ------------------- | ------------ | ------------- |
| Initial load time   | ~1-2s        | ~1-2s (same)  |
| Splash display time | 1-2s (fixed) | 2-3s (min)    |
| Total time to app   | ~1-2s        | ~2.5-3.5s     |
| Memory overhead     | Minimal      | +2-3MB        |
| Bundle size impact  | 0            | +8KB          |
| Animation FPS       | N/A          | 60fps         |

### Performance Notes

**Expo Default:**

- Fastest to app (but abrupt)
- No overhead
- No control

**Custom DailyHush:**

- Slightly longer but purposeful
- Minimal overhead (acceptable)
- Professional experience worth the trade-off

---

## Best of Both Worlds: Hybrid Approach

### Recommended Implementation

Use **both** Expo default splash AND custom splash:

```
┌─────────────────────────────────────┐
│ 1. App Launch (0s)                  │
│    → Expo native splash shows       │
│    → Solid #0A1612 background       │
│    → Optional: Simple "DailyHush"   │
├─────────────────────────────────────┤
│ 2. React Native Loads (0-1s)        │
│    → Expo splash still visible      │
│    → JS bundle loads                │
├─────────────────────────────────────┤
│ 3. Custom Splash Mounts (1s)        │
│    → Smooth transition              │
│    → Animated experience            │
│    → App initializes                │
├─────────────────────────────────────┤
│ 4. Main App Shows (3s)              │
│    → Smooth fade transition         │
│    → User sees loaded content       │
└─────────────────────────────────────┘
```

### Implementation

**Step 1: Update app.json**

```json
{
  "splash": {
    "image": "./assets/splash-simple.png",
    "resizeMode": "contain",
    "backgroundColor": "#0A1612" // Match custom splash
  }
}
```

**Step 2: Create Simple Asset**
Create `splash-simple.png`:

- Background: Solid #0A1612
- Text: "DailyHush" (centered, white)
- Or: Completely blank (just color)
- Size: 1242×2688px

**Step 3: Use Custom Splash**

```tsx
import * as ExpoSplash from 'expo-splash-screen';

// Prevent auto-hide
ExpoSplash.preventAutoHideAsync();

export default function Layout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Initialize app
      await initializeApp();

      // Hide Expo splash
      await ExpoSplash.hideAsync();

      // Show custom splash
      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) return null;

  return <SplashScreen ... />;
}
```

**Benefits:**

- No blank screen during JS load
- Seamless transition
- Professional experience
- Consistent colors

---

## Migration Path

### Phase 1: Keep Current (Baseline)

```
Current State:
- Expo default splash only
- Fast but basic
- No animations
```

### Phase 2: Add Custom Splash

```
Add custom splash component:
- Integrate SplashScreen.tsx
- Test on both platforms
- Gather initial feedback
```

### Phase 3: Optimize

```
Fine-tune experience:
- Adjust timing based on data
- Optimize asset loading
- Improve transition smoothness
```

### Phase 4: Enhance (Optional)

```
Future improvements:
- Add haptic feedback
- Time-of-day variations
- A/B test different versions
- Personalization
```

---

## User Feedback Scenarios

### Scenario 1: "Splash is too long"

**Default Splash:** Can't fix (native timing)
**Custom Splash:** Reduce minimum display time

### Scenario 2: "Splash is boring"

**Default Splash:** Limited to logo changes
**Custom Splash:** Easily update animations/visuals

### Scenario 3: "App feels slow to start"

**Default Splash:** No way to show progress
**Custom Splash:** Show loading indicator

### Scenario 4: "Doesn't match app theme"

**Default Splash:** Rebuild required to change
**Custom Splash:** Hot reload changes in dev

---

## Recommendation

### ✅ Use Custom DailyHush Splash

**Reasons:**

1. **Brand Communication**: Clearly communicates app purpose
2. **Professional Polish**: Creates trust for mental health app
3. **User Engagement**: Engaging but calming experience
4. **Flexibility**: Easy to update and test
5. **Loading Feedback**: Users know something is happening
6. **Competitive Edge**: Stands out from basic apps

**Trade-offs Worth It:**

- +1 second load time → Better first impression
- +8KB bundle size → Negligible on modern devices
- More code to maintain → Well-documented and isolated

### Implementation Priority

**Must Have:**

- Basic custom splash with animations
- Proper safe area handling
- Loading indicator

**Nice to Have:**

- Hybrid approach (Expo + Custom)
- Analytics tracking
- Minimum display time

**Future:**

- Seasonal variations
- Haptic feedback
- A/B testing

---

## Summary

| Aspect                  | Winner                  |
| ----------------------- | ----------------------- |
| Speed                   | Expo Default (marginal) |
| Professional Appearance | Custom DailyHush ✓      |
| Brand Communication     | Custom DailyHush ✓      |
| User Engagement         | Custom DailyHush ✓      |
| Flexibility             | Custom DailyHush ✓      |
| Ease of Implementation  | Expo Default            |
| Maintenance             | Tie                     |
| Overall for DailyHush   | **Custom Splash ✓**     |

---

**Recommendation:** Implement the custom DailyHush splash screen for a professional, engaging, and brand-aligned first impression that sets the tone for a mental health application.

---

**Document Version**: 1.0
**Last Updated**: 2025-10-24
