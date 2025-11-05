/**
 * DailyHush - Interactive Step Input Component
 * Beautiful, therapeutic input for spiral interrupt protocols
 * Supports text, list, and count input types with calm, supportive design
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { RADIUS, TYPOGRAPHY, TOUCH_TARGET, ANIMATIONS } from '@/constants/design-tokens';
import { InteractiveStepConfig } from '@/types';

interface InteractiveStepInputProps {
  /** Configuration containing type, prompt, placeholder, maxLength */
  config: InteractiveStepConfig;
  /** Current input value */
  value: string;
  /** Called when text changes */
  onChangeText: (text: string) => void;
  /** Called when user presses "Done" or submits (optional) */
  onSubmit?: () => void;
  /** Auto-focus on mount for smooth flow (optional) */
  autoFocus?: boolean;
  /** Test ID for testing (optional) */
  testID?: string;
}

/**
 * InteractiveStepInput Component
 *
 * Therapeutic input component for collecting user responses during crisis protocols.
 * Matches the app's calming tropical rainforest dark theme with neon lime accents.
 *
 * @example
 * ```tsx
 * <InteractiveStepInput
 *   config={{
 *     type: 'list',
 *     prompt: 'Name 5 things you can see',
 *     placeholder: '1. The lamp\n2. My coffee mug\n3. ',
 *     maxLength: 200
 *   }}
 *   value={listValue}
 *   onChangeText={setListValue}
 *   onSubmit={handleContinue}
 *   autoFocus={true}
 * />
 * ```
 */
export function InteractiveStepInput({
  config,
  value,
  onChangeText,
  onSubmit,
  autoFocus = false,
  testID,
}: InteractiveStepInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Auto-focus when component mounts if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  /**
   * Handle text change with validation for count type
   */
  const handleTextChange = (text: string) => {
    if (config.type === 'count') {
      // Only allow numbers for count type
      const numericText = text.replace(/[^0-9]/g, '');
      onChangeText(numericText);
    } else {
      onChangeText(text);
    }
  };

  /**
   * Handle submit editing
   */
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  /**
   * Get placeholder text based on type
   */
  const getPlaceholder = (): string => {
    if (config.placeholder) {
      return config.placeholder;
    }

    // Default placeholders by type
    switch (config.type) {
      case 'text':
        return 'Type your response...';
      case 'list':
        return '1. First item\n2. Second item\n3. Third item';
      case 'count':
        return '0';
      default:
        return '';
    }
  };

  /**
   * Get keyboard type based on input type
   */
  const getKeyboardType = () => {
    switch (config.type) {
      case 'count':
        return 'number-pad';
      default:
        return 'default';
    }
  };

  /**
   * Get return key type
   */
  const getReturnKeyType = () => {
    switch (config.type) {
      case 'list':
        return 'default'; // Allow newlines
      default:
        return 'done';
    }
  };

  /**
   * Determine if input should be multiline
   */
  const isMultiline = config.type === 'list';

  /**
   * Get number of lines for multiline input
   */
  const getNumberOfLines = () => {
    if (config.type === 'list') {
      return 5;
    }
    return 1;
  };

  /**
   * Get dynamic input styles based on state
   */
  const getInputStyle = () => {
    const baseStyles = [
      styles.input,
      isMultiline && styles.inputMultiline,
    ];

    if (isFocused) {
      return [...baseStyles, styles.inputFocused];
    }

    return baseStyles;
  };

  /**
   * Calculate character count display
   */
  const getCharacterCount = () => {
    if (!config.maxLength) return null;
    return `${value.length}/${config.maxLength}`;
  };

  /**
   * Get helper text based on type and character count
   */
  const getHelperText = () => {
    const charCount = getCharacterCount();

    if (charCount) {
      return charCount;
    }

    // Optional: Add type-specific helper text
    switch (config.type) {
      case 'count':
        return 'Enter a number';
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Prompt Label */}
      <Text style={styles.label}>{config.prompt}</Text>

      {/* Input Field */}
      <TextInput
        ref={inputRef}
        style={getInputStyle()}
        value={value}
        onChangeText={handleTextChange}
        placeholder={getPlaceholder()}
        placeholderTextColor={colors.text.secondary}
        keyboardType={getKeyboardType()}
        returnKeyType={getReturnKeyType()}
        multiline={isMultiline}
        numberOfLines={isMultiline ? getNumberOfLines() : 1}
        maxLength={config.maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSubmit}
        blurOnSubmit={!isMultiline}
        autoFocus={autoFocus}
        autoCapitalize={config.type === 'count' ? 'none' : 'sentences'}
        autoCorrect={config.type !== 'count'}
        testID={testID}
        accessibilityLabel={config.prompt}
        accessibilityHint="Enter your response"
        accessibilityRole="text"
      />

      {/* Helper Text / Character Count */}
      {getHelperText() && (
        <Text style={styles.helperText}>{getHelperText()}</Text>
      )}

      {/* Focus Glow Effect (iOS shadow effect) */}
      {isFocused && Platform.OS === 'ios' && (
        <View style={styles.glowEffect} pointerEvents="none" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
    width: '100%',
  },

  label: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.bodyMedium.fontFamily,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },

  input: {
    minHeight: TOUCH_TARGET.min,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.background.border,
    borderRadius: RADIUS.md,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontFamily: TYPOGRAPHY.body.fontFamily,
    lineHeight: TYPOGRAPHY.body.lineHeight,
    color: colors.text.primary,
    // Smooth transition for therapeutic feel
    ...Platform.select({
      ios: {
        // iOS uses shadow transitions
      },
      android: {
        // Android can use elevation for subtle depth
        elevation: 0,
      },
    }),
  },

  inputMultiline: {
    minHeight: 120,
    paddingTop: spacing.base,
    paddingBottom: spacing.base,
    textAlignVertical: 'top',
  },

  inputFocused: {
    borderColor: colors.lime[500],
    backgroundColor: colors.background.secondary,
    // Subtle lime glow for focused state
    ...Platform.select({
      ios: {
        shadowColor: colors.lime[500],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  helperText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.bodySmall.fontFamily,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    opacity: 0.8,
  },

  glowEffect: {
    position: 'absolute',
    top: spacing.xl + 8, // Position below label
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RADIUS.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gradients.glowSubtle,
    opacity: 0.6,
    pointerEvents: 'none',
  },
});
