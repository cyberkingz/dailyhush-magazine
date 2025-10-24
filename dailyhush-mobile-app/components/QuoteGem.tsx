/**
 * DailyHush - QuoteGem Component
 * Beautiful 3D gem display inspired by Opal app
 * Shows daily quote in an elegant, glowing orb
 */

import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Quote } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { getQuoteOfTheDay } from '@/data/dailyQuotes';

interface QuoteGemProps {
  onPress?: () => void;
}

export function QuoteGem({ onPress }: QuoteGemProps) {
  const quote = getQuoteOfTheDay();

  // Animations
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Pulsing glow effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Gentle rotation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const categoryColors = {
    compassion: colors.emerald[300],
    growth: colors.emerald[400],
    presence: colors.emerald[500],
    interrupt: colors.emerald[400],
    wisdom: colors.emerald[300],
  };

  const gemColor = categoryColors[quote.category];

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <View
      style={{
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}
    >
      {/* Hero Section with Gem */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Pressable onPress={handlePress} style={{ alignItems: 'center' }}>
          {/* Outer glow layers */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 280,
              height: 280,
              borderRadius: 140,
              opacity: glowOpacity,
            }}
          >
            <LinearGradient
              colors={[gemColor + '00', gemColor + '40', gemColor + '00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 140,
              }}
            />
          </Animated.View>

          {/* Middle glow */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: 110,
              opacity: 0.6,
              transform: [{ rotate: rotation }],
            }}
          >
            <LinearGradient
              colors={[gemColor + '60', gemColor + '30', gemColor + '60']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 110,
              }}
            />
          </Animated.View>

          {/* Main Gem */}
          <View
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              overflow: 'hidden',
              shadowColor: gemColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.6,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            {/* Gem gradient base */}
            <LinearGradient
              colors={[
                gemColor + 'E6', // 90% opacity
                gemColor + 'CC', // 80% opacity
                gemColor + 'B3', // 70% opacity
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Inner glass shine effect */}
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderTopLeftRadius: 90,
                  borderTopRightRadius: 90,
                }}
              />

              {/* Quote icon */}
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: 16,
                  borderRadius: 40,
                  borderWidth: 2,
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                }}
              >
                <Quote size={40} color={colors.white} strokeWidth={2.5} />
              </View>
            </LinearGradient>
          </View>

          {/* Pedestal/base */}
          <View
            style={{
              width: 60,
              height: 12,
              backgroundColor: colors.background.tertiary,
              borderRadius: 30,
              marginTop: -6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 4,
            }}
          />
        </Pressable>
      </View>

      {/* Quote Text */}
      <View
        style={{
          backgroundColor: colors.background.secondary + 'CC',
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: gemColor + '40',
          shadowColor: gemColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            lineHeight: 26,
            color: colors.text.primary,
            textAlign: 'center',
            fontStyle: 'italic',
            fontWeight: '500',
          }}
        >
          "{quote.text}"
        </Text>

        {quote.author && (
          <Text
            style={{
              fontSize: 14,
              color: colors.text.secondary,
              textAlign: 'center',
              marginTop: 12,
              fontWeight: '500',
            }}
          >
            — {quote.author}
          </Text>
        )}

        {/* Category badge */}
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: gemColor + '20',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            marginTop: 16,
            borderWidth: 1,
            borderColor: gemColor + '40',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: gemColor,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Daily Wisdom
          </Text>
        </View>
      </View>
    </View>
  );
}
