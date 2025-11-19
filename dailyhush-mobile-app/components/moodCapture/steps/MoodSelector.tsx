/**
 * Nœma - Step 1: Mood Selector
 *
 * Clean vertical card list with calming micro-interactions.
 * Staggered entrance, ripple effects, emoji bounce, and smooth selection.
 */

import React, { useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MOOD_OPTIONS, type MoodOption } from '@/constants/moodOptions';
import { colors } from '@/constants/colors';
import type { Enums } from '@/types/supabase';

// ============================================================================
// TYPES
// ============================================================================

interface MoodSelectorProps {
  selectedMood?: Enums<'mood_type'>;
  onMoodSelect: (mood: MoodOption) => void;
  autoAdvance?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function MoodSelector({
  selectedMood,
  onMoodSelect,
  autoAdvance = true,
}: MoodSelectorProps) {
  const handleMoodSelect = async (mood: MoodOption) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onMoodSelect(mood);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>How are you feeling today?</Text>
      </View>

      {/* Mood Cards */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}>
        {MOOD_OPTIONS.map((mood, index) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onPress={() => handleMoodSelect(mood)}
            delay={index * 100}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ============================================================================
// MOOD CARD
// ============================================================================

interface MoodCardProps {
  mood: MoodOption;
  isSelected: boolean;
  onPress: () => void;
  delay?: number;
}

function MoodCard({ mood, isSelected, onPress, delay = 0 }: MoodCardProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const emojiScale = useRef(new Animated.Value(1)).current;
  const emojiRotate = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  // Entrance animation - fade in and slide from left
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  // Selection animation
  React.useEffect(() => {
    if (isSelected) {
      Animated.spring(checkmarkScale, {
        toValue: 1,
        tension: 180,
        friction: 12,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(checkmarkScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected]);

  const handlePressIn = () => {
    // Scale down card
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();

    // Glow effect
    Animated.timing(glowOpacity, {
      toValue: 0.1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    // Scale back
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Fade glow
    Animated.timing(glowOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    // Emoji bounce and rotate
    Animated.parallel([
      Animated.sequence([
        Animated.timing(emojiScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(emojiScale, {
          toValue: 1,
          tension: 100,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(emojiRotate, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emojiRotate, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(emojiRotate, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Text slide
    Animated.sequence([
      Animated.timing(textSlide, {
        toValue: 4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(textSlide, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Ripple effect
    rippleScale.setValue(0);
    rippleOpacity.setValue(0.5);
    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 2,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
        },
      ]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardTouchable}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${mood.label}. ${mood.description}`}>
        {/* Background glow */}
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Ripple effect */}
        <Animated.View
          style={[
            styles.ripple,
            {
              opacity: rippleOpacity,
              transform: [{ scale: rippleScale }],
            },
          ]}
        />

        {/* Card content */}
        <View style={styles.card}>
          {/* Emoji */}
          <Animated.View
            style={[
              styles.emojiContainer,
              {
                transform: [
                  { scale: emojiScale },
                  {
                    rotate: emojiRotate.interpolate({
                      inputRange: [-10, 10],
                      outputRange: ['-10deg', '10deg'],
                    }),
                  },
                ],
              },
            ]}>
            <Text style={styles.emoji}>{mood.emoji}</Text>
          </Animated.View>

          {/* Text content */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                transform: [{ translateX: textSlide }],
              },
            ]}>
            <Text style={styles.label}>{mood.label}</Text>
            <Text style={styles.description}>{mood.description}</Text>
          </Animated.View>

          {/* Checkmark */}
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                opacity: checkmarkScale,
                transform: [{ scale: checkmarkScale }],
              },
            ]}>
            <Text style={styles.checkmark}>✓</Text>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    letterSpacing: -0.3,
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  cardTouchable: {
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(125, 211, 192, 0.1)',
    borderRadius: 24,
    opacity: 0,
  },
  ripple: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    marginTop: -50,
    marginLeft: -50,
    backgroundColor: 'rgba(125, 211, 192, 0.2)',
    borderRadius: 50,
    opacity: 0,
  },
  card: {
    backgroundColor: '#0d2820',
    borderWidth: 1,
    borderColor: 'rgba(26, 58, 48, 0.4)',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    marginRight: 16,
  },
  emoji: {
    fontSize: 48,
    lineHeight: 56,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    color: colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.text.secondary,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7dd3c0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a1f1a',
    lineHeight: 16,
  },
});
