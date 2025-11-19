/**
 * QuickNotesInput Component
 *
 * Optional notes input with character counter and equal-weight action buttons.
 *
 * ADDRESSES UX P0 FINDING #5: Equal-weight Skip and Submit buttons
 *
 * @module components/mood-widget/QuickNotesInput
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { PillButton } from '@/components/ui/pill-button';
import type { QuickNotesInputProps } from '@/types/widget.types';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';
import { ACCESSIBILITY_LABELS } from '@/constants/widgetConfig';

/**
 * QuickNotesInput component
 * Optional text input for mood notes
 */
export function QuickNotesInput({
  value,
  onChange,
  onSkip,
  onSubmit,
  visible,
  config,
  isSubmitting = false,
}: QuickNotesInputProps) {
  const inputRef = useRef<TextInput>(null);

  // Auto-focus when visible
  useEffect(() => {
    if (visible && config.autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Small delay for animation
    }
  }, [visible, config.autoFocus]);

  // Dismiss keyboard when component unmounts
  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  if (!visible) {
    return null;
  }

  const characterCount = value.length;
  const maxLength = config.maxLength || 200;
  const isOverLimit = characterCount > maxLength;

  // Handle keyboard dismiss
  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Add a note (optional)</Text>

      {/* Text input */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        placeholder={config.placeholder}
        placeholderTextColor={colors.text.secondary + '60'} // 60% opacity
        multiline
        numberOfLines={3}
        maxLength={maxLength}
        style={[styles.input, isOverLimit && styles.inputError]}
        accessibilityLabel={ACCESSIBILITY_LABELS.quickNotes.input}
        accessibilityHint={ACCESSIBILITY_LABELS.quickNotes.inputHint}
        editable={!isSubmitting}
        returnKeyType="done"
        blurOnSubmit={true}
        onSubmitEditing={handleDismissKeyboard}
        keyboardAppearance="dark"
      />

      {/* Character counter */}
      {config.showCounter && (
        <Text style={[styles.counter, isOverLimit && styles.counterError]}>
          {characterCount} / {maxLength}
        </Text>
      )}

      {/* Action buttons (equal weight - UX P0 fix #5) */}
      <View style={styles.actions}>
        <PillButton
          label="Skip"
          onPress={() => {
            Keyboard.dismiss();
            onSkip();
          }}
          variant="secondary"
          style={styles.actionButton}
          disabled={isSubmitting}
          accessibilityLabel={ACCESSIBILITY_LABELS.quickNotes.skipButton}
          accessibilityHint={ACCESSIBILITY_LABELS.quickNotes.skipHint}
        />
        <PillButton
          label={isSubmitting ? 'Saving...' : 'Submit'}
          onPress={() => {
            Keyboard.dismiss();
            onSubmit();
          }}
          variant="primary"
          style={styles.actionButton}
          disabled={isSubmitting || isOverLimit}
          accessibilityLabel={ACCESSIBILITY_LABELS.quickNotes.submitButton}
          accessibilityHint={ACCESSIBILITY_LABELS.quickNotes.submitHint}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    fontSize: 15,
    color: colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  counter: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  counterError: {
    color: colors.status.error,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1, // Equal width for both buttons
  },
});
