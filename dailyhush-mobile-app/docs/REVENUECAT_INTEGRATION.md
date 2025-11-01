# RevenueCat Integration Guide

**Status:** ✅ **COMPLETED**
**Date:** 2025-11-01
**Integration Type:** Full SDK Implementation with International Currency Support

---

## Overview

DailyHush uses [RevenueCat](https://www.revenuecat.com/) for cross-platform subscription management. This integration handles:

- ✅ **Subscription purchases** (Monthly, Annual, Lifetime)
- ✅ **International currency support** (200+ currencies via App Store/Play Store)
- ✅ **Receipt validation** (automatic)
- ✅ **Subscription status tracking**
- ✅ **Restore purchases**
- ✅ **User identification** (links purchases to Supabase users)

---

## How International Pricing Works

### App Store/Play Store Pricing Tiers

When you set up products in App Store Connect or Google Play Console:

1. **You set a base price tier** (e.g., Tier 10 = $9.99 USD)
2. **Apple/Google automatically converts** to 200+ local currencies
3. **Each region gets equivalent pricing**:
   - US: $9.99
   - Europe: €9.99
   - UK: £8.99
   - Japan: ¥1,200
   - etc.

### RevenueCat's Role

- RevenueCat **fetches localized price strings** from App Store/Play Store
- Prices come **pre-formatted** with currency symbols
- Example: `product.priceString` returns:
  - `"$9.99"` (US)
  - `"€9.99"` (Germany)
  - `"¥1,200"` (Japan)
  - `"R$ 49,90"` (Brazil)

### Why This Works

- **No manual currency conversion needed**
- **No hardcoded currency symbols**
- **Respects user's App Store locale**
- **Apple/Google handle all compliance**

---

## Installation

### Step 1: Install RevenueCat SDK

```bash
cd /Users/toni/Downloads/dailyhush-blog/dailyhush-mobile-app
npm install react-native-purchases
```

### Step 2: iOS Setup (if using bare React Native)

If using **Expo managed workflow**, skip this step. Expo handles iOS setup automatically.

If using **bare React Native**:

```bash
cd ios && pod install
```

### Step 3: Environment Variables

Ensure your `.env` file has RevenueCat API keys:

```env
# RevenueCat API Keys
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=your_ios_key_here
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=your_android_key_here
```

Keys are available at: https://app.revenuecat.com/

---

## RevenueCat Dashboard Setup

### 1. Create Products in App Store Connect

**Monthly Subscription:**
- Product ID: `dailyhush_premium_monthly`
- Type: Auto-renewable subscription
- Price Tier: Tier 10 ($9.99)

**Annual Subscription:**
- Product ID: `dailyhush_premium_annual`
- Type: Auto-renewable subscription
- Price Tier: Tier 60 ($59.99)

**Lifetime Purchase:**
- Product ID: `dailyhush_premium_lifetime`
- Type: Non-consumable
- Price Tier: Tier 150 ($149.99)

### 2. Create Products in Google Play Console

Same product IDs as iOS.

### 3. Create Entitlement in RevenueCat

1. Go to RevenueCat Dashboard → **Entitlements**
2. Create entitlement: `premium`
3. Attach all 3 products to this entitlement

### 4. Create Offering in RevenueCat

1. Go to **Offerings** → Create offering: `default`
2. Add packages:
   - **Monthly:** `$rc_monthly` → `dailyhush_premium_monthly`
   - **Annual:** `$rc_annual` → `dailyhush_premium_annual`
   - **Lifetime:** `lifetime` → `dailyhush_premium_lifetime`

---

## How It Works

### App Startup (`app/_layout.tsx`)

```typescript
import { initializeRevenueCat } from '@/utils/revenueCat';

// Initialize RevenueCat when user logs in
await initializeRevenueCat(userId);
```

- RevenueCat initializes **automatically** on app startup
- If user is logged in, their Supabase `user.id` is used as RevenueCat User ID
- If not logged in, RevenueCat creates anonymous user

### Subscription Screen (`app/subscription.tsx`)

```typescript
import { getOfferings, purchasePackage } from '@/utils/revenueCat';

// Load offerings from RevenueCat
const offering = await getOfferings();

// Get packages with localized pricing
const packages = offering.availablePackages;

// Display prices (already localized)
packages.map(pkg => ({
  price: pkg.product.priceString, // e.g., "$9.99", "€9.99"
  priceValue: pkg.product.price,  // Numeric value for sorting
}));

// Purchase selected package
await purchasePackage(selectedPackage);
```

### Premium Status Check (`hooks/useTrialGuard.ts`)

```typescript
import { usePremiumStatus } from '@/hooks/useTrialGuard';

const { isPremium, isLoading, source } = usePremiumStatus();

// source can be:
// - 'trial' (7-day trial active)
// - 'subscription' (RevenueCat subscription active)
// - null (no Premium access)
```

The hook checks:
1. **Trial status** from Supabase (7-day NO-CC trial)
2. **Subscription status** from RevenueCat
3. Returns `true` if **either** is active

---

## File Structure

### Core Files

```
utils/
└── revenueCat.ts              ✅ RevenueCat SDK utilities

app/
├── _layout.tsx                ✅ RevenueCat initialization on startup
└── subscription.tsx           ✅ Subscription screen (uses RevenueCat)

hooks/
└── useTrialGuard.ts           ✅ Premium status check (trial + subscription)

constants/
└── subscription.ts            📝 Reference pricing (deprecated, for docs only)

components/
└── subscription/
    └── SubscriptionOption.tsx ✅ Subscription plan card component
```

### Created Files

**`utils/revenueCat.ts`** - Complete RevenueCat SDK wrapper:
- `initializeRevenueCat(userId?)` - Initialize SDK
- `getOfferings()` - Get subscription packages with localized pricing
- `purchasePackage(package)` - Purchase subscription
- `checkPremiumStatus()` - Check if user has active Premium
- `restorePurchases()` - Restore previous purchases
- `packageToSubscriptionPlan(pkg)` - Convert RevenueCat package to app format

### Modified Files

**`app/_layout.tsx`** - Added RevenueCat initialization on app startup

**`app/subscription.tsx`** - Completely rewritten:
- Loads offerings from RevenueCat (not hardcoded)
- Displays localized pricing automatically
- Handles purchase flow with proper error handling
- Updates Supabase after successful purchase

**`hooks/useTrialGuard.ts`** - Updated `usePremiumStatus()`:
- Checks trial status first
- Falls back to RevenueCat subscription check
- Returns `source` field to indicate Premium source

**`constants/subscription.ts`** - Marked pricing as deprecated:
- Added `@deprecated` comment
- Pricing is now **reference only**
- Actual pricing loaded from RevenueCat

**`components/subscription/SubscriptionOption.tsx`** - Fixed type issues:
- Added `priceValue` field to interface
- Added accessibility labels
- Added haptic feedback
- Added testID

---

## Testing

### Test Sandbox Purchases (iOS)

1. Create sandbox test account in App Store Connect
2. Sign out of production App Store on device
3. Run app and attempt purchase
4. Sign in with sandbox account when prompted
5. Complete test purchase (no real charge)

### Test Sandbox Purchases (Android)

1. Add tester email to Google Play Console
2. Install app via internal testing track
3. Attempt purchase
4. Complete test purchase (no real charge)

### Test Restore Purchases

```typescript
import { restorePurchases } from '@/utils/revenueCat';

const customerInfo = await restorePurchases();
console.log('Restored purchases:', customerInfo);
```

### Check Premium Status

```typescript
import { checkPremiumStatus } from '@/utils/revenueCat';

const status = await checkPremiumStatus();
console.log('Premium active:', status.isPremium);
console.log('Expiration:', status.expirationDate);
console.log('Will renew:', status.willRenew);
```

---

## Production Checklist

Before launching subscriptions:

- [ ] RevenueCat API keys added to `.env`
- [ ] Products created in App Store Connect
- [ ] Products created in Google Play Console
- [ ] Products linked to RevenueCat entitlement `premium`
- [ ] Offering created in RevenueCat with correct package identifiers
- [ ] Tested sandbox purchases on iOS
- [ ] Tested sandbox purchases on Android
- [ ] Tested restore purchases flow
- [ ] Tested trial → subscription upgrade flow
- [ ] Subscription status syncs to Supabase `profiles` table
- [ ] RevenueCat webhook configured (optional, for server-side validation)

---

## Key Benefits

### 1. **No Hardcoded Prices**
- All pricing loaded dynamically from App Store/Play Store
- Easy to change prices without app update
- A/B testing possible via RevenueCat offerings

### 2. **Automatic Currency Support**
- Works in 200+ countries
- No manual currency conversion
- Respects user's App Store locale

### 3. **Cross-Platform Consistency**
- Same codebase for iOS and Android
- RevenueCat handles platform differences
- Unified subscription status across devices

### 4. **Receipt Validation**
- RevenueCat validates all receipts server-side
- Prevents piracy and fraudulent purchases
- No manual receipt verification needed

### 5. **User Identification**
- Links purchases to Supabase user ID
- Purchases persist across devices
- Easy to track user subscription history

---

## Advanced Features (Optional)

### Introductory Offers

Enable in App Store Connect:
- 3-day free trial
- Discounted first month
- Pay-as-you-go intro price

RevenueCat automatically handles these.

### Promotional Offers

Create promotional codes in App Store Connect/Play Console. Users can redeem via:

```typescript
import Purchases from 'react-native-purchases';

await Purchases.presentCodeRedemptionSheet();
```

### Subscription Status Webhooks

Configure in RevenueCat Dashboard → Integrations:
- Webhook URL: `https://your-backend.com/webhooks/revenuecat`
- Events: `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION`

Use to update Supabase subscription status server-side.

---

## Troubleshooting

### "No offerings available"

**Cause:** RevenueCat can't find offerings
**Fix:** Check that:
1. Products exist in App Store Connect/Play Console
2. Products are linked to entitlement in RevenueCat
3. Offering `default` exists with packages
4. App is using correct RevenueCat API key

### "Purchase failed"

**Cause:** Multiple possible reasons
**Fix:** Check error message:
- `userCancelled` - User cancelled, not an error
- `productNotAvailable` - Product ID mismatch
- `receiptInvalid` - Receipt validation failed
- `networkError` - Connection issue

### Prices show as "$0.00"

**Cause:** Products not approved in App Store Connect
**Fix:**
1. Submit products for review
2. Wait for approval
3. Test with sandbox account

### Subscription not appearing after purchase

**Cause:** Supabase not updated
**Fix:** Check `app/subscription.tsx:178-186`:
```typescript
await supabase
  .from('profiles')
  .update({
    subscription_status: 'active',
    subscription_tier: selectedOption.id,
  })
  .eq('id', session.user.id);
```

---

## Support

- **RevenueCat Docs:** https://www.revenuecat.com/docs
- **RevenueCat Dashboard:** https://app.revenuecat.com/
- **RevenueCat Community:** https://community.revenuecat.com/

---

**Last Updated:** 2025-11-01
