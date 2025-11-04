/**
 * ProductCard Component
 *
 * Displays a product with image, name, price, and CTA
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { ShoppingBag } from 'lucide-react-native';
import type { Tables } from '@/types/supabase';
import { profileTypography } from '@/constants/profileTypography';
import { colors } from '@/constants/colors';

interface ProductCardProps {
  product: Tables<'products'>;
  onPress: () => void;
  index?: number;
}

export function ProductCard({ product, onPress, index = 0 }: ProductCardProps) {
  const priceInDollars = (product.price_cents / 100).toFixed(2);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 400,
        delay: index * 100,
      }}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.9}
        accessibilityLabel={`${product.name}, $${priceInDollars}`}
        accessibilityRole="button">
        {/* Product image */}
        {product.thumbnail_url ? (
          <Image source={{ uri: product.thumbnail_url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <ShoppingBag size={32} color={colors.lime[500]} />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Product name */}
          <Text
            style={[profileTypography.products.name, { color: colors.text.primary }]}
            numberOfLines={2}>
            {product.name}
          </Text>

          {/* Short description */}
          {product.short_description && (
            <Text
              style={[profileTypography.products.description, { color: colors.text.secondary }]}
              numberOfLines={2}>
              {product.short_description}
            </Text>
          )}

          {/* Price and CTA */}
          <View style={styles.footer}>
            <Text style={[profileTypography.products.price, { color: colors.lime[500] }]}>
              ${priceInDollars}
            </Text>
            <View style={styles.ctaButton}>
              <Text style={[profileTypography.buttons.small, { color: colors.lime[500] }]}>
                View
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.background.tertiary,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  ctaButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: `${colors.lime[500]}15`,
    borderRadius: 8,
  },
});
