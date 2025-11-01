# Priority Fix Plan - Modular Trial System

**Based on:** DEEP_AUDIT_REPORT.md
**Status:** ⚠️ Not Production Ready
**Estimated Fix Time:** 18-26 hours

---

## Phase 1: Critical Fixes (6 hours) - MUST DO BEFORE PRODUCTION

### 1.1 Accessibility Labels (2 hours)
**Priority:** 🔴 CRITICAL

Add to **PaywallButton.tsx**:
```typescript
<Pressable
  onPress={onPress}
  disabled={isDisabled}
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={title}
  accessibilityHint={subtitle}
  accessibilityState={{ disabled: isDisabled, busy: isLoading }}
  style={{...}}>
```

Add to **SubscriptionOption.tsx**:
```typescript
<Pressable
  onPress={() => onSelect(plan.id)}
  accessible={true}
  accessibilityRole="radio"
  accessibilityLabel={`${plan.title} plan, ${plan.price} ${plan.period}`}
  accessibilityHint={plan.description}
  accessibilityState={{ checked: isSelected }}
  style={{...}}>
```

Add to **PaywallCloseButton.tsx**:
```typescript
<Pressable
  onPress={onClose}
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Close"
  style={{...}}>
```

Add to **FeaturesList.tsx** (each feature item):
```typescript
<View
  key={feature}
  accessible={true}
  accessibilityRole="text"
  style={{...}}>
```

### 1.2 Fix PaywallHeader Fragment (30 min)
**Priority:** 🔴 CRITICAL

**File:** `components/paywall/PaywallHeader.tsx`

**Change from:**
```typescript
export function PaywallHeader({ icon: Icon, title, subtitle, emoji }: PaywallHeaderProps) {
  return (
    <>
      {/* Icon */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
```

**Change to:**
```typescript
export function PaywallHeader({ icon: Icon, title, subtitle, emoji }: PaywallHeaderProps) {
  return (
    <View>
      {/* Icon */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
```

### 1.3 Fix Array Index Keys (15 min)
**Priority:** 🔴 CRITICAL

**File:** `components/paywall/FeaturesList.tsx:46`

**Change from:**
```typescript
{features.map((feature, index) => (
  <View key={index} style={{...}}>
```

**Change to:**
```typescript
{features.map((feature) => (
  <View key={feature} style={{...}}>
```

### 1.4 Add Null Checks for Loop Types (30 min)
**Priority:** 🔴 CRITICAL

**File:** `components/LoopSpecificPaywall.tsx`

**Add before using config:**
```typescript
export function LoopSpecificPaywall({ loopType, ... }: LoopSpecificPaywallProps) {
  const config = LOOP_PAYWALL_CONFIG[loopType];

  if (!config) {
    console.error(`Invalid loop type: ${loopType}`);
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <Text>Unable to load paywall. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      {/* rest of component */}
    </View>
  );
}
```

### 1.5 Prepare for Internationalization (2 hours)
**Priority:** 🔴 CRITICAL (for global launch)

**Step 1:** Install i18n library
```bash
npm install i18next react-i18next
```

**Step 2:** Create i18n config file `/i18n/config.ts`:
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          paywall: {
            button: {
              loading: 'Loading...',
              startTrial: 'Try FREE for 7 Days',
              subscribe: 'Subscribe to Premium',
            },
            features: {
              premium: [
                'Personalized loop-breaking exercises',
                'Advanced rumination interrupt techniques',
                // ... etc
              ],
            },
          },
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

**Step 3:** Extract currency formatting:
```typescript
// utils/currency.ts
export function formatCurrency(amount: number, locale: string = 'en-US', currency: string = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

// constants/subscription.ts
import { formatCurrency } from '@/utils/currency';

export const SUBSCRIPTION_PRICING = {
  monthly: {
    id: 'monthly',
    title: 'Monthly',
    priceValue: 9.99,
    currency: 'USD',
    get price() {
      return formatCurrency(this.priceValue, 'en-US', this.currency);
    },
    period: '/month',
    description: 'Perfect for trying Premium',
  },
  // ... etc
};
```

