/**
 * Method Selection Screen
 * Shows available methods (Talk to Anna, Quick Exercise, etc.) for a selected module
 * Dynamic route: /modules/[moduleId]/method
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
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { getModule, type Module, type ModuleId } from '@/constants/modules';
import { getMethodsForModule, type Method } from '@/constants/methods';
import { useAnalytics } from '@/utils/analytics';
import { Clock } from 'lucide-react-native';

export default function MethodSelectionScreen() {
  const params = useLocalSearchParams<{ moduleId: string; moduleName?: string }>();
  const moduleId = params.moduleId as ModuleId;
  const moduleName = params.moduleName;

  const [module, setModule] = useState<Module | null>(null);
  const [methods, setMethods] = useState<Method[]>([]);
  const analytics = useAnalytics();

  useEffect(() => {
    if (!moduleId) {
      console.error('[MethodSelection] Missing moduleId');
      router.back();
      return;
    }

    // Load module and methods
    const moduleData = getModule(moduleId);
    if (!moduleData) {
      console.error('[MethodSelection] Invalid moduleId:', moduleId);
      router.back();
      return;
    }

    setModule(moduleData);
    // Get methods and filter out "talk-to-anna"
    const moduleMethods = getMethodsForModule(moduleId).filter(
      (method) => method.id !== 'talk-to-anna'
    );
    setMethods(moduleMethods);

    // Track screen view
    analytics.track('METHOD_SELECTION_VIEWED', {
      module_id: moduleId,
      module_name: moduleData.title,
      available_methods: moduleMethods.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  const handleMethodPress = (method: Method) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Track method selection
    analytics.track('METHOD_SELECTED', {
      module_id: moduleId,
      module_name: module?.title,
      method_id: method.id,
      method_title: method.title,
      duration: method.duration,
      is_recommended: method.isRecommended || false,
    });

    // Navigate to the method's route with params
    router.push({
      pathname: method.route as any,
      params: {
        ...method.params,
        moduleId: moduleId,
        moduleName: moduleName || module?.title,
        source: 'module-selection',
      },
    });
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  if (!module) return null;

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
              <Text style={styles.headerTitle}>{module.title}</Text>
              <Text style={styles.headerSubtitle}>Choose your approach</Text>
            </View>

            <View style={{ width: 44 }} />
          </View>

          {/* Method List */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Module Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{module.description}</Text>
            </View>

            <View style={styles.methodList}>
              {methods.map((method) => (
                <Pressable
                  key={method.id}
                  onPress={() => handleMethodPress(method)}
                  style={({ pressed }) => [
                    styles.methodCard,
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
                      <View style={styles.methodIconContainer}>
                        <Text style={styles.methodIcon}>{method.icon}</Text>
                      </View>
                      <View style={styles.methodContent}>
                        <Text style={styles.methodTitle}>{method.title}</Text>
                        <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                        <View style={styles.durationBadge}>
                          <Clock size={13} color="#7dd3c0" strokeWidth={2.5} />
                          <Text style={styles.durationText}>{method.duration}</Text>
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
    paddingTop: 16,
  },
  descriptionContainer: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  description: {
    fontSize: 15,
    color: '#C5DDD3',
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
    textAlign: 'center',
  },
  methodList: {
    gap: 20,
  },
  methodCard: {
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
  methodIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(125, 211, 192, 0.15)',
    shadowColor: '#7dd3c0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 192, 0.25)',
    overflow: 'visible',
  },
  methodIcon: {
    fontSize: 36,
    lineHeight: 40,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  methodSubtitle: {
    fontSize: 15,
    color: '#B8D8CC',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 10,
    lineHeight: 22,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(125, 211, 192, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 192, 0.25)',
  },
  durationText: {
    fontSize: 13,
    color: '#7dd3c0',
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },
});
