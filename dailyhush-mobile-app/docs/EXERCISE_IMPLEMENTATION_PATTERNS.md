# Mental Health Exercise Implementation Patterns

## Quick Reference Guide for Developers

This document provides copy-paste ready code patterns for implementing the 5 mental health exercises following the UX framework for ages 55-70.

---

## Pattern 1: Age-Optimized Button Component

```typescript
// components/exercises/AccessibleButton.tsx
import { Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface AccessibleButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'large' | 'standard';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function AccessibleButton({
  onPress,
  label,
  variant = 'primary',
  size = 'standard',
  disabled = false,
  icon,
}: AccessibleButtonProps) {
  const handlePress = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        size === 'large' && styles.large,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          size === 'large' && styles.textLarge,
          variant === 'ghost' && styles.textGhost,
          disabled && styles.textDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingHorizontal: spacing.xl,
    height: spacing.button.height, // 56pt
    minWidth: 140, // Minimum for readable text
  },
  large: {
    height: 60, // Even larger for critical actions
    minWidth: 200,
  },
  primary: {
    backgroundColor: colors.button.primary,
    shadowColor: colors.emerald[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  secondary: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.emerald[600] + '50', // 30% opacity
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.background.tertiary,
  },
  disabled: {
    backgroundColor: colors.button.disabled,
    opacity: 0.5,
    shadowOpacity: 0,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    fontSize: 18, // Age-optimized
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.3,
  },
  textLarge: {
    fontSize: 20,
  },
  textGhost: {
    color: colors.text.secondary,
  },
  textDisabled: {
    color: colors.text.muted,
  },
});
```

---

## Pattern 2: Emotion Scale Component

```typescript
// components/exercises/EmotionScale.tsx
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Text } from '@/components/ui/text';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';

interface EmotionScaleProps {
  value: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
  showNumber?: boolean;
}

export function EmotionScale({
  value,
  onChange,
  minLabel,
  maxLabel,
  showNumber = true,
}: EmotionScaleProps) {
  const handleChange = (newValue: number) => {
    // Haptic feedback on integer changes
    const rounded = Math.round(newValue);
    if (rounded !== Math.round(value)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(rounded);
  };

  return (
    <View style={styles.container}>
      {/* Value Display */}
      {showNumber && (
        <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>{Math.round(value)}</Text>
          <Text style={styles.valueLabel}>/ 10</Text>
        </View>
      )}

      {/* Slider with large touch area */}
      <Slider
        value={value}
        onValueChange={handleChange}
        minimumValue={1}
        maximumValue={10}
        step={1}
        minimumTrackTintColor={colors.emerald[500]}
        maximumTrackTintColor={colors.background.tertiary}
        thumbTintColor={colors.emerald[400]}
        style={styles.slider}
        // Accessibility
        accessibilityLabel="Emotion intensity scale"
        accessibilityValue={{ min: 1, max: 10, now: Math.round(value) }}
        accessibilityHint={`Currently ${Math.round(value)} out of 10`}
      />

      {/* Labels */}
      <View style={styles.labels}>
        <Text style={styles.labelText}>{minLabel}</Text>
        <Text style={styles.labelText}>{maxLabel}</Text>
      </View>

      {/* Visual markers */}
      <View style={styles.markers}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((marker) => (
          <View
            key={marker}
            style={[
              styles.marker,
              marker <= Math.round(value) && styles.markerActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  valueDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 24,
  },
  valueText: {
    fontSize: 48, // Large for easy reading
    fontWeight: 'bold',
    color: colors.emerald[400],
  },
  valueLabel: {
    fontSize: 24,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  slider: {
    width: '100%',
    height: 60, // Extra large touch area
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  markers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.tertiary,
  },
  markerActive: {
    backgroundColor: colors.emerald[500],
  },
});
```

---

## Pattern 3: Breathing Animation Component

```typescript
// components/exercises/BreathingCircle.tsx
import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, useReducedMotion } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

interface BreathingCircleProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'pause';
  duration: number;
  size?: number;
}

export function BreathingCircle({
  phase,
  duration,
  size = 200,
}: BreathingCircleProps) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      // Static display for users with motion sensitivity
      scale.setValue(1.0);
      opacity.setValue(0.8);
      return;
    }

    // Animate based on breathing phase
    const scaleTarget = phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1.0;
    const opacityTarget = phase === 'inhale' ? 1.0 : 0.6;

    Animated.parallel([
      Animated.timing(scale, {
        toValue: scaleTarget,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: opacityTarget,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [phase, duration, reduceMotion]);

  const phaseLabels = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    pause: 'Pause',
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <View style={styles.innerCircle}>
          <Text style={styles.phaseText}>{phaseLabels[phase]}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  circle: {
    backgroundColor: colors.emerald[600] + '40', // 25% opacity
    borderWidth: 3,
    borderColor: colors.emerald[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.emerald[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
});
```

