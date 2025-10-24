# SplashScreen Integration Guide

This guide shows how to integrate the custom SplashScreen component into your DailyHush app.

---

## Quick Start

### Option 1: Integrate with App Entry Point

Modify your `app/_layout.tsx` to show the splash screen on initial load:

```tsx
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SplashScreen } from '@/components/SplashScreen';
import { restoreSession } from '@/services/auth';
import { useStore } from '@/store/useStore';

export default function Layout() {
  const [isReady, setIsReady] = useState(false);
  const { setUser } = useStore();

  useEffect(() => {
    const initApp = async () => {
      // Your initialization logic
      await restoreSession();

      // Add any other startup tasks here
      // (loading fonts, fetching initial data, etc.)

      // When complete, hide splash screen
      setIsReady(true);
    };

    initApp();
  }, []);

  // Show splash screen while initializing
  if (!isReady) {
    return (
      <SplashScreen
        onAnimationComplete={() => {
          // Optional: Add a minimum display time
          // Already handled by animation timing
        }}
        showLoading={true}
      />
    );
  }

  // Rest of your layout code...
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          contentStyle: { backgroundColor: '#0A1612' },
          // ... rest of your config
        }}
      >
        {/* Your screens */}
      </Stack>
    </>
  );
}
```

---

## Option 2: More Controlled Initialization

For more control over when the splash screen dismisses:

```tsx
import { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { SplashScreen } from '@/components/SplashScreen';

export default function Layout() {
  const [appState, setAppState] = useState<'loading' | 'ready'>('loading');
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Run all your initialization in parallel
      await Promise.all([
        restoreSession(),
        loadUserPreferences(),
        checkSubscriptionStatus(),
        // Add other async initialization here
      ]);

      setAppState('ready');
    } catch (error) {
      console.error('Initialization error:', error);
      setAppState('ready'); // Still show app even if init fails
    }
  };

  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true);
  }, []);

  // Only show main app when both conditions are met:
  // 1. App initialization is complete
  // 2. Splash animation has finished
  const shouldShowApp = appState === 'ready' && splashComplete;

  if (!shouldShowApp) {
    return (
      <SplashScreen
        onAnimationComplete={handleSplashComplete}
        showLoading={appState === 'loading'}
      />
    );
  }

  return (
    <>
      <Stack>{/* Your screens */}</Stack>
    </>
  );
}
```

---

## Option 3: Minimum Display Time

Ensure splash screen shows for at least N seconds:

```tsx
import { useEffect, useState } from 'react';

export default function Layout() {
  const [isReady, setIsReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Set minimum display time (e.g., 2 seconds)
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);

    // Run initialization
    const initApp = async () => {
      await restoreSession();
      setIsReady(true);
    };

    initApp();

    return () => clearTimeout(minTimer);
  }, []);

  // Only hide splash when BOTH conditions are true
  if (!isReady || !minTimeElapsed) {
    return (
      <SplashScreen
        showLoading={!isReady}
      />
    );
  }

  return (
    <>
      <Stack>{/* Your screens */}</Stack>
    </>
  );
}
```

---

## Update Expo Splash Config

Update your `app.json` to use a simpler placeholder until React Native loads:

```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash-simple.png",
      "resizeMode": "contain",
      "backgroundColor": "#0A1612"
    }
  }
}
```

Create a simple `splash-simple.png`:
- Solid color: `#0A1612`
- Just the "DailyHush" text centered
- Or completely blank (just the background color)
- This shows while JavaScript loads, then your animated splash takes over

---

## Advanced: Prevent Flash Between Expo Splash and Custom Splash

```tsx
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

// Prevent the Expo splash screen from auto-hiding
ExpoSplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Keep Expo splash visible
        // Do all initialization
        await restoreSession();

        // Hide Expo splash
        await ExpoSplashScreen.hideAsync();

        // Now show custom splash
        setIsReady(true);
      } catch (e) {
        console.warn(e);
        await ExpoSplashScreen.hideAsync();
        setIsReady(true);
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    // While loading, show nothing (Expo splash is still visible)
    return null;
  }

  // Expo splash is now hidden, show custom splash
  return <YourSplashScreenLogic />;
}
```

---

## Testing the Splash Screen

### During Development

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Physical Device with Expo Go
npm start
```

### Test Scenarios

1. **Fast Load**:
   - Mock quick initialization
   - Ensure splash still shows for minimum time

2. **Slow Load**:
   - Add artificial delay
   - Verify loading indicator appears

3. **Failed Load**:
   - Mock initialization error
   - Ensure app still becomes usable

4. **Rapid Restarts**:
   - Close and reopen app quickly
   - Verify no animation stuttering

---

## Customization Examples

### Change Animation Speed

```tsx
<SplashScreen
  onAnimationComplete={() => setIsReady(true)}
  showLoading={true}
  // Pass these as additional props (requires component update):
  // animationDuration={2000}  // Faster (2s instead of 2.6s)
