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
  /** Called when input gains focus */
  onFocusInput?: () => void;
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
  onFocusInput,
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
    const baseStyles = [styles.input, isMultiline && styles.inputMultiline];

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

  const handleFocus = () => {
    setIsFocused(true);
    onFocusInput?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
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
        placeholderTextColor={colors.text.muted}
        keyboardType={getKeyboardType()}
        returnKeyType={getReturnKeyType()}
        multiline={isMultiline}
        numberOfLines={isMultiline ? getNumberOfLines() : 1}
        maxLength={config.maxLength}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
      {getHelperText() && <Text style={styles.helperText}>{getHelperText()}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },

  label: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.base,
    letterSpacing: 0.3,
  },

  input: {
    minHeight: TOUCH_TARGET.min,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: RADIUS.xl,
    fontSize: 19,
    lineHeight: 30,
    fontFamily: 'Inter_500Medium',
    color: colors.text.primary,
    letterSpacing: 0.2,
    ...Platform.select({
      android: {
        elevation: 0,
      },
    }),
  },

  inputMultiline: {
    minHeight: 140,
    paddingTop: spacing.base,
    paddingBottom: spacing.base,
    textAlignVertical: 'top',
  },

  inputFocused: {
    borderColor: colors.lime[600],
    backgroundColor: '#051913',
  },

  helperText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.text.muted,
    marginTop: spacing.sm,
    letterSpacing: 0.3,
  },

  glowEffect: {
    display: 'none',
  },
});
