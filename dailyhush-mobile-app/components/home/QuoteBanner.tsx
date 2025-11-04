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
      {quote.author && <Text style={styles.author}>— {quote.author}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: colors.lime[500], // Lime-500 for daily quote label
    marginBottom: 8,
    fontWeight: '600',
    opacity: 0.9,
    textAlign: 'right',
  },
  quoteText: {
    fontSize: 24,
    lineHeight: 34,
    color: colors.text.primary,
    fontStyle: 'italic',
    fontWeight: '300',
    letterSpacing: 0.4,
    opacity: 0.95,
    textAlign: 'right',
  },
  author: {
    marginTop: 12,
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
    opacity: 0.8,
    textAlign: 'right',
  },
});
