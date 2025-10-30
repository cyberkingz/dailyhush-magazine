/**
 * MoodCard Component
 * Reusable mood logging card with state management
 */

import { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Smile } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { PillButton } from '@/components/ui/pill-button';

interface MoodCardProps {
  isLogged: boolean;
  onLogMood: () => void;
  heading?: string;
  description?: string;
  buttonText?: string;
  loggedMessage?: string;
  loggedSubtext?: string;
}

export function MoodCard({
  isLogged,
  onLogMood,
  heading = 'How are you feeling today?',
  description = 'Feeling calm and centered. Tap to log your mood.',
  buttonText = 'Log Mood',
  loggedMessage = '✨ Mood logged!',
  loggedSubtext = "You're tracking your emotional patterns",
}: MoodCardProps) {
  const [isVisible, setIsVisible] = useState(!isLogged);
  const fadeAnim = useRef(new Animated.Value(isLogged ? 0 : 1)).current;
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLogMood();
  };

  useEffect(() => {
    fadeAnim.stopAnimation();

    if (!isLogged) {
      if (fadeTimeout.current) {
        clearTimeout(fadeTimeout.current);
        fadeTimeout.current = null;
      }
      setIsVisible(true);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      if (fadeTimeout.current) {
        clearTimeout(fadeTimeout.current);
      }

      fadeTimeout.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 360,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setIsVisible(false);
          }
        });
      }, 1800);
    }

    return () => {
      if (fadeTimeout.current) {
        clearTimeout(fadeTimeout.current);
        fadeTimeout.current = null;
      }
    };
  }, [isLogged, fadeAnim]);

  if (!isVisible && isLogged) {
    return null;
  }

  const translateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  const scale = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  return (
    <Animated.View
      style={[
        {
          paddingHorizontal: 20,
          marginBottom: isLogged ? 24 : 64,
        },
        {
          opacity: fadeAnim,
          transform: [{ translateY }, { scale }],
        },
      ]}>
      <View style={{ position: 'relative', width: '100%' }}>
        <View
          style={{
            backgroundColor: colors.background.card,
            borderRadius: 24,
            paddingTop: 28,
            paddingHorizontal: 28,
            paddingBottom: !isLogged ? 64 : 28,
            borderWidth: 1,
            borderColor: colors.emerald[600] + '20',
          }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
              color: colors.text.primary,
              marginBottom: 28,
              textAlign: 'center',
            }}>
            {heading}
          </Text>

          {!isLogged ? (
            <>
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 24,
                }}>
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: colors.emerald[500] + '30',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Smile size={56} color={colors.emerald[500]} strokeWidth={2} />
                </View>
              </View>

              <Text
                style={{
                  fontSize: 15,
                  color: colors.text.secondary,
                  textAlign: 'center',
                  marginBottom: 24,
                  opacity: 0.8,
                  lineHeight: 22,
                }}>
                {description}
              </Text>
            </>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.emerald[400],
                  textAlign: 'center',
                  marginBottom: 12,
                }}>
                {loggedMessage}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text.secondary,
                  textAlign: 'center',
                  opacity: 0.7,
                }}>
                {loggedSubtext}
              </Text>
            </View>
          )}
        </View>
        {!isLogged && (
          <PillButton
            label={buttonText}
            onPress={handlePress}
            style={{
              position: 'absolute',
              bottom: -16,
              alignSelf: 'center',
              width: 'auto',
            }}
          />
        )}
      </View>
    </Animated.View>
  );
}
