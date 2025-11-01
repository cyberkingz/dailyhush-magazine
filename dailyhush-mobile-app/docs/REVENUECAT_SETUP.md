# RevenueCat Quick Setup Guide

**Time to complete:** ~30 minutes

---

## Prerequisites

- [ ] RevenueCat account created (https://app.revenuecat.com/)
- [ ] Apple Developer account (for iOS)
- [ ] Google Play Developer account (for Android)
- [ ] App Store Connect access
- [ ] Google Play Console access

---

## Step 1: Install SDK (2 minutes)

```bash
cd /Users/toni/Downloads/dailyhush-blog/dailyhush-mobile-app
npm install react-native-purchases
```

---

## Step 2: Create Products (10 minutes)

### iOS - App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app → **Features** → **In-App Purchases**
3. Click **+** to create new product

**Create these 3 products:**

| Name | Product ID | Type | Price Tier |
|------|-----------|------|-----------|
| Premium Monthly | `dailyhush_premium_monthly` | Auto-Renewable Subscription | Tier 10 ($9.99) |
| Premium Annual | `dailyhush_premium_annual` | Auto-Renewable Subscription | Tier 60 ($59.99) |
| Premium Lifetime | `dailyhush_premium_lifetime` | Non-Consumable | Tier 150 ($149.99) |

For subscriptions:
- **Subscription Group:** Create "Premium Access"
- **Subscription Duration:** Monthly (for monthly), 1 Year (for annual)
- **Auto-Renewable:** Yes

### Android - Google Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. Select your app → **Monetize** → **Products**
3. Click **Create product**

**Create the same 3 products** with same IDs and prices.

---

## Step 3: Configure RevenueCat (10 minutes)

### Add App to RevenueCat

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Click **Projects** → **+ New App**
3. Enter app name: **DailyHush**
4. Select platforms: **iOS & Android**
5. Click **Create App**

### Connect App Store

1. In RevenueCat, go to your app → **App settings** → **Apple App Store**
2. Enter **Bundle ID** (e.g., `com.dailyhush.app`)
3. Upload **In-App Purchase Key** (.p8 file from App Store Connect)
   - App Store Connect → Users & Access → Keys → In-App Purchase
   - Create key, download .p8 file
4. Enter **Issuer ID** and **Key ID** (from App Store Connect)
5. Click **Save**

### Connect Google Play

1. In RevenueCat, go to your app → **App settings** → **Google Play Store**
2. Enter **Package Name** (e.g., `com.dailyhush.app`)
3. Upload **Service Account JSON** (from Google Play Console)
   - Google Play Console → Setup → API Access
   - Create service account with "Finance" permissions
   - Download JSON credentials
4. Click **Save**

### Create Entitlement

1. In RevenueCat, go to **Entitlements**
2. Click **+ New Entitlement**
3. Enter identifier: `premium`
4. Click **Save**

### Create Offering

1. In RevenueCat, go to **Offerings**
2. Click **+ New Offering**
3. Identifier: `default`
4. Mark as **Current Offering**
5. Add packages:

| Package ID | Product |
|-----------|---------|
| `$rc_monthly` | `dailyhush_premium_monthly` |
| `$rc_annual` | `dailyhush_premium_annual` |
| `lifetime` | `dailyhush_premium_lifetime` |

6. Attach to entitlement: `premium`
7. Click **Save**

---

## Step 4: Add API Keys to Environment (2 minutes)

1. In RevenueCat, go to your app → **API Keys**
2. Copy **iOS API Key** and **Android API Key**
3. Add to `.env` file:

```env
# RevenueCat API Keys
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_xxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_xxxxxxxxxxxxx
```

4. Restart your development server

---

## Step 5: Test Sandbox Purchases (5 minutes)

### iOS Testing

1. **Create sandbox tester:**
   - App Store Connect → Users & Access → Sandbox Testers
   - Click **+** and create test account

2. **Sign out of production App Store** on device:
   - Settings → [Your Name] → Media & Purchases → Sign Out

3. **Run app and test purchase:**
   ```bash
   npm run ios
   ```

4. Navigate to subscription screen
5. Select a plan and tap "Subscribe Now"
6. Sign in with sandbox tester account when prompted
7. Confirm purchase (no real charge)

### Android Testing

1. **Add tester to internal testing:**
   - Google Play Console → Testing → Internal testing
   - Add your email to testers list

2. **Install via internal testing link**

3. **Run app and test purchase:**
   ```bash
   npm run android
   ```

4. Navigate to subscription screen
5. Select a plan and tap "Subscribe Now"
6. Confirm purchase (no real charge)

---

## Step 6: Verify Integration (3 minutes)

Open your app and check:

1. **Subscription screen loads:**
   - Prices display correctly
   - All 3 plans show
   - Prices are in your local currency (e.g., $ for US, € for EU)

2. **Console logs show:**
   ```
   ✅ RevenueCat initialized with user: <user-id>
   ✅ RevenueCat: Loaded offerings: default
   ```

3. **Purchase flow works:**
   - Select plan
   - Tap "Subscribe Now"
   - System payment sheet appears
   - Purchase completes successfully

4. **Premium status updates:**
   - After purchase, check `usePremiumStatus()` hook
   - Should return `{ isPremium: true, source: 'subscription' }`

---

## Troubleshooting

### "No offerings available"

**Solution:**
1. Check products are created in App Store Connect/Play Console
2. Check products are approved (may take 24-48 hours)
3. Check offering `default` exists in RevenueCat
4. Check packages are linked to products

### "Product not available for purchase"

**Solution:**
1. Verify product IDs match exactly in all systems
2. Wait 24-48 hours for Apple/Google to sync products
3. Test with sandbox account, not production
4. Check Bundle ID/Package Name matches

### Prices show "$0.00"

**Solution:**
1. Products not yet approved in App Store Connect
2. Submit products for review
3. Wait for approval
4. Test with sandbox account

### "Invalid credentials"

**Solution:**
1. Check API keys in `.env` are correct
2. Check In-App Purchase Key (.p8) is valid
3. Check Service Account JSON has "Finance" permission
4. Restart development server after changing `.env`

---

## Production Deployment Checklist

Before going live:

- [ ] All products approved in App Store Connect
- [ ] All products approved in Google Play Console
- [ ] Tested sandbox purchases on iOS
- [ ] Tested sandbox purchases on Android
- [ ] Tested restore purchases
- [ ] Tested trial → subscription upgrade
- [ ] Privacy policy mentions subscriptions
- [ ] Terms of service mention auto-renewal
- [ ] Screenshot subscription screen for app review
- [ ] Configure webhooks (optional)

---

## Next Steps

1. **Set up webhooks** (optional but recommended)
   - RevenueCat → Integrations → Webhooks
   - Use to sync subscription status to your backend

2. **Configure introductory offers** (optional)
   - App Store Connect → Subscription → Promotional Offers
   - E.g., 7-day free trial before first charge

3. **Add restore purchases button** (already implemented)
   - Users can restore purchases on new device
   - Uses `restorePurchases()` from RevenueCat utility

4. **Monitor analytics**
   - RevenueCat Dashboard → Charts
   - Track MRR, churn, conversion rate

---

## Support

- **Full documentation:** [REVENUECAT_INTEGRATION.md](./REVENUECAT_INTEGRATION.md)
- **RevenueCat Docs:** https://www.revenuecat.com/docs
- **RevenueCat Support:** support@revenuecat.com

---

**Last Updated:** 2025-11-01