### 1.6 Add Test IDs (1 hour)
**Priority:** 🔴 CRITICAL (for E2E testing)

Add to **all interactive components**:
```typescript
// PaywallButton
<Pressable
  testID={`paywall-button-${title.toLowerCase().replace(/\s+/g, '-')}`}
  ...>

// SubscriptionOption
<Pressable
  testID={`subscription-option-${plan.id}`}
  ...>

// PaywallCloseButton
<Pressable
  testID="paywall-close-button"
  ...>
```

---

## Phase 2: Major Fixes (8 hours) - SHOULD DO SOON

### 2.1 Fix Type Mismatch (15 min)
**Priority:** 🟡 MAJOR

**File:** `components/subscription/SubscriptionOption.tsx`

**Add missing field:**
```typescript
export interface SubscriptionPlan {
  id: string;
  title: string;
  price: string;
  priceValue: number;  // ✅ ADD THIS
  period: string;
  badge?: string;
  savings?: string;
  description: string;
}
```

### 2.2 Export TypeScript Types (15 min)
**Priority:** 🟡 MAJOR

**File:** `constants/subscription.ts`

**Add at end of file:**
```typescript
export type SubscriptionPricingConfig = typeof SUBSCRIPTION_PRICING;
export type SubscriptionTier = keyof typeof SUBSCRIPTION_PRICING;
export type PremiumFeature = typeof PREMIUM_FEATURES[number];
```

### 2.3 Add Error Boundaries (1 hour)
**Priority:** 🟡 MAJOR

**Create:** `components/ErrorBoundary.tsx`
```typescript
import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/constants/colors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: colors.text.primary, fontSize: 18, marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ color: colors.text.secondary, textAlign: 'center' }}>
            Please try again or contact support if the issue persists.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}
```

**Wrap paywalls:**
```typescript
// app/trial-expired.tsx
<ErrorBoundary>
  <TrialExpiredPaywall {...props} />
</ErrorBoundary>
```

### 2.4 Platform-Specific Shadows (30 min)
**Priority:** 🟡 MAJOR

**File:** `components/paywall/PaywallButton.tsx`

```typescript
import { Platform, StyleSheet } from 'react-native';

const getShadowStyle = (isDisabled: boolean) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: colors.emerald[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDisabled ? 0.2 : 0.4,
      shadowRadius: 12,
    };
  }
  return {
    elevation: isDisabled ? 4 : 8,
  };
};

// In component:
style={[
  {
    backgroundColor: isDisabled ? colors.emerald[700] : colors.emerald[600],
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  getShadowStyle(isDisabled),
]}>
```

### 2.5 Add Memoization (2 hours)
**Priority:** 🟡 MAJOR

**All component files:**
```typescript
import { memo } from 'react';

export const PaywallButton = memo(function PaywallButton({ ... }: PaywallButtonProps) {
  // component code
});

export const FeaturesList = memo(function FeaturesList({ ... }: FeaturesListProps) {
  // component code
});

export const SubscriptionOption = memo(function SubscriptionOption({ ... }: SubscriptionOptionProps) {
  // component code
});

// ... etc for all components
```

### 2.6 Add Haptic Feedback (30 min)
**Priority:** 🟡 MAJOR

**File:** `components/subscription/SubscriptionOption.tsx`

```typescript
import * as Haptics from 'expo-haptics';

export const SubscriptionOption = memo(function SubscriptionOption({ ... }: SubscriptionOptionProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(plan.id);
  };

  return (
    <Pressable
      onPress={handlePress}
      ...>
```

### 2.7 Use StyleSheet.create (2 hours)
**Priority:** 🟡 MAJOR