---

## Pattern 4: Night Mode Detection Hook

```typescript
// hooks/useNightMode.ts
import { useMemo } from 'react';
import { colors } from '@/constants/colors';

export function useNightMode() {
  const isNightTime = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 21 || hour <= 6; // 9pm - 6am
  }, []);

  const nightColors = useMemo(() => {
    if (!isNightTime) {
      return {
        background: colors.background.primary,
        text: colors.text.primary,
        textSecondary: colors.text.secondary,
        primary: colors.button.primary,
      };
    }

    // Night-optimized colors (amber spectrum, low blue light)
    return {
      background: '#000000', // Pure black for OLED
      text: '#D4A574', // Warm amber
      textSecondary: '#8B7355', // Darker amber
      primary: '#B8956B', // Muted gold
    };
  }, [isNightTime]);

  const nightHapticIntensity = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) return 0.3; // 30% at night
    if (hour >= 20 || hour <= 8) return 0.6; // 60% evening/morning
    return 1.0; // 100% during day
  }, []);

  return {
    isNightTime,
    colors: nightColors,
    hapticIntensity: nightHapticIntensity,
  };
}
```

---

## Pattern 5: Auto-Save Progress Hook

```typescript
// hooks/useAutoSave.ts
import { useEffect, useRef } from 'react';
import { debounce } from '@/utils/debounce';

interface AutoSaveOptions {
  delay?: number;
  onSave: () => Promise<void>;
  deps: any[];
  enabled?: boolean;
}

export function useAutoSave({
  delay = 1000,
  onSave,
  deps,
  enabled = true,
}: AutoSaveOptions) {
  const isMounted = useRef(false);

  // Create debounced save function
  const debouncedSave = useRef(
    debounce(async () => {
      if (!enabled) return;
      try {
        await onSave();
        console.log('Auto-save completed');
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Fail silently - we'll retry on next change
      }
    }, delay)
  ).current;

  useEffect(() => {
    // Skip first mount
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    // Trigger debounced save when dependencies change
    if (enabled) {
      debouncedSave();
    }
  }, deps);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel?.();
    };
  }, []);
}

// Usage example:
/*
const [emotionData, setEmotionData] = useState({
  emotion: '',
  intensity: 5,
  context: '',
});

useAutoSave({
  onSave: async () => {
    await saveEmotionData(emotionData);
  },
  deps: [emotionData],
  delay: 2000, // 2 second delay
});
*/
```

---

## Pattern 6: Accessible Text Input

```typescript
// components/exercises/AccessibleTextInput.tsx
import { TextInput, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface AccessibleTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
}

export function AccessibleTextInput({
  value,
  onChangeText,
  placeholder = '',
  label,
  multiline = false,
  maxLength,
  autoFocus = false,
}: AccessibleTextInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        multiline={multiline}
        maxLength={maxLength}
        autoFocus={autoFocus}
        style={[
          styles.input,
          multiline && styles.multiline,
        ]}
        // Age-optimized settings
        autoCorrect={true}
        spellCheck={true}
        autoCapitalize="sentences"
        // Accessibility
        accessibilityLabel={label || placeholder}
        accessibilityHint="Text input field"
        // Large font scaling
        allowFontScaling={true}
        maxFontSizeMultiplier={1.3}
      />

      {maxLength && (
        <Text style={styles.counter}>
          {value.length} / {maxLength}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 16,
    padding: spacing.base,
    fontSize: 18, // Age-optimized
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.emerald[600] + '30',
    minHeight: 56, // Comfortable touch target
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'right',
    marginTop: spacing.sm,
  },
});
```

---

## Pattern 7: Exercise Progress Tracker

```typescript
// components/exercises/ProgressTracker.tsx
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  showStepCounter?: boolean;
  variant?: 'dots' | 'bar';
}

export function ProgressTracker({
  currentStep,
  totalSteps,
  showStepCounter = true,
  variant = 'dots',
}: ProgressTrackerProps) {
  const progress = (currentStep / totalSteps) * 100;

  if (variant === 'bar') {
    return (
      <View style={styles.container}>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${progress}%` }]} />
        </View>
        {showStepCounter && (
          <Text style={styles.stepText}>
            {currentStep} of {totalSteps}
          </Text>
        )}
      </View>
    );
  }

  // Dots variant
  return (
    <View style={styles.container}>
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index < currentStep && styles.dotCompleted,
              index === currentStep && styles.dotCurrent,
            ]}
          />
        ))}
      </View>
      {showStepCounter && (
        <Text style={styles.stepText}>
          {currentStep} of {totalSteps}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  // Bar variant
  barBackground: {
    width: '100%',
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.emerald[500],
    borderRadius: 4,
  },
  // Dots variant
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.tertiary,
  },
  dotCompleted: {
    backgroundColor: colors.emerald[500],
  },
  dotCurrent: {
    backgroundColor: colors.emerald[400],
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
});
```

---

## Pattern 8: Exit Confirmation Modal

```typescript
// components/exercises/ExitConfirmation.tsx
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface ExitConfirmationProps {
  visible: boolean;
  onContinue: () => void;
  onExit: () => void;
  message?: string;
}

