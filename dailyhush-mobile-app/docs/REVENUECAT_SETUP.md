# RevenueCat + Apple IAP Setup Guide

## Overview

This guide walks through setting up RevenueCat with Apple In-App Purchases (IAP) for DailyHush mobile app.

## Business Model Summary

- **Free Tier**: 3 conversations/week, 5 exercises/day, 7 days history
- **Premium Tier**: Unlimited access
- **Pricing**: $6.99/month or $69.99/year (17% savings)
- **Trial**: 7-day free trial (requires credit card via Apple)
- **Target Conversion**: 5-10%

---

## Step 1: Create RevenueCat Account

1. Go to [https://app.revenuecat.com/signup](https://app.revenuecat.com/signup)
2. Sign up with your email
3. Verify your email address
4. Choose the Free plan (good for up to $10K MRR)

---

## Step 2: Create RevenueCat Project

1. Click "Create new project"
2. Project name: `DailyHush`
3. Select **iOS** as your platform
4. Copy your **Public SDK Key** (starts with `appl_`)
   - This goes in `.env` as `EXPO_PUBLIC_REVENUECAT_IOS_KEY`
   - NEVER use the Secret Key in your mobile app

### Add API Key to Environment

Create/update `.env` file:

```bash
# RevenueCat Public SDK Keys
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxxxxxx
```

---

## Step 3: Create Products in App Store Connect

### Access App Store Connect

1. Go to [https://appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Sign in with your Apple Developer account
3. Navigate to **My Apps** > **DailyHush** (or create new app)
4. Go to **Features** > **In-App Purchases**

### Create Monthly Subscription

1. Click the **+** button
2. Select **Auto-Renewable Subscription**
3. Create a **Subscription Group** (if not exists):
   - Reference Name: `Premium Subscriptions`
   - Identifier: `premium_subscriptions`

#### Monthly Subscription Details

- **Product ID**: `com.dailyhush.premium.monthly`
- **Reference Name**: `Premium Monthly`
- **Subscription Duration**: `1 Month`
- **Price**: `$6.99` (Tier 30)
- **Free Trial**: `7 Days`

#### Localization (English - US)

- **Subscription Display Name**: `Premium Monthly`
- **Description**: `Unlimited conversations, exercises, and full history access`

### Create Annual Subscription

#### Annual Subscription Details

- **Product ID**: `com.dailyhush.premium.annual`
- **Reference Name**: `Premium Annual`
- **Subscription Duration**: `1 Year`
- **Price**: `$69.99` (Tier 300)
- **Free Trial**: `7 Days`
- **Promotional Offer**: Optional - can add intro pricing

#### Localization (English - US)

- **Subscription Display Name**: `Premium Annual`
- **Description**: `Best value - save 17% with annual billing`

### Important Notes

- Both subscriptions should be in the **same Subscription Group**
- Set subscription group ranking (Annual as Rank 1 = highest priority)
- Configure **Subscription Pricing** for all territories you plan to sell in
- Add **App Store Localization** for each territory

### Review Information

- **Screenshot**: Upload a screenshot showing premium features
- **Review Notes**: "This is a premium subscription that unlocks unlimited conversations with our AI coach and unlimited breathing exercises."

---

## Step 4: Configure Products in RevenueCat

### Link App Store Connect

1. In RevenueCat dashboard, go to **Project Settings** > **Apple App Store**
2. Enter your **iOS Bundle ID**: `com.dailyhush.mobile`
3. Upload your **In-App Purchase Key** (.p8 file):
   - In App Store Connect: **Users and Access** > **Keys** > **In-App Purchase**
   - Generate new key if needed
   - Download `.p8` file (only available once!)
   - Note the **Key ID** and **Issuer ID**
4. Upload the `.p8` file to RevenueCat
5. Enter Key ID and Issuer ID
6. Save configuration

### Create Products in RevenueCat

1. Go to **Products** tab
2. Click **+ New**

#### Monthly Product

- **Identifier**: `com.dailyhush.premium.monthly`
- **Type**: Auto-renewable subscription
- **Store**: Apple App Store
- **Name**: Premium Monthly
- Click **Save**

#### Annual Product

- **Identifier**: `com.dailyhush.premium.annual`
- **Type**: Auto-renewable subscription
- **Store**: Apple App Store
- **Name**: Premium Annual
- Click **Save**

---

## Step 5: Create Entitlement

An **entitlement** is what users get access to (e.g., "premium features").

1. Go to **Entitlements** tab
2. Click **+ New**
3. **Identifier**: `premium` (must match code: `PREMIUM_ENTITLEMENT_ID`)
4. **Name**: Premium Access
5. Click **Create**

---

## Step 6: Create Offering

An **offering** is a collection of products you present to users.

1. Go to **Offerings** tab
2. Click **+ New**
3. **Identifier**: `default` (RevenueCat will use this automatically)
4. **Description**: Default offering for all users

### Add Packages to Offering

#### Monthly Package

- Click **+ Add Package**
- **Identifier**: `$rc_monthly` (RevenueCat default)
- **Product**: `com.dailyhush.premium.monthly`
- **Entitlements**: Select `premium`
- **Position**: 1

#### Annual Package

- Click **+ Add Package**
- **Identifier**: `$rc_annual` (RevenueCat default)
- **Product**: `com.dailyhush.premium.annual`
- **Entitlements**: Select `premium`
- **Position**: 2
- Mark as **Featured** (optional)

4. Click **Save Offering**
5. Make this offering **Current** (toggle switch)

---

## Step 7: Configure Webhook for Backend Sync

RevenueCat will notify your backend when subscriptions change.

### Setup Webhook Endpoint

1. In RevenueCat dashboard: **Project Settings** > **Integrations** > **Webhooks**
2. Click **+ Add Webhook**
3. **URL**: `https://your-backend.com/webhooks/revenuecat`
   - Replace with your actual backend URL
   - Must be HTTPS
4. **Authorization Header**: Generate a secure token:
   ```bash
   openssl rand -hex 32
   ```

   - Add to your backend `.env`:
     ```
     REVENUECAT_WEBHOOK_SECRET=your_generated_token_here
     ```
5. Select events to send:
   - [x] INITIAL_PURCHASE
   - [x] RENEWAL
   - [x] CANCELLATION
   - [x] EXPIRATION
   - [x] BILLING_ISSUE
   - [x] PRODUCT_CHANGE
6. Click **Add Webhook**

### Test Webhook

1. Use RevenueCat's **Test Event** feature
2. Send a sample INITIAL_PURCHASE event
3. Verify your backend receives and logs the event

---

## Step 8: Update Mobile App Configuration

### Update app.json

Add RevenueCat entitlement to iOS configuration:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.dailyhush.mobile",
      "infoPlist": {
        "SKStoreProductParameterITunesItemIdentifier": "YOUR_APP_STORE_ID"
      }
    }
  }
}
```

### Initialize RevenueCat in App

The app is already configured! RevenueCat initializes in `app/_layout.tsx`:

```typescript
import { initializeRevenueCat } from '@/utils/revenueCat';