**Example for PaywallButton:**
```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.emerald[100],
    marginTop: 4,
  },
});

// Use in component:
<View style={styles.button}>
  <View style={styles.content}>
    <View style={styles.titleRow}>
      <Text style={styles.title}>{title}</Text>
```

### 2.8 Make Arrays Readonly (15 min)
**Priority:** 🟡 MAJOR

**File:** `constants/loopPaywalls.ts`

```typescript
export interface LoopPaywallConfig {
  icon: LucideIcon;
  emoji: string;
  title: string;
  subtitle: string;
  features: readonly string[];  // ✅ Add readonly
  urgency: string;
}
```

---

## Phase 3: Testing & Validation (4 hours)

### 3.1 Manual Testing Checklist
- [ ] Test all paywalls on iOS device with VoiceOver enabled
- [ ] Test all paywalls on Android device with TalkBack enabled
- [ ] Test subscription selection on both platforms
- [ ] Test loading states
- [ ] Test with invalid loop types
- [ ] Test close button on dismissible paywalls
- [ ] Test with different screen sizes (iPhone SE, iPhone 14 Pro Max, iPad)
- [ ] Test with different text sizes (Accessibility settings)

### 3.2 Automated Testing Setup
- [ ] Install testing dependencies
- [ ] Write unit tests for components
- [ ] Write E2E tests for paywall flows
- [ ] Add to CI/CD pipeline

---

## Phase 4: Nice-to-Haves (6-8 hours) - FUTURE

### 4.1 JSDoc Comments
Add comprehensive documentation to all components

### 4.2 Usage Examples
Add examples to component files

### 4.3 Performance Monitoring
Integrate React Profiler

### 4.4 Analytics
Add tracking for paywall interactions

### 4.5 A/B Testing
Make pricing/copy configurable for experiments

---

## Quick Reference: Files to Update

### Critical Fixes
- [ ] `components/paywall/PaywallHeader.tsx` - Fix fragment, add a11y
- [ ] `components/paywall/FeaturesList.tsx` - Fix keys, add a11y
- [ ] `components/paywall/PaywallButton.tsx` - Add a11y, testID
- [ ] `components/paywall/PaywallCloseButton.tsx` - Add a11y, testID
- [ ] `components/paywall/PaywallSecondaryButton.tsx` - Add a11y, testID
- [ ] `components/subscription/SubscriptionOption.tsx` - Add a11y, testID, fix type
- [ ] `components/LoopSpecificPaywall.tsx` - Add null check
- [ ] `constants/subscription.ts` - Fix currency, export types
- [ ] `utils/currency.ts` - CREATE NEW

### Major Fixes
- [ ] All component files - Add memoization, StyleSheet
- [ ] `components/ErrorBoundary.tsx` - CREATE NEW
- [ ] `constants/loopPaywalls.ts` - Make arrays readonly
- [ ] All screen files - Wrap in ErrorBoundary

---

## Success Criteria

Before marking as "Production Ready":
✅ All accessibility labels present
✅ Screen reader tested on both platforms
✅ No TypeScript errors
✅ No console warnings
✅ All testIDs added
✅ Error boundaries in place
✅ Null checks added
✅ Currency formatting dynamic
✅ Performance profiled (no excessive re-renders)
✅ E2E tests passing

---

## Estimated Timeline

| Phase | Time | When |
|-------|------|------|
| Phase 1: Critical | 6 hours | **This Week** |
| Phase 2: Major | 8 hours | **Next Week** |
| Phase 3: Testing | 4 hours | **Next Week** |
| Phase 4: Nice-to-Have | 6-8 hours | **Next Sprint** |

**Total Minimum:** 18 hours
**Total Maximum:** 26 hours

---

## Contact for Questions

Refer to:
- `DEEP_AUDIT_REPORT.md` - Full audit details
- `REFACTORING_SUMMARY.md` - Original refactoring documentation
- `TRIAL_SYSTEM.md` - Trial system architecture

---

**Last Updated:** 2025-10-31