/>
```

### Hide Loading Dots

```tsx
<SplashScreen
  onAnimationComplete={() => setIsReady(true)}
  showLoading={false}  // No loading indicator
/>
```

### Add Custom Callback

```tsx
<SplashScreen
  onAnimationComplete={() => {
    console.log('Splash animation finished');
    trackEvent('splash_screen_viewed');
    setIsReady(true);
  }}
  showLoading={true}
/>
```

---

## Troubleshooting

### Splash Screen Flickers

**Problem**: Brief flash of white between Expo splash and custom splash

**Solution**: Ensure background colors match:
```json
// app.json
"splash": {
  "backgroundColor": "#0A1612"  // Same as custom splash
}
```

### Animations are Choppy

**Problem**: Animations don't run smoothly (< 60fps)

**Solutions**:
- Ensure `useNativeDriver: true` is set (already done in component)
- Test on physical device (simulators can be slower)
- Close other apps to free up resources
- Check if debug mode is causing slowdown

### Splash Shows Too Long

**Problem**: Splash screen doesn't dismiss after initialization

**Solution**: Add timeout fallback:
```tsx
useEffect(() => {
  // Fallback: Force dismiss after 5 seconds
  const fallbackTimer = setTimeout(() => {
    console.warn('Splash timeout - forcing dismiss');
    setIsReady(true);
  }, 5000);

  initApp().then(() => {
    clearTimeout(fallbackTimer);
    setIsReady(true);
  });

  return () => clearTimeout(fallbackTimer);
}, []);
```

### SVG Not Rendering

**Problem**: Spiral graphic doesn't appear

**Solutions**:
1. Ensure `react-native-svg` is installed:
   ```bash
   npx expo install react-native-svg
   ```

2. Check if Expo version supports SVG (should be included by default)

3. Test with a simple SVG first:
   ```tsx
   <Svg width="100" height="100">
     <Circle cx="50" cy="50" r="40" fill="red" />
   </Svg>
   ```

### Gradient Not Showing

**Problem**: Background appears solid, no gradient

**Solution**: Install Expo Linear Gradient:
```bash
npx expo install expo-linear-gradient
```

---

## Performance Monitoring

### Track Splash Screen Performance

```tsx
import { useEffect, useState } from 'react';
import { Performance } from 'react-native-performance';

export default function Layout() {
  const [startTime] = useState(Date.now());

  const handleSplashComplete = () => {
    const duration = Date.now() - startTime;
    console.log(`Splash screen displayed for ${duration}ms`);

    // Track with analytics
    trackEvent('splash_duration', { duration });

    setIsReady(true);
  };

  return (
    <SplashScreen
      onAnimationComplete={handleSplashComplete}
      showLoading={true}
    />
  );
}
```

---

## Accessibility Considerations

### Respect Reduced Motion

For users with motion sensitivity:

```tsx
import { AccessibilityInfo } from 'react-native';
import { useEffect, useState } from 'react';

export default function Layout() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      setReducedMotion(enabled);
    });
  }, []);

  if (!isReady) {
    return (
      <SplashScreen
        onAnimationComplete={() => setIsReady(true)}
        showLoading={true}
        // If implementing: reducedMotion={reducedMotion}
      />
    );
  }

  return <MainApp />;
}
```

### Screen Reader Announcement

```tsx
import { AccessibilityInfo } from 'react-native';

useEffect(() => {
  // Announce to screen readers when app is ready
  if (isReady) {
    AccessibilityInfo.announceForAccessibility(
      'DailyHush is ready. Welcome back.'
    );
  }
}, [isReady]);
```

---

## Build for Production

### iOS

```bash
# Build iOS app with splash screen
eas build --platform ios --profile production
```

### Android

```bash
# Build Android app with splash screen
eas build --platform android --profile production
```

### Test Build Splash

After building:
1. Install on device
2. Completely close app
3. Open app cold (not from background)
4. Verify splash shows smoothly
5. Check for any flashing or delays

---

## Next Steps

1. **Implement** in your `_layout.tsx` using one of the options above
2. **Test** on both iOS and Android devices
3. **Customize** colors/animations if needed
4. **Monitor** performance and user feedback
5. **Iterate** based on real-world usage

---

## Questions or Issues?

Refer to:
- Main design spec: `SPLASH_SCREEN_DESIGN.md`
- Component code: `components/SplashScreen.tsx`
- Expo docs: https://docs.expo.dev/guides/splash-screens/

---

**Last Updated**: 2025-10-24
