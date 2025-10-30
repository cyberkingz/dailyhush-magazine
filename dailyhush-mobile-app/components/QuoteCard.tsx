/**
 * DailyHush - QuoteCard Component
 * Displays daily mindful quote with elegant tropical styling
 */

import React from 'react';
import { View } from 'react-native';
import { Quote } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { PremiumCard } from './PremiumCard';
import { colors } from '@/constants/colors';
import { getQuoteOfTheDay } from '@/data/dailyQuotes';

export function QuoteCard() {
  const quote = getQuoteOfTheDay();

  const categoryLabels = {
    compassion: 'Self-Compassion',
    growth: 'Growth',
    presence: 'Presence',
    interrupt: 'Interrupt',
    wisdom: 'Wisdom',
  };

  const categoryColors = {
    compassion: colors.emerald[300],
    growth: colors.emerald[400],
    presence: colors.emerald[500],
    interrupt: colors.emerald[400],
    wisdom: colors.emerald[300],
  };

  return (
    <PremiumCard variant="elevated">
      <View style={{ flexDirection: 'row', gap: 12, padding: 20 }}>
        {/* Quote icon */}
        <View
          style={{
            backgroundColor: categoryColors[quote.category] + '33',
            padding: 12,
            borderRadius: 14,
            height: 48,
            width: 48,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
            shadowColor: categoryColors[quote.category],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}>
          <Quote size={22} color={categoryColors[quote.category]} strokeWidth={2.5} />
        </View>

        {/* Quote content */}
        <View style={{ flex: 1 }}>
          {/* Category badge */}
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: categoryColors[quote.category] + '1A',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              marginBottom: 12,
            }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: categoryColors[quote.category],
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
              {categoryLabels[quote.category]}
            </Text>
          </View>

          {/* Quote text */}
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              color: colors.text.primary,
              fontStyle: 'italic',
              fontWeight: '500',
              marginBottom: quote.author ? 12 : 0,
            }}>
            "{quote.text}"
          </Text>

          {/* Author (if present) */}
          {quote.author && (
            <Text
              style={{
                fontSize: 13,
                color: colors.text.secondary,
                fontWeight: '500',
              }}>
              — {quote.author}
            </Text>
          )}

          {/* Daily indicator */}
          <Text
            style={{
              fontSize: 11,
              color: colors.text.secondary,
              marginTop: 12,
              opacity: 0.7,
            }}>
            Daily wisdom • Refreshes tomorrow
          </Text>
        </View>
      </View>
    </PremiumCard>
  );
}
