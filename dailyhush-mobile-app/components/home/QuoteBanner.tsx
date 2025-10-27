/**
 * QuoteBanner Component
 * Elegant daily quote typography for the home header
 */

import { StyleProp, View, ViewStyle, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';
import { getQuoteOfTheDay } from '@/data/dailyQuotes';

interface QuoteBannerProps {
  style?: StyleProp<ViewStyle>;
}

export function QuoteBanner({ style }: QuoteBannerProps) {
  const quote = getQuoteOfTheDay();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Daily Quote</Text>
      <Text style={styles.quoteText}>“{quote.text}”</Text>
      {quote.author && (
        <Text style={styles.author}>— {quote.author}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.emerald[300],
    marginBottom: 4,
    fontWeight: '600',
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 26,
    color: colors.text.primary,
    fontStyle: 'italic',
    fontWeight: '300',
    letterSpacing: 0.3,
  },
  author: {
    marginTop: 6,
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
    opacity: 0.75,
  },
});