// In root layout
useEffect(() => {
  initializeRevenueCat(user?.id);
}, [user?.id]);
```

---

## Step 9: Test Subscriptions

### Sandbox Testing

1. **Create Sandbox Tester**:
   - App Store Connect > **Users and Access** > **Sandbox Testers**
   - Click **+** to add tester
   - Use a unique email (doesn't have to be real)
   - Remember password

2. **Sign out of real Apple ID on device**:
   - Settings > App Store > Sign Out

3. **Build and run app**:

   ```bash
   npx expo run:ios
   ```

4. **Navigate to subscription screen**:
   - App will prompt for Sandbox credentials
   - Sign in with Sandbox tester account

5. **Test purchase flow**:
   - Select a subscription plan
   - Confirm purchase (won't be charged in Sandbox)
   - Verify premium access is granted

6. **Test trial period**:
   - Sandbox accelerates time (7-day trial = ~21 minutes)
   - Wait and verify trial expiration

7. **Test restore purchases**:
   - Delete and reinstall app
   - Tap "Restore Purchases"
   - Verify subscription is restored

### Check RevenueCat Dashboard

1. Go to **Customers** tab
2. Find your Sandbox tester's transaction
3. Verify:
   - Purchase event was recorded
   - Entitlement is active
   - Trial period is shown

---

## Step 10: Production Deployment

### Before Submitting to App Store

1. **Complete all product metadata** in App Store Connect
2. **Test thoroughly** with Sandbox
3. **Verify webhook** is working with test events
4. **Add privacy policy** and terms of service links
5. **Configure subscription management URL**:
   - In App Store Connect: **App Information** > **Subscription Management URL**
   - Point to your website or use Apple's default

### App Review Considerations

Apple requires:

1. **Restore Purchases**: Already implemented in subscription screen
2. **Terms of Service**: Add link in paywall
3. **Privacy Policy**: Add link in paywall
4. **Clear Pricing**: Shown via RevenueCat localized prices
5. **Trial Information**: Displayed in UI
6. **Cancellation Info**: Mentioned in terms

### After App Store Approval

1. Monitor RevenueCat dashboard for:
   - New subscriptions
   - Renewals
   - Cancellations
   - Revenue metrics
2. Set up **email notifications** for critical events (billing issues, etc.)
3. Enable **charts and analytics** in RevenueCat

---

## Monitoring & Analytics

### RevenueCat Dashboard Metrics

- **Active Subscriptions**: Real-time count
- **MRR (Monthly Recurring Revenue)**: Track growth
- **Churn Rate**: Monitor cancellations
- **Trial Conversion**: % of trials that convert to paid

### Customer Lookup

1. Go to **Customers** tab
2. Search by:
   - App User ID (Supabase user ID)
   - Email
   - Transaction ID

### Useful Queries

```typescript
// Check if user has premium
const { isPremium } = await checkPremiumStatus();

