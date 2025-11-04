/**
 * Module Selection Screen
 * Shows all available help modules user can access
 * Inspired by Stoic's "Exercises from Therapists" approach
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { getEnabledModules, type Module } from '@/constants/modules';
import { useAnalytics } from '@/utils/analytics';

export default function ModulesScreen() {
  const [modules, setModules] = useState<Module[]>([]);
  const analytics = useAnalytics();

  useEffect(() => {
    // Load enabled modules
    const enabledModules = getEnabledModules();
    setModules(enabledModules);

    // Track screen view
    analytics.track('MODULES_SCREEN_VIEWED', {
      module_count: enabledModules.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModulePress = (module: Module) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Track module selection
    analytics.track('MODULE_SELECTED', {
      module_id: module.id,
      module_name: module.title,
      is_urgent: module.isUrgent || false,
      duration: module.estimatedDuration,
    });

    // Special case: "Stop Spiraling" goes directly to Spiral exercise
    // Skip method selection for immediate intervention
    if (module.id === 'stop-spiraling') {
      router.push({
        pathname: '/spiral' as any,
        params: {
          moduleId: module.id,
          moduleName: module.title,
          source: 'module-selection',
        },
      });
      return;
    }

    // Navigate to method selection for other modules
    router.push({
      pathname: `/modules/${module.id}/method` as any,
      params: {
        moduleId: module.id,
        moduleName: module.title,
      },
    });
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };


  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0A1612', '#0F1F1A', '#0A1612']}
        locations={[0, 0.5, 1]}
        style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: pressed
                    ? 'rgba(64, 145, 108, 0.25)'
                    : 'rgba(64, 145, 108, 0.15)',
                },
              ]}>
              <ArrowLeft size={20} color="#E8F4F0" strokeWidth={2.5} />
            </Pressable>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>How can we help?</Text>
              <Text style={styles.headerSubtitle}>Choose what you need right now</Text>
            </View>

            <View style={{ width: 44 }} />
          </View>

          {/* Module List */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.moduleGrid}>
              {modules.map((module) => (
                <Pressable
                  key={module.id}
                  onPress={() => handleModulePress(module)}
                  style={({ pressed }) => [
                    styles.moduleCard,
                    {
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}>
                  <LinearGradient
                    colors={['rgba(30, 60, 50, 0.95)', 'rgba(20, 45, 38, 0.95)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}>
                    <View style={styles.cardContent}>
                      <View
                        style={[
                          styles.moduleIconContainer,
                          { backgroundColor: module.color.background },
                        ]}>
                        <Text style={styles.moduleIcon}>{module.icon}</Text>
                      </View>
                      <View style={styles.moduleContent}>
                        <Text style={styles.moduleTitle}>{module.title}</Text>
                        <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
                        <View style={styles.durationBadge}>
                          <Text style={styles.moduleDuration}>{module.estimatedDuration}</Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>

            {/* Bottom Spacing */}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.3)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8F4F0',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#95B8A8',
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  moduleGrid: {
    gap: 20,
  },
  moduleCard: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  cardGradient: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 192, 0.2)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 28,
    gap: 24,
  },
  moduleIconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7dd3c0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'visible',
  },
  moduleIcon: {
    fontSize: 38,
    lineHeight: 42,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  moduleSubtitle: {
    fontSize: 15,
    color: '#B8D8CC',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 10,
    lineHeight: 22,
  },
  durationBadge: {
    backgroundColor: 'rgba(125, 211, 192, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 192, 0.25)',
  },
  moduleDuration: {
    fontSize: 13,
    color: '#7dd3c0',
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },
});
