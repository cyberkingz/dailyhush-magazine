# Premium Trial System Documentation

## Overview
DailyHush uses a **NO credit card required** 7-day Premium trial system. Users can start a trial after completing the quiz, and when the trial expires, they're offered subscription options or can continue with the Free tier.

## System Architecture

### 1. Database Schema

**user_profiles table** (trial tracking):
```sql
premium_trial_active BOOLEAN DEFAULT FALSE
premium_trial_start TIMESTAMPTZ
premium_trial_end TIMESTAMPTZ
loop_type TEXT CHECK (loop_type IN ('sleep-loop', 'decision-loop', 'social-loop', 'perfectionism-loop'))
```

### 2. Core Components

#### Trial Manager (`/utils/trialManager.ts`)
Handles trial lifecycle:
- `startPremiumTrial()` - Start 7-day trial
- `getTrialStatus()` - Check trial status
- `expireTrial()` - Auto-expire trial
- `cancelTrial()` - User cancels trial
- `isPremiumActive()` - Check Premium access

#### Trial Expired Paywall (`/components/TrialExpiredPaywall.tsx`)
Shows when trial ends:
- Loop-specific messaging
- Premium features list
- Subscription CTA
- Continue with Free option

#### Trial Expired Screen (`/app/trial-expired.tsx`)
Modal screen shown when trial expires:
- Uses TrialExpiredPaywall component
- Redirects to subscription or home

#### Subscription Screen (`/app/subscription.tsx`)
Shows RevenueCat subscription options:
- Monthly: $9.99/month
- Annual: $59.99/year (50% savings)
- Lifetime: $149.99 one-time

#### Trial Guard Hook (`/hooks/useTrialGuard.ts`)
Detects trial expiration and redirects:
- Checks trial status on app launch
- Periodic checks every hour
- Redirects to trial-expired screen when expired

### 3. User Flow

#### Starting Trial (After Quiz)
```
Quiz Complete → Profile Setup → Signup → Quiz Results
                                            ↓
                              "View Premium Features"
                                            ↓
                              Loop-Specific Paywall
                                            ↓
                      "Try FREE for 7 Days" (NO CC)
                                            ↓
                              startPremiumTrial()
                                            ↓
                              Save to user_profiles
                                            ↓
                                  Navigate to Home
```

#### Trial Expiration
```
App Launch → useTrialGuard() → getTrialStatus()
                                      ↓
                          Trial Expired (0 days remaining)
                                      ↓
                          Redirect to /trial-expired
                                      ↓
                              User chooses:
                          - Subscribe (→ /subscription)
                          - Continue Free (→ Home)
```

## Integration Guide

### Step 1: Add Trial Guard to Root Layout

In your root layout file (`app/_layout.tsx` or `app/(app)/_layout.tsx`):

```typescript
import { useTrialGuard } from '@/hooks/useTrialGuard';

export default function RootLayout() {
  // Enable trial expiration detection
  useTrialGuard(true);

  return (
    // Your layout JSX
  );
}
```

### Step 2: Check Premium Status in Features

For any Premium-only feature:

```typescript
import { usePremiumStatus } from '@/hooks/useTrialGuard';

function PremiumFeature() {
  const { isPremium, isLoading, daysRemaining } = usePremiumStatus();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isPremium) {
    return <UpgradePrompt />;
  }

  return <PremiumContent />;
}
```

### Step 3: Show Trial Badge (Optional)

Show trial status in header/profile:

```typescript
import { usePremiumStatus } from '@/hooks/useTrialGuard';

function Header() {
  const { isPremium, daysRemaining } = usePremiumStatus();

  if (isPremium && daysRemaining > 0) {
    return (
      <View>
        <Crown size={20} color={colors.emerald[500]} />
        <Text>Trial: {daysRemaining} days left</Text>
      </View>
    );
  }

  return null;
}
```

## Trial Reminders

### Day 5 & Day 6 Reminders
Use `shouldShowTrialReminder()` from trialManager:

```typescript
import { getTrialStatus, shouldShowTrialReminder } from '@/utils/trialManager';

async function checkTrialReminder() {
  const trialStatus = await getTrialStatus(supabase, userId);

  if (shouldShowTrialReminder(trialStatus)) {
    // Show in-app reminder or send notification
    showTrialExpiringNotification(trialStatus.daysRemaining);
  }
}
```

## RevenueCat Integration

### Setup (TODO)
1. Install RevenueCat SDK: `npx expo install react-native-purchases`
2. Configure in `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-purchases",
        {
          "apiKey": "process.env.REVENUE_CAT_SDK_API_KEY_TEST_STORE"
        }
      ]
    ]
  }
}
```

3. Create products in RevenueCat dashboard:
   - `monthly_premium` - $9.99/month
   - `annual_premium` - $59.99/year
   - `lifetime_premium` - $149.99 one-time

4. Update `/app/subscription.tsx` to load RevenueCat packages and handle purchases

### Subscription Status Sync

When user subscribes via RevenueCat:
```typescript
import Purchases from 'react-native-purchases';

async function handleSubscription() {
  const purchaseResult = await Purchases.purchasePackage(selectedPackage);

  // Sync to Supabase
  await supabase.from('mobile_subscriptions').upsert({
    user_id: userId,
    status: 'active',
    revenuecat_customer_id: purchaseResult.customerInfo.originalAppUserId,
    product_id: purchaseResult.productIdentifier,
    // ... other fields
  });
}
```

## Testing

### Test Trial Flow
1. Complete quiz → Start trial
2. Check `user_profiles.premium_trial_active = true`
3. Check `premium_trial_end` = 7 days from now
4. Verify Premium features are accessible

### Test Trial Expiration
1. Manually set `premium_trial_end` to past date:
```sql
UPDATE user_profiles
SET premium_trial_end = NOW() - INTERVAL '1 day'
WHERE user_id = 'test-user-id';
```
2. Restart app
3. Verify redirect to `/trial-expired` screen
4. Test "Subscribe" and "Continue Free" options

### Test Subscription (TODO)
1. Configure RevenueCat test products
2. Test purchase flow
3. Verify subscription status syncs to Supabase
4. Verify Premium features remain accessible

## Free Tier Features

These features remain FREE forever:
- Spiral interrupt exercises (core feature)
- Daily content (1-2 pieces per day)
- Community support
- Basic progress tracking

## Premium Features

Require active trial OR subscription:
- Personalized loop-breaking exercises
- Advanced rumination interrupt techniques
- Full progress tracking & insights
- Voice journaling (coming soon)
- Priority support
- Ad-free experience

## Troubleshooting

### Trial not starting
- Check `startPremiumTrial()` errors in console
- Verify user is authenticated
- Check Supabase user_profiles table for trial fields

### Trial not expiring
- Check `useTrialGuard()` is enabled in root layout
- Check AsyncStorage for `last_trial_check` timestamp
- Check console for trial expiration logs

### Subscription not working
- Verify RevenueCat SDK is installed
- Check RevenueCat API keys in `.env`
- Check RevenueCat dashboard for product configuration
- Check console for purchase errors

## Next Steps

1. ✅ Database migrations applied
2. ✅ Trial manager utilities created
3. ✅ Trial expired screen built
4. ✅ Subscription screen built
5. ⏳ Integrate useTrialGuard in root layout
6. ⏳ Set up RevenueCat products
7. ⏳ Add trial reminder notifications
8. ⏳ Test end-to-end trial flow
