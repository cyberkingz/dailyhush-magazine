/**
 * Nœma - QuoteGem Component
 * Minimalist beautiful quote display
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { getQuoteOfTheDay } from '@/data/dailyQuotes';

export function QuoteGem() {
  const quote = getQuoteOfTheDay();

  return (
    <View
      style={{
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 32,
      }}>
      {/* Quote Text */}
      <Text
        style={{
          fontSize: 22,
          lineHeight: 36,
          color: colors.text.primary,
          textAlign: 'center',
          fontStyle: 'italic',
          fontWeight: '400',
          letterSpacing: 0.3,
        }}>
        "{quote.text}"
      </Text>

      {/* Author */}
      {quote.author && (
        <Text
          style={{
            fontSize: 15,
            color: colors.text.secondary,
            textAlign: 'center',
            marginTop: 16,
            fontWeight: '500',
            opacity: 0.8,
          }}>
          — {quote.author}
        </Text>
      )}
    </View>
  );
}
