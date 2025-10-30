/**
 * SplashScreen Usage Examples
 *
 * This file contains example implementations of the SplashScreen component
 * for various use cases in the DailyHush app.
 */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SplashScreen } from './SplashScreen';

// ============================================================================
// EXAMPLE 1: Basic Usage
// ============================================================================

export function BasicSplashExample() {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return <SplashScreen onAnimationComplete={() => setIsReady(true)} showLoading={true} />;
  }

  return <View>{/* Your main app content */}</View>;
}

// ============================================================================
// EXAMPLE 2: With Async Initialization
// ============================================================================

export function AsyncInitializationExample() {
  const [appState, setAppState] = useState<'splash' | 'ready'>('splash');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate async operations
        await Promise.all([loadUserData(), loadSettings(), loadSubscriptionStatus()]);

        // Wait a bit to ensure smooth transition
        await new Promise((resolve) => setTimeout(resolve, 500));

        setAppState('ready');
      } catch (error) {
        console.error('Initialization error:', error);
        // Still show app even if initialization fails
        setAppState('ready');
      }
    };

    initializeApp();
  }, []);

  if (appState === 'splash') {
    return (
      <SplashScreen
        onAnimationComplete={() => {
          console.log('Splash animation completed');
        }}
        showLoading={true}
      />
    );
  }

  return <View>{/* Your main app content */}</View>;
}

// ============================================================================
// EXAMPLE 3: Minimum Display Time
// ============================================================================

export function MinimumDisplayTimeExample() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Ensure splash shows for at least 2 seconds
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);

    // Load data
    loadAppData().then(() => {
      setDataLoaded(true);
    });

    return () => clearTimeout(minTimer);
  }, []);

  // All conditions must be true to show main app
  const shouldShowApp = dataLoaded && minTimeElapsed && animationComplete;

  if (!shouldShowApp) {
    return (
      <SplashScreen
        onAnimationComplete={() => setAnimationComplete(true)}
        showLoading={!dataLoaded}
      />
    );
  }

  return <View>{/* Your main app content */}</View>;
}

// ============================================================================
// EXAMPLE 4: With Error Handling
// ============================================================================

export function ErrorHandlingExample() {
  const [state, setState] = useState<{
    status: 'loading' | 'ready' | 'error';
    error?: string;
  }>({
    status: 'loading',
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadCriticalData();
        setState({ status: 'ready' });
      } catch (error) {
        console.error('Critical error during initialization:', error);
        setState({
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    initializeApp();
  }, []);

  if (state.status === 'loading') {
    return (
      <SplashScreen
        onAnimationComplete={() => {
          // Even if still loading, we've shown the splash
          console.log('Splash animation complete, still loading data...');
        }}
        showLoading={true}
      />
    );
  }

  if (state.status === 'error') {
    return (
      <View>
        {/* Your error screen */}
        {/* Could show splash with error message */}
      </View>
    );
  }

  return <View>{/* Your main app content */}</View>;
}

// ============================================================================
// EXAMPLE 5: With Analytics Tracking
// ============================================================================

export function AnalyticsTrackingExample() {
  const [isReady, setIsReady] = useState(false);
  const [splashStartTime] = useState(Date.now());

  const handleSplashComplete = () => {
    const splashDuration = Date.now() - splashStartTime;

    // Track splash screen metrics
    trackEvent('splash_screen_viewed', {
      duration_ms: splashDuration,
      timestamp: new Date().toISOString(),
    });

    console.log(`Splash screen displayed for ${splashDuration}ms`);
    setIsReady(true);
  };

  if (!isReady) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} showLoading={true} />;
  }

  return <View>{/* Your main app content */}</View>;
}

// ============================================================================
// EXAMPLE 6: With Feature Flags
// ============================================================================

export function FeatureFlagExample() {
  const [isReady, setIsReady] = useState(false);
  const [useNewSplash, setUseNewSplash] = useState(false);

  useEffect(() => {
    // Check feature flag for new splash screen
    checkFeatureFlag('new_splash_screen').then((enabled) => {
      setUseNewSplash(enabled);
    });
  }, []);

  if (!isReady) {
    if (useNewSplash) {
      return <SplashScreen onAnimationComplete={() => setIsReady(true)} showLoading={true} />;
    } else {
      // Fall back to old splash or simple screen
      return <View>{/* Legacy splash screen */}</View>;
    }
  }

  return <View>{/* Your main app content */}</View>;
}

// ============================================================================
// EXAMPLE 7: Integration with Expo Router _layout.tsx
// ============================================================================

export function ExpoRouterLayoutExample() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Do all your app initialization here
        await restoreSession();
        await loadUserPreferences();
        await checkSubscription();

        // Mark app as ready
        setAppReady(true);
      } catch (e) {
        console.warn('Initialization error:', e);
        // Still mark as ready to show app
        setAppReady(true);
      }
    };

    prepare();
  }, []);

  if (!appReady) {
    return (
      <SplashScreen
        onAnimationComplete={() => {
          console.log('Splash screen animation complete');
        }}
        showLoading={true}
      />
    );
  }

  // Return your normal Stack/Tabs layout
  return <>{/* Your Expo Router Stack/Tabs */}</>;
}

// ============================================================================
// Mock Helper Functions (replace with your actual implementations)
// ============================================================================

async function loadUserData() {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

async function loadSettings() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

async function loadSubscriptionStatus() {
  return new Promise((resolve) => setTimeout(resolve, 600));
}

async function loadAppData() {
  return new Promise((resolve) => setTimeout(resolve, 1500));
}

async function loadCriticalData() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

async function restoreSession() {
  return new Promise((resolve) => setTimeout(resolve, 700));
}

async function loadUserPreferences() {
  return new Promise((resolve) => setTimeout(resolve, 400));
}

async function checkSubscription() {
  return new Promise((resolve) => setTimeout(resolve, 600));
}

async function checkFeatureFlag(flag: string): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(true), 100));
}

function trackEvent(eventName: string, properties?: Record<string, any>) {
  console.log('Track event:', eventName, properties);
}
