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

export function FeatureGrid({ features }: FeatureGridProps) {
  const [isQuoteRevealed, setIsQuoteRevealed] = useState(false);

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

  // Animate quote reveal with magical timing
  useEffect(() => {
    if (isQuoteRevealed) {
      // Icon gently shrinks and fades
      iconScale.value = withTiming(0, {
        duration: 400,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1)
      });

      // Quote scales up and fades in with gentle spring
      quoteScale.value = withDelay(
        200,
        withSpring(1, {
          damping: 20,
          stiffness: 90,
          mass: 0.8
        })
      );
      quoteOpacity.value = withDelay(
        200,
        withTiming(1, {
          duration: 600,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1)
        })
      );
    } else {
      // Reset animations gently
      quoteScale.value = withTiming(0, {
        duration: 400,
        easing: Easing.bezier(0.4, 0.0, 1, 1)
      });
      quoteOpacity.value = withTiming(0, {
        duration: 400,
        easing: Easing.bezier(0.4, 0.0, 1, 1)
      });
      iconScale.value = withDelay(
        300,
        withSpring(1, {
          damping: 18,
          stiffness: 90,
          mass: 0.8
        })
      );
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
