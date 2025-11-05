/**
 * DailyHush - InteractiveStepInput Usage Examples
 * Demonstrates all three input types in action
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { InteractiveStepInput } from './InteractiveStepInput';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

/**
 * Example: Using InteractiveStepInput in a protocol screen
 */
export function InteractiveStepInputExamples() {
  // Example 1: Text input
  const [thoughtText, setThoughtText] = useState('');

  // Example 2: List input
  const [seeingList, setSeeingList] = useState('');

  // Example 3: Count input
  const [breathCount, setBreathCount] = useState('');

  const handleSubmit = () => {
    console.log('User submitted response');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Interactive Step Input Examples</Text>

        {/* Example 1: Single-line Text Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Text Input (Single Line)</Text>
          <InteractiveStepInput
            config={{
              type: 'text',
              prompt: "What's the thought that's looping?",
              placeholder: 'Type your thought here...',
              maxLength: 100,
            }}
            value={thoughtText}
            onChangeText={setThoughtText}
            onSubmit={handleSubmit}
            autoFocus={false}
            testID="thought-input"
          />
          <Text style={styles.valueDisplay}>
            Current value: {thoughtText || '(empty)'}
          </Text>
        </View>

        {/* Example 2: Multi-line List Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. List Input (Multi-line)</Text>
          <InteractiveStepInput
            config={{
              type: 'list',
              prompt: 'Name 5 things you can see',
              placeholder: '1. The lamp\n2. My coffee mug\n3. The window\n4. My phone\n5. ',
              maxLength: 200,
            }}
            value={seeingList}
            onChangeText={setSeeingList}
            onSubmit={handleSubmit}
            autoFocus={false}
            testID="seeing-list-input"
          />
          <Text style={styles.valueDisplay}>
            Current value: {seeingList || '(empty)'}
          </Text>
        </View>

        {/* Example 3: Numeric Count Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Count Input (Numbers Only)</Text>
          <InteractiveStepInput
            config={{
              type: 'count',
              prompt: 'How many breaths do you need?',
              placeholder: '0',
              maxLength: 3,
            }}
            value={breathCount}
            onChangeText={setBreathCount}
            onSubmit={handleSubmit}
            autoFocus={false}
            testID="breath-count-input"
          />
          <Text style={styles.valueDisplay}>
            Current value: {breathCount || '(empty)'}
          </Text>
        </View>

        {/* Example 4: Auto-focused Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Auto-focused Input</Text>
          <Text style={styles.description}>
            (This input will auto-focus when the screen loads)
          </Text>
          <InteractiveStepInput
            config={{
              type: 'text',
              prompt: 'Rate your current anxiety (1-10)',
              placeholder: 'Enter a number...',
              maxLength: 2,
            }}
            value=""
            onChangeText={() => {}}
            onSubmit={handleSubmit}
            autoFocus={true}
            testID="auto-focus-input"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  content: {
    padding: spacing.xl,
  },

  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },

  section: {
    marginBottom: spacing['3xl'],
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.lime[500],
    marginBottom: spacing.md,
  },

  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },

  valueDisplay: {
    fontSize: 14,
    color: colors.text.muted,
    marginTop: spacing.sm,
    fontFamily: 'monospace',
  },
});

/**
 * Example: Integrating into a Protocol Step
 */
export function ProtocolStepWithInput() {
  const [response, setResponse] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const interactiveSteps = [
    {
      type: 'text' as const,
      prompt: "What's triggering this anxiety?",
      placeholder: 'Describe briefly...',
      maxLength: 150,
    },
    {
      type: 'list' as const,
      prompt: 'List 5 things grounding you right now',
      placeholder: '1. \n2. \n3. \n4. \n5. ',
      maxLength: 300,
    },
    {
      type: 'count' as const,
      prompt: 'How many deep breaths have helped?',
      placeholder: '0',
      maxLength: 2,
    },
  ];

  const handleContinue = () => {
    console.log('User response:', response);
    if (currentStep < interactiveSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setResponse('');
    } else {
      console.log('Protocol complete!');
    }
  };

  return (
    <View style={protocolStyles.container}>
      <Text style={protocolStyles.stepIndicator}>
        Step {currentStep + 1} of {interactiveSteps.length}
      </Text>

      <InteractiveStepInput
        config={interactiveSteps[currentStep]}
        value={response}
        onChangeText={setResponse}
        onSubmit={handleContinue}
        autoFocus={true}
        testID={`protocol-step-${currentStep}`}
      />
    </View>
  );
}

const protocolStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.xl,
  },

  stepIndicator: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
});
