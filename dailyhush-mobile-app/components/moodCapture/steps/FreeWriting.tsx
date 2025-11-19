/**
 * Nœma - Step 3: Free Writing Component
 *
 * Third step in mood capture flow where users write about their feelings.
 * Most important step - allows free-form expression with gentle support.
 *
 * Features:
 * - Large text area with comfortable typography
 * - Writing prompts to help users start
 * - Voice-to-text for accessibility
 * - Auto-save (3-second debounce)
 * - Privacy reassurance
 * - Optional character count
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { MotiView } from 'moti';
import { Lock } from 'lucide-react-native';
import {
  STEP_HEADER,
  TEXT_AREA,
  STATUS_INDICATORS,
  CHARACTER_COUNT,
  ANIMATIONS,
} from '@/constants/moodCaptureDesign';
import { STEP_SUBTITLES, PRIVACY_MESSAGES } from '@/constants/moodOptions';
import { PromptChips } from '../PromptChips';
import type { Enums } from '@/types/supabase';

// ============================================================================
// TYPES
// ============================================================================

interface FreeWritingProps {
  /**
   * Currently selected mood (from Step 1)
   * Used to filter relevant writing prompts
   */
  selectedMood?: Enums<'mood_type'>;

  /**
   * Current writing content
   */
  content: string;

  /**
   * Callback when content changes
   */
  onContentChange: (content: string) => void;

  /**
   * Callback to save content (for auto-save)
   * Should call API to persist draft
   * @deprecated Auto-save removed - content saved on continue button
   */
  onSave?: (content: string) => Promise<void>;

  /**
   * Show character count
   * @default false
   */
  showCharacterCount?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Step 3: Free writing screen
 * Users can type or dictate their thoughts and feelings
 */
export function FreeWriting({
  selectedMood,
  content,
  onContentChange,
  onSave,
  showCharacterCount = false,
}: FreeWritingProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  // Handle prompt chip selection
  const handlePromptSelect = (promptText: string) => {
    // Insert prompt at cursor position (or append if no cursor)
    const newContent = content ? `${content}\n\n${promptText} ` : `${promptText} `;
    onContentChange(newContent);

    // Focus text input after inserting prompt
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  };

  // Show character count only if enabled and above threshold
  const shouldShowCharCount = showCharacterCount && content.length > CHARACTER_COUNT.showThreshold;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={100}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: ANIMATIONS.fadeIn.duration,
          }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {/* Step Header */}
              <View style={styles.header}>
                <Text style={styles.title}>What's on your mind?</Text>
                <Text style={styles.subtitle}>{STEP_SUBTITLES.step3}</Text>
              </View>

              {/* Writing Prompts */}
              <PromptChips mood={selectedMood} onPromptSelect={handlePromptSelect} />
            </View>
          </TouchableWithoutFeedback>

          {/* Text Area Wrapper */}
          <View style={styles.textAreaWrapper}>
            <Pressable
              style={[styles.textAreaContainer, isFocused && styles.textAreaFocused]}
              onPressIn={() => {
                if (!isFocused) {
                  textInputRef.current?.focus();
                }
              }}
              android_disableSound
              accessible={false}>
              <TextInput
                ref={textInputRef}
                style={styles.textInput}
                value={content}
                onChangeText={onContentChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Start writing here... or tap a prompt above"
                placeholderTextColor={TEXT_AREA.placeholder.color}
                multiline
                textAlignVertical="top"
                autoCapitalize="sentences"
                autoCorrect
                spellCheck
                scrollEnabled
                blurOnSubmit={true}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                accessibilityRole="text"
                accessibilityLabel="Journal entry text area"
                accessibilityHint="Type your thoughts and feelings here. Tap outside or swipe down to close keyboard."
              />
            </Pressable>
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {/* Privacy Badge */}
              <View style={styles.privacyBadge}>
                <Lock
                  size={STATUS_INDICATORS.privacy.icon.size}
                  color={STATUS_INDICATORS.privacy.icon.color}
                />
                <Text style={styles.privacyText}>{PRIVACY_MESSAGES.encrypted}</Text>
              </View>

              {/* Character Count (optional) */}
              {shouldShowCharCount && (
                <View style={styles.charCountContainer}>
                  <Text style={styles.charCountText}>{content.length} characters</Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    ...STEP_HEADER.title,
  },
  subtitle: {
    ...STEP_HEADER.subtitle,
  },
  textAreaWrapper: {
    position: 'relative',
  },
  textAreaContainer: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: TEXT_AREA.container.backgroundColor,
    borderRadius: TEXT_AREA.container.borderRadius,
    borderWidth: TEXT_AREA.container.borderWidth,
    borderColor: TEXT_AREA.container.borderColor,
    padding: TEXT_AREA.container.padding,
    marginBottom: TEXT_AREA.container.marginBottom,
    minHeight: TEXT_AREA.container.minHeight,
  },
  textAreaFocused: {
    ...TEXT_AREA.focused,
  },
  textInput: {
    flex: 1,
    fontSize: TEXT_AREA.input.fontSize,
    fontWeight: TEXT_AREA.input.fontWeight,
    lineHeight: TEXT_AREA.input.lineHeight,
    letterSpacing: TEXT_AREA.input.letterSpacing,
    color: TEXT_AREA.input.color,
    textAlignVertical: TEXT_AREA.input.textAlignVertical,
    padding: TEXT_AREA.input.padding,
    minHeight: TEXT_AREA.input.minHeight,
  },
  privacyBadge: {
    ...STATUS_INDICATORS.privacy,
    marginTop: 12,
  },
  privacyText: {
    ...STATUS_INDICATORS.privacy.text,
  },
  charCountContainer: {
    ...CHARACTER_COUNT.container,
  },
  charCountText: {
    ...CHARACTER_COUNT.text,
  },
});
