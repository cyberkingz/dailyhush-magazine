/**
 * DailyHush - Privacy Policy Screen
 * Displays the full privacy policy in a scrollable view
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Pressable } from 'react-native';
import { Text } from '@/components/ui/text';

export default function PrivacyPolicyScreen() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrivacyPolicy();
  }, []);

  const loadPrivacyPolicy = async () => {
    try {
      // In production, you might fetch this from a server
      // For now, we'll use the local markdown file
      const content = await fetch(
        require('@/legal/PRIVACY_POLICY.md')
      ).then(res => res.text());

      setMarkdownContent(content);
    } catch (error) {
      console.error('Failed to load privacy policy:', error);
      setMarkdownContent('# Privacy Policy\n\nFailed to load privacy policy. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Privacy Policy',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={24} color={colors.text.primary} strokeWidth={2} />
            </Pressable>
          ),
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.emerald[500]} />
          <Text style={styles.loadingText}>Loading Privacy Policy...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <Markdown style={markdownStyles}>
            {markdownContent}
          </Markdown>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    marginLeft: 8,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});

// Markdown styling to match DailyHush theme
const markdownStyles = {
  body: {
    color: colors.text.primary,
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '700' as const,
    marginTop: 24,
    marginBottom: 16,
  },
  heading2: {
    color: colors.emerald[500],
    fontSize: 24,
    fontWeight: '600' as const,
    marginTop: 20,
    marginBottom: 12,
  },
  heading3: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '600' as const,
    marginTop: 16,
    marginBottom: 10,
  },
  heading4: {
    color: colors.text.secondary,
    fontSize: 18,
    fontWeight: '600' as const,
    marginTop: 14,
    marginBottom: 8,
  },
  paragraph: {
    color: colors.text.primary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  strong: {
    color: colors.emerald[400],
    fontWeight: '700' as const,
  },
  em: {
    color: colors.text.secondary,
    fontStyle: 'italic' as const,
  },
  link: {
    color: colors.emerald[500],
    textDecorationLine: 'underline' as const,
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  list_item: {
    color: colors.text.primary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
  },
  code_inline: {
    backgroundColor: colors.background.tertiary,
    color: colors.emerald[400],
    fontFamily: 'monospace',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: colors.background.tertiary,
    color: colors.text.primary,
    fontFamily: 'monospace',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  blockquote: {
    backgroundColor: colors.background.secondary,
    borderLeftColor: colors.emerald[600],
    borderLeftWidth: 4,
    paddingLeft: 16,
    paddingVertical: 12,
    marginVertical: 12,
  },
  hr: {
    backgroundColor: colors.background.border,
    height: 1,
    marginVertical: 20,
  },
};