// Get subscription details
const offerings = await getOfferings();

// Purchase subscription
await purchasePackage(selectedPackage);

// Restore purchases
await restorePurchases();
```

---

## Troubleshooting

### Common Issues

#### 1. "No products available"

- Verify products are approved in App Store Connect
- Check Bundle ID matches exactly
- Ensure In-App Purchase Key is uploaded to RevenueCat
- Wait 2-4 hours after creating products (App Store caching)

#### 2. "Invalid Product ID"

- Product IDs must match exactly between App Store Connect and RevenueCat
- Check for typos
- Ensure products are in "Ready to Submit" state

#### 3. Sandbox purchase fails

- Verify Sandbox tester account is created
- Sign out of real Apple ID on device
- Delete app and reinstall
- Try different Sandbox account

#### 4. Webhook not receiving events

- Verify webhook URL is HTTPS
- Check authorization header is correct
- Look for errors in RevenueCat webhook logs
- Test with RevenueCat's test event feature

### Debug Mode

Enable verbose logging:

```typescript
import Purchases from 'react-native-purchases';

if (__DEV__) {
  Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);
}
```

---

## Support Resources

- **RevenueCat Docs**: https://docs.revenuecat.com
- **Apple IAP Docs**: https://developer.apple.com/in-app-purchase/
- **RevenueCat Community**: https://community.revenuecat.com
- **App Store Connect**: https://appstoreconnect.apple.com

---

## Checklist

- [ ] RevenueCat account created
- [ ] Public SDK key added to `.env`
- [ ] Products created in App Store Connect
- [ ] Products linked in RevenueCat
- [ ] Entitlement created: `premium`
- [ ] Offering created: `default` with monthly & annual packages
- [ ] Webhook configured and tested
- [ ] Sandbox testing completed
- [ ] Privacy policy & TOS links added
- [ ] App submitted to App Store review

---

**Last Updated**: November 4, 2025
**DailyHush Mobile App** - Premium Subscription Setup