export function ExitConfirmation({
  visible,
  onContinue,
  onExit,
  message = 'Take a break?',
}: ExitConfirmationProps) {
  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onContinue();
  };

  const handleExit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onExit();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleContinue} // Android back button
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.button,
                styles.buttonPrimary,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Keep Going</Text>
            </Pressable>

            <Pressable
              onPress={handleExit}
              style={({ pressed }) => [
                styles.button,
                styles.buttonSecondary,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                Not Now
              </Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>Come back anytime.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modal: {
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.emerald[600] + '30',
  },
  message: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  buttons: {
    gap: spacing.md,
  },
  button: {
    height: 56,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.button.primary,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.background.tertiary,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  buttonTextSecondary: {
    color: colors.text.secondary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
```

---

## Pattern 9: Voice Input Button

```typescript
// components/exercises/VoiceInputButton.tsx
import { useState } from 'react';
import { Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Mic, MicOff } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  disabled?: boolean;
}

export function VoiceInputButton({
  onTranscript,
  isRecording,
  onToggleRecording,
  disabled = false,
}: VoiceInputButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePress = async () => {
    if (disabled || isProcessing) return;

    await Haptics.impactAsync(
      isRecording
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    );

    onToggleRecording();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isProcessing}
      style={({ pressed }) => [
        styles.button,
        isRecording && styles.buttonRecording,
        disabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
    >
      {isProcessing ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <>
          {isRecording ? (
            <MicOff size={24} color={colors.white} strokeWidth={2} />
          ) : (
            <Mic size={24} color={colors.white} strokeWidth={2} />
          )}
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Tap to Speak'}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 56,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.emerald[600],
    borderRadius: 100,
    shadowColor: colors.emerald[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonRecording: {
    backgroundColor: colors.status.error,
    shadowColor: colors.status.error,
  },
  buttonDisabled: {
    backgroundColor: colors.button.disabled,
    opacity: 0.5,
    shadowOpacity: 0,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
```

---

## Pattern 10: Time-Based Haptic Intensity

```typescript
// utils/haptics.ts
import * as Haptics from 'expo-haptics';

/**
 * Get haptic intensity based on time of day
 * Night: 30% | Evening/Morning: 60% | Day: 100%
 */
export function getHapticIntensity(): number {
  const hour = new Date().getHours();

  if (hour >= 22 || hour <= 6) {
    return 0.3; // Night (10pm - 6am)
  }

  if (hour >= 20 || hour <= 8) {
    return 0.6; // Evening/Morning (8pm - 10pm, 6am - 8am)
  }

  return 1.0; // Day
}

/**
 * Play haptic feedback with time-aware intensity
 * Note: React Native Haptics doesn't support intensity directly,
 * so we use different patterns for different intensities
 */
export async function playAdaptiveHaptic(
  type: 'light' | 'medium' | 'heavy' = 'light'
) {
  const intensity = getHapticIntensity();

  // Skip haptics entirely at night if user prefers
  if (intensity < 0.4) {
    // Use lighter haptic style
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } else if (intensity < 0.7) {
    // Use medium haptic style
    await Haptics.impactAsync(
      type === 'heavy'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    );
  } else {
    // Use requested haptic style
    const style = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    }[type];

    await Haptics.impactAsync(style);
  }
}

/**
 * Success haptic with time awareness
 */
export async function playSuccessHaptic() {
  const intensity = getHapticIntensity();

  if (intensity < 0.4) {
    // Gentle single pulse at night
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } else {
    // Full success notification
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}
```

---

## Quick Implementation Checklist

### For Each Exercise Screen:

```typescript
// 1. Import accessibility helpers
import { useReducedMotion } from 'react-native-reanimated';
import { useNightMode } from '@/hooks/useNightMode';
import { useAutoSave } from '@/hooks/useAutoSave';

// 2. Setup accessibility
const reduceMotion = useReducedMotion();
const { isNightTime, colors: nightColors } = useNightMode();

// 3. Large touch targets
const BUTTON_HEIGHT = 56; // Minimum
const BUTTON_HEIGHT_LARGE = 60; // For critical actions
const MIN_TOUCH_TARGET = 44; // Never go below

// 4. Age-optimized fonts
const FONT_BODY = 18;     // Primary text
const FONT_LARGE = 20;    // Important text
const FONT_HEADING = 28;  // Screen titles

// 5. Auto-save progress
useAutoSave({
  onSave: async () => {
    await saveExerciseProgress(exerciseData);
  },
  deps: [exerciseData],
  delay: 2000,
});

// 6. Haptic feedback
import { playAdaptiveHaptic } from '@/utils/haptics';
// Use instead of direct Haptics calls

// 7. Exit handling
const [showExitModal, setShowExitModal] = useState(false);
// Show ExitConfirmation component

// 8. Night mode colors
const backgroundColor = isNightTime ? '#000000' : colors.background.primary;
```

---

## Testing Checklist

Before shipping each exercise:

### Visual Tests
- [ ] Test with iOS Dynamic Type at maximum size
- [ ] Test at 20% screen brightness
- [ ] Test with Reduce Transparency enabled
- [ ] Test with Smart Invert Colors
- [ ] Test in pure darkness (bedroom test)

### Interaction Tests
- [ ] Test all buttons with finger tip (not stylus)
- [ ] Test with tremor simulation (shake phone slightly)
- [ ] Test with Reduce Motion enabled
- [ ] Test all text inputs with voice dictation
- [ ] Test exit at every step

### Accessibility Tests
- [ ] Run Xcode Accessibility Inspector
- [ ] Test with VoiceOver screen reader
- [ ] Verify all touch targets ≥ 44pt
- [ ] Verify all text ≥ 18pt (or 16pt minimum)
- [ ] Verify contrast ratios ≥ 7:1 (WCAG AAA)

### Real-World Tests
- [ ] Test lying in bed (portrait only)
- [ ] Test in bright sunlight
- [ ] Test in moving vehicle (if applicable)
- [ ] Test with interruptions (phone call, notification)
- [ ] Test offline mode

---

## File Structure Recommendation

```
app/exercises/
├── calm-anxiety/
│   ├── index.tsx                 # Main screen
│   ├── breathing.tsx             # Box breathing technique
│   ├── body-scan.tsx             # Body scan technique
│   └── grounding.tsx             # Grounding technique
├── gain-focus/
│   ├── index.tsx                 # Brain dump entry
│   ├── prioritize.tsx            # Task prioritization
│   └── timer.tsx                 # Focus timer
├── process-emotions/
│   ├── index.tsx                 # Emotion wheel
│   ├── intensity.tsx             # Intensity rating
│   ├── context.tsx               # Trigger identification
│   └── journal.tsx               # Optional journaling
├── sleep/
│   ├── index.tsx                 # Time-aware entry
│   ├── preparation.tsx           # Evening wind-down
│   └── night-wake.tsx            # 3am protocol
└── stop-spiral/
    └── index.tsx                 # Already implemented

components/exercises/
├── AccessibleButton.tsx
├── AccessibleTextInput.tsx
├── BreathingCircle.tsx
├── EmotionScale.tsx
├── ExitConfirmation.tsx
├── ProgressTracker.tsx
└── VoiceInputButton.tsx

hooks/
├── useAutoSave.ts
├── useNightMode.ts
└── useExerciseTracking.ts

utils/
└── haptics.ts
```

---

## Performance Optimizations

### 1. Lazy Load Exercise Screens
```typescript
// app/_layout.tsx
const CalmAnxiety = lazy(() => import('./exercises/calm-anxiety'));
const GainFocus = lazy(() => import('./exercises/gain-focus'));
// etc.
```

### 2. Memoize Heavy Components
```typescript
const BreathingCircle = memo(BreathingCircleComponent);
const EmotionWheel = memo(EmotionWheelComponent);
```

### 3. Optimize Animations
```typescript
// Use useNativeDriver for transforms
Animated.timing(value, {
  toValue: 1,
  duration: 400,
  useNativeDriver: true, // ← Critical for 60fps
}).start();
```

### 4. Cache Audio Files
```typescript
// Preload meditation audio on app launch
useEffect(() => {
  Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
  });

  // Cache audio files
  Asset.loadAsync([
    require('@/assets/sounds/meditation.mp3'),
    require('@/assets/sounds/breathing.mp3'),
  ]);
}, []);
```

---

This implementation guide provides production-ready patterns that follow the UX framework. All patterns are optimized for the 55-70 demographic with accessibility as a first-class concern.
