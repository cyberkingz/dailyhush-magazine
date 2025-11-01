/**
 * LoopTypeHero Component
 *
 * Main identity card showing user's loop type with gradient background
 */

import React from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import { Share2, Moon, RefreshCw, MessageCircle, Sparkles } from 'lucide-react-native';
import { MotiView } from 'moti';
import type { LoopType, LoopTypeIcon } from '@/constants/loopTypes';
import { getLoopTypeConfig } from '@/constants/loopTypes';
import { profileTypography } from '@/constants/profileTypography';
import { loopTypeHeroStyles } from '@/constants/profileComponents';
import { fadeAnimations } from '@/constants/profileAnimations';
import { colors } from '@/constants/colors';

// Icon mapping for loop types
const LOOP_ICONS: Record<LoopTypeIcon, React.ComponentType<any>> = {
  Moon,
  GitBranch: RefreshCw, // Circular arrow represents the looping/cycling through decisions
  MessageCircle,
  Sparkles,
};

interface LoopTypeHeroProps {
  loopType: LoopType;
  userName?: string;
}

export function LoopTypeHero({ loopType, userName }: LoopTypeHeroProps) {
  const config = getLoopTypeConfig(loopType);
  const IconComponent = LOOP_ICONS[config.iconName];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I'm navigating the ${config.name}. ${config.tagline}`,
        title: `My Loop Type: ${config.name}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <MotiView
      from={fadeAnimations.fadeInUp.from}
      animate={fadeAnimations.fadeInUp.to}
      transition={{ type: 'timing', duration: 600 }}
      style={loopTypeHeroStyles.container}
    >

      {/* Share button */}
      <TouchableOpacity
        style={loopTypeHeroStyles.shareButton}
        onPress={handleShare}
        activeOpacity={0.7}
        accessibilityLabel="Share your loop type"
        accessibilityRole="button"
      >
        <Share2 size={20} color={colors.text.primary} strokeWidth={2} />
      </TouchableOpacity>

      {/* Content */}
      <View style={loopTypeHeroStyles.content}>
        {/* Greeting */}
        {userName && (
          <Text
            style={[
              profileTypography.hero.greeting,
              { color: colors.text.secondary, marginBottom: 16 },
            ]}
          >
            Good {getTimeOfDay()}, {userName}
          </Text>
        )}

        {/* Icon */}
        <View style={loopTypeHeroStyles.iconContainer}>
          <IconComponent size={32} color={colors.emerald[600]} strokeWidth={2} />
        </View>

        {/* Loop type name */}
        <Text
          style={[
            profileTypography.hero.loopTitle,
            { color: colors.text.primary, marginBottom: 12 },
          ]}
        >
          {config.name}
        </Text>

        {/* Tagline */}
        <Text
          style={[
            profileTypography.hero.description,
            { color: colors.text.secondary },
          ]}
        >
          {config.tagline}
        </Text>
      </View>
    </MotiView>
  );
}

/**
 * Helper to get time-based greeting
 */
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
