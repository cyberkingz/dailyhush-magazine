/**
 * Post-Exercise Survey Modal
 * Shown after Anna's victory message to collect post-feeling and trigger data
 */

import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface PostExerciseSurveyProps {
  visible: boolean;
  preFeelingScore: number;
  onComplete: (postFeelingScore: number, trigger?: string) => void;
  onSkip: () => void;
}

const commonTriggers = [
  'Work stress',
  'Relationship',
  'Health anxiety',
  'Social situation',
  'Money worries',
  'Other',
];

const postFeelingOptions = [
  {
    value: 10,
    emoji: '😌',
    label: 'Calm',
  },
  {
    value: 8,
    emoji: '🙂',
    label: 'Better',
  },
  {
    value: 6,
    emoji: '😐',
    label: 'Neutral',
  },
  {
    value: 4,
    emoji: '😟',
    label: 'Uneasy',
  },
  {
    value: 2,
    emoji: '😰',
    label: 'Anxious',
  },
];

export function PostExerciseSurvey({
  visible,
  preFeelingScore,
  onComplete,
  onSkip,
}: PostExerciseSurveyProps) {
  const [postFeelingScore, setPostFeelingScore] = useState<number | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string>('');
  const [customTriggerText, setCustomTriggerText] = useState<string>('');
  const [stage, setStage] = useState<'feeling' | 'trigger'>('feeling');

  const handleContinue = () => {
    if (stage === 'feeling' && postFeelingScore) {
      setStage('trigger');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (stage === 'trigger') {
      const finalTrigger =
        selectedTrigger === 'Other' && customTriggerText.trim()
          ? customTriggerText.trim()
          : selectedTrigger || undefined;

      onComplete(postFeelingScore || 5, finalTrigger);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSkip();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} statusBarTranslucent>
      <LinearGradient
        colors={['#0A1612', '#0F1F1A', '#0A1612']}
        locations={[0, 0.5, 1]}
        style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 44 }} />
          <Text style={styles.headerTitle}>Quick Check-In</Text>
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 22,
              backgroundColor: pressed ? 'rgba(64, 145, 108, 0.25)' : 'rgba(64, 145, 108, 0.15)',
              borderWidth: 1,
              borderColor: 'rgba(82, 183, 136, 0.3)',
            })}>
            <X size={20} color="#E8F4F0" strokeWidth={2.5} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {stage === 'feeling' && (
            <>
              <Text style={styles.title}>How are you feeling now?</Text>
              <Text style={styles.subtitle}>After completing the exercise</Text>

              <View style={styles.optionsGrid}>
                {postFeelingOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      setPostFeelingScore(option.value);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={[
                      styles.optionCard,
                      {
                        backgroundColor: postFeelingScore === option.value ? '#40916C' : '#1A4D3C',
                        borderColor:
                          postFeelingScore === option.value
                            ? 'rgba(82, 183, 136, 0.5)'
                            : 'rgba(64, 145, 108, 0.2)',
                      },
                    ]}>
                    <Text style={styles.optionEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: postFeelingScore === option.value ? '#FFFFFF' : '#E8F4F0' },
                      ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {stage === 'trigger' && (
            <>
              <Text style={styles.title}>What triggered this?</Text>
              <Text style={styles.subtitle}>Optional - helps us help you better</Text>

              <View style={styles.triggerList}>
                {commonTriggers.map((trigger) => (
                  <Pressable
                    key={trigger}
                    onPress={() => {
                      setSelectedTrigger(trigger);
                      if (trigger !== 'Other') {
                        setCustomTriggerText('');
                      }
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={[
                      styles.triggerOption,
                      {
                        backgroundColor: selectedTrigger === trigger ? '#40916C' : '#1A4D3C',
                        borderColor:
                          selectedTrigger === trigger
                            ? 'rgba(82, 183, 136, 0.5)'
                            : 'rgba(64, 145, 108, 0.2)',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.triggerLabel,
                        { color: selectedTrigger === trigger ? '#FFFFFF' : '#E8F4F0' },
                      ]}>
                      {trigger}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {selectedTrigger === 'Other' && (
                <View style={styles.customTriggerContainer}>
                  <Text style={styles.customTriggerLabel}>What specifically triggered it?</Text>
                  <TextInput
                    value={customTriggerText}
                    onChangeText={setCustomTriggerText}
                    placeholder="Type here (optional)..."
                    placeholderTextColor="#95B8A8"
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                    style={styles.customTriggerInput}
                    returnKeyType="done"
                    blurOnSubmit
                  />
                  <Text style={styles.characterCount}>{customTriggerText.length}/200</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleContinue}
            disabled={stage === 'feeling' && !postFeelingScore}
            style={({ pressed }) => [
              styles.continueButton,
              {
                backgroundColor:
                  stage === 'feeling' && !postFeelingScore
                    ? '#1A2E26'
                    : pressed
                      ? '#3A8360'
                      : '#40916C',
                opacity: stage === 'feeling' && !postFeelingScore ? 0.5 : 1,
              },
            ]}>
            <Text
              style={[
                styles.continueButtonText,
                { color: stage === 'feeling' && !postFeelingScore ? '#95B8A8' : '#FFFFFF' },
              ]}>
              {stage === 'feeling' ? 'Continue' : 'Done'}
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E8F4F0',
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E8F4F0',
    marginBottom: 8,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#95B8A8',
    marginBottom: 32,
    fontFamily: 'Poppins_400Regular',
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  triggerList: {
    gap: 12,
  },
  triggerOption: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  triggerLabel: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
  customTriggerContainer: {
    marginTop: 24,
  },
  customTriggerLabel: {
    fontSize: 14,
    color: '#95B8A8',
    marginBottom: 12,
    fontFamily: 'Poppins_400Regular',
  },
  customTriggerInput: {
    backgroundColor: '#1A4D3C',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#E8F4F0',
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: 'Poppins_400Regular',
  },
  characterCount: {
    marginTop: 8,
    textAlign: 'right',
    fontSize: 12,
    color: '#95B8A8',
    fontFamily: 'Poppins_400Regular',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  continueButton: {
    height: 62,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.3,
  },
});
