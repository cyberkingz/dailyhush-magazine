/**
 * DailyHush - Step 3: Free Writing Component
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
import { VoiceToTextButton } from '../VoiceToTextButton';
import { AutoSaveIndicator } from '../AutoSaveIndicator';
import { useAutoSave, type AutoSaveStatus } from '@/hooks/useAutoSave';
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
   */
  onSave: (content: string) => Promise<void>;

  /**
   * Enable voice-to-text
   * @default true
   */
  enableVoice?: boolean;

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
  enableVoice = true,
  showCharacterCount = false,
}: FreeWritingProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  // Auto-save hook (3-second debounce)
  const autoSave = useAutoSave(content, {
    onSave,
    debounceMs: 3000,
    savedIndicatorDuration: 2000,
  });

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

  // Handle voice transcription
  const handleVoiceTranscription = (transcription: string) => {
    // Append transcription to existing content
    const newContent = content
      ? `${content}\n\n${transcription}`
      : transcription;
    onContentChange(newContent);
  };

  // Show character count only if enabled and above threshold
  const shouldShowCharCount =
    showCharacterCount && content.length > CHARACTER_COUNT.showThreshold;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: ANIMATIONS.fadeIn.duration,
          }}
        >
          {/* Step Header */}
          <View style={styles.header}>
            <Text style={styles.title}>What's on your mind?</Text>
            <Text style={styles.subtitle}>{STEP_SUBTITLES.step3}</Text>
          </View>

          {/* Writing Prompts */}
          <PromptChips mood={selectedMood} onPromptSelect={handlePromptSelect} />

          {/* Text Area */}
          <View style={[styles.textAreaContainer, isFocused && styles.textAreaFocused]}>
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
              accessibilityRole="text"
              accessibilityLabel="Journal entry text area"
              accessibilityHint="Type your thoughts and feelings here"
            />

            {/* Voice-to-Text Button (floating) */}
            {enableVoice && (
              <VoiceToTextButton
                onTranscription={handleVoiceTranscription}
                language="en-US"
                maxDuration={120000}
              />
            )}
          </View>

          {/* Status Indicators Row */}
          <View style={styles.statusContainer}>
            {/* Privacy Badge */}
            <View style={styles.privacyBadge}>
              <Lock
                size={STATUS_INDICATORS.privacy.icon.size}
                color={STATUS_INDICATORS.privacy.icon.color}
              />
              <Text style={styles.privacyText}>
                {PRIVACY_MESSAGES.encrypted}
              </Text>
            </View>

            {/* Auto-Save Indicator */}
            <AutoSaveIndicator
              status={autoSave.status}
              lastSaved={autoSave.lastSaved}
              error={autoSave.error}
              onRetry={autoSave.retry}
            />
          </View>

          {/* Character Count (optional) */}
          {shouldShowCharCount && (
            <View style={styles.charCountContainer}>
              <Text style={styles.charCountText}>{content.length} characters</Text>
            </View>
          )}
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
  textAreaContainer: {
    ...TEXT_AREA.container,
    position: 'relative',
  },
  textAreaFocused: {
    ...TEXT_AREA.focused,
  },
  textInput: {
    ...TEXT_AREA.input,
  },
  statusContainer: {
    ...STATUS_INDICATORS.container,
  },
  privacyBadge: {
    ...STATUS_INDICATORS.privacy,
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
