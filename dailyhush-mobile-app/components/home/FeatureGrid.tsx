/**
 * FeatureGrid Component
 * 2x2 grid layout for feature cards
 */

import { useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { FeatureCard } from './FeatureCard';
import { Text } from '@/components/ui/text';
import { LucideIcon, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackgroundColor: string;
  onPress?: () => void;
  isInteractive?: boolean;
}

interface FeatureGridProps {
  features: FeatureItem[];
}

// Sparkle particle component
function SparkleParticle({ delay, x, y }: { delay: number; x: number; y: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(200, withTiming(0, { duration: 400 }))
      )
    );
    translateY.value = withDelay(
      delay,
      withTiming(-30, { duration: 900, easing: Easing.out(Easing.ease) })
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1, { damping: 8, stiffness: 100 }),
        withDelay(200, withTiming(0, { duration: 400 }))
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
        },
        animatedStyle,
      ]}>
      <Sparkles size={12} color={colors.lime[400]} />
    </Animated.View>
  );
}

export function FeatureGrid({ features }: FeatureGridProps) {
  const [isQuoteRevealed, setIsQuoteRevealed] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  // Animation values
  const quoteScale = useSharedValue(0);
  const quoteOpacity = useSharedValue(0);
  const iconScale = useSharedValue(1);

  // Split features into two rows
  const firstRow = features.slice(0, 2);
  const secondRow = features.slice(2, 4);

  const rowStyle = {
    flexDirection: 'row' as const,
    gap: 12,
    height: 160,
  };

  // Animate quote reveal
  useEffect(() => {
    if (isQuoteRevealed) {
      // Sparkle burst effect
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1000);

      // Icon shrinks and fades
      iconScale.value = withTiming(0, { duration: 200 });

      // Quote scales up and fades in
      quoteScale.value = withDelay(
        100,
        withSpring(1, {
          damping: 12,
          stiffness: 100,
        })
      );
      quoteOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
    } else {
      // Reset animations
      quoteScale.value = withTiming(0, { duration: 200 });
      quoteOpacity.value = withTiming(0, { duration: 200 });
      iconScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 100 }));
    }
  }, [isQuoteRevealed]);

  const quoteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
    transform: [{ scale: quoteScale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconScale.value,
    transform: [{ scale: iconScale.value }],
  }));

  // Sparkle positions (scattered around the card)
  const sparklePositions = [
    { x: 20, y: 30, delay: 0 },
    { x: 100, y: 20, delay: 50 },
    { x: 60, y: 50, delay: 100 },
    { x: 120, y: 70, delay: 150 },
    { x: 30, y: 100, delay: 80 },
    { x: 140, y: 40, delay: 120 },
  ];

  return (
    <View style={{ paddingHorizontal: 20 }}>
      {/* First Row */}
      <View
        style={{
          ...rowStyle,
          marginBottom: 12,
        }}>
        {firstRow.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            iconColor={feature.iconColor}
            iconBackgroundColor={feature.iconBackgroundColor}
            onPress={feature.onPress}
            isInteractive={feature.isInteractive}
          />
        ))}
      </View>

      {/* Second Row */}
      <View style={rowStyle}>
        {secondRow.map((feature) => {
          // Render "Did you know?" as a surprise card with animation
          if (feature.id === 'did-you-know') {
            return (
              <Pressable
                key={feature.id}
                onPress={async () => {
                  await Haptics.impactAsync(
                    isQuoteRevealed
                      ? Haptics.ImpactFeedbackStyle.Light
                      : Haptics.ImpactFeedbackStyle.Medium
                  );
                  setIsQuoteRevealed(!isQuoteRevealed);
                }}
                style={{
                  flex: 1,
                  flexShrink: 0,
                  height: '100%',
                  backgroundColor: colors.background.card,
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1.5,
                  borderColor: colors.lime[600] + '30',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}>
                {/* Sparkle particles */}
                {showSparkles &&
                  sparklePositions.map((pos, index) => (
                    <SparkleParticle key={index} delay={pos.delay} x={pos.x} y={pos.y} />
                  ))}

                {/* Unrevealed state - tap to reveal */}
                <Animated.View
                  style={[
                    {
                      position: 'absolute',
                      alignItems: 'center',
                    },
                    iconAnimatedStyle,
                  ]}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: feature.iconBackgroundColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}>
                    <Sparkles size={28} color={feature.iconColor} />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.text.primary,
                      textAlign: 'center',
                      marginBottom: 4,
                    }}>
                    {feature.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.text.secondary,
                      textAlign: 'center',
                      opacity: 0.7,
                    }}>
                    Tap to reveal
                  </Text>
                </Animated.View>

                {/* Revealed state - show quote */}
                <Animated.View
                  style={[
                    {
                      position: 'absolute',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                    },
                    quoteAnimatedStyle,
                  ]}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontStyle: 'italic',
                      color: colors.text.secondary,
                      textAlign: 'center',
                      lineHeight: 22,
                      marginBottom: 12,
                    }}>
                    "{feature.description}"
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.lime[400],
                      textAlign: 'center',
                      opacity: 0.6,
                    }}>
                    Tap to hide
                  </Text>
                </Animated.View>
              </Pressable>
            );
          }

          return (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              iconColor={feature.iconColor}
              iconBackgroundColor={feature.iconBackgroundColor}
              onPress={feature.onPress}
              isInteractive={feature.isInteractive}
            />
          );
        })}
      </View>
    </View>
  );
}
