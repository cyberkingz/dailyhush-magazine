# Nœma - Subscription Products Summary
**Date:** November 11, 2025
**For:** App Store Connect & RevenueCat Configuration

---

## 📦 SUBSCRIPTION PRODUCTS

### Product 1: Monthly Premium
**Product ID:** `com.anthony.noema.monthly`
**Type:** Auto-renewable subscription
**Duration:** 1 month
**Price:** $9.99 USD
**Trial:** 7 days free
**Badge:** None
**Description:** "Perfect for trying Premium"

**Benefits:**
- Personalized loop-breaking exercises
- Advanced rumination interrupt techniques
- Progress tracking & insights
- Voice journaling (coming soon)
- Priority support
- Ad-free experience

---

### Product 2: Annual Premium (MOST POPULAR)
**Product ID:** `com.anthony.noema.annual`
**Type:** Auto-renewable subscription
**Duration:** 1 year
**Price:** $59.99 USD
**Trial:** 7 days free
**Badge:** "MOST POPULAR"
**Savings:** Save 50% vs monthly ($119.88 → $59.99)
**Description:** "Best value - 2 months free"

**Benefits:**
- All Monthly Premium features
- 50% savings (equivalent to $5/month)
- 2 months free compared to monthly billing

---

### Product 3: Lifetime Premium
**Product ID:** `com.anthony.noema.lifetime`
**Type:** Non-consumable (one-time purchase)
**Duration:** Forever
**Price:** $149.99 USD
**Trial:** No trial (one-time purchase)
**Badge:** "BEST VALUE"
**Savings:** "Pay once, keep forever"
**Description:** "Never pay again"

**Benefits:**
- All Premium features forever
- No recurring payments
- Best long-term value (pays for itself after 15 months vs monthly)

---

## 🎁 FREE TRIAL DETAILS

**Trial Duration:** 7 days
**Applies to:** Monthly & Annual subscriptions only
**Trial Copy:** "Start your 7-day journey"
**Disclaimer:** "Cancel anytime before trial ends to avoid charges"

**Trial Behavior:**
- Users get full Premium access for 7 days
- No charge during trial period
- Auto-converts to paid subscription after 7 days
- Can cancel anytime before trial ends (no charge)

---

## 💰 PRICING COMPARISON

| Plan | Price | Per Month | Savings | Trial |
|------|-------|-----------|---------|-------|
| **Monthly** | $9.99/month | $9.99 | — | 7 days |
| **Annual** | $59.99/year | $5.00 | 50% | 7 days |
| **Lifetime** | $149.99 once | $0.83* | 92%* | No trial |

*Lifetime calculation: $149.99 ÷ 15 years ÷ 12 months = $0.83/month

---

## 🆓 FREE PLAN FEATURES

Users without Premium subscription get:
- ✅ Spiral interrupt exercises (limited)
- ✅ Daily content
- ✅ Community support
- ✅ Basic progress tracking

**Upgrade CTA:** "Free features always available. Upgrade anytime to unlock Premium."

---

## 📋 SUBSCRIPTION TERMS

### Auto-Renewal
"Subscriptions renew automatically unless canceled 24 hours before the end of your current period."

### Cancellation
"You can cancel anytime through your App Store or Google Play settings."

### Full Legal Text
"Subscriptions auto-renew unless canceled 24 hours before the end of the current period. Cancel anytime in your App Store settings."

---

## 🍎 APP STORE CONNECT SETUP

### Step 1: Create In-App Purchases

Go to: **App Store Connect → Your App → Monetization → In-App Purchases**

#### Product 1: Monthly
- **Reference Name:** Noema Premium Monthly
- **Product ID:** `com.anthony.noema.monthly`
- **Type:** Auto-Renewable Subscription
- **Subscription Group:** Noema Premium (create if doesn't exist)
- **Subscription Duration:** 1 Month
- **Price:** $9.99 USD (Tier 10)
- **Review Screenshot:** Upload app screenshot
- **Review Notes:** "Monthly subscription with 7-day trial"

#### Product 2: Annual
- **Reference Name:** Noema Premium Annual
- **Product ID:** `com.anthony.noema.annual`
- **Type:** Auto-Renewable Subscription
- **Subscription Group:** Noema Premium (same as monthly)
- **Subscription Duration:** 1 Year
- **Price:** $59.99 USD (Tier 60)
- **Review Screenshot:** Upload app screenshot
- **Review Notes:** "Annual subscription with 7-day trial, 50% savings"

#### Product 3: Lifetime
- **Reference Name:** Noema Premium Lifetime
- **Product ID:** `com.anthony.noema.lifetime`
- **Type:** Non-Consumable
- **Subscription Group:** N/A (not a subscription)
- **Price:** $149.99 USD (Tier 150)
- **Review Screenshot:** Upload app screenshot
- **Review Notes:** "One-time purchase for lifetime access"

### Step 2: Configure Subscription Group

**Group Name:** Noema Premium
**Subscription Rank:**
1. Annual (highest - Apple will suggest this first)
2. Monthly (middle)
3. Lifetime (N/A - not in subscription group)

**Introductory Offer:**
- ✅ Enable for Monthly: 7 days free trial
- ✅ Enable for Annual: 7 days free trial
- Type: Free Trial
- Duration: 7 Days
- Eligibility: New Subscribers

---

## 🔧 REVENUECAT SETUP

### Step 1: Add Products in RevenueCat

Go to: **RevenueCat Dashboard → Products**

Create 3 products matching App Store Connect:

1. **monthly**
   - Store Product ID (iOS): `com.anthony.noema.monthly`
   - Display Name: Monthly Premium

2. **annual**
   - Store Product ID (iOS): `com.anthony.noema.annual`
   - Display Name: Annual Premium

3. **lifetime**
   - Store Product ID (iOS): `com.anthony.noema.lifetime`
   - Display Name: Lifetime Premium

### Step 2: Create Offering

Go to: **RevenueCat Dashboard → Offerings**

**Offering ID:** `default` (or create named offering)

**Add Packages:**
1. **Package ID:** `$rc_monthly`
   - Product: monthly
   - Type: Monthly

2. **Package ID:** `$rc_annual`
   - Product: annual
   - Type: Annual
   - ⭐ Set as Default

3. **Package ID:** `$rc_lifetime`
   - Product: lifetime
   - Type: Lifetime

**Note:** Use RevenueCat's standard package identifiers (`$rc_monthly`, `$rc_annual`, `$rc_lifetime`) for automatic package type detection.

---

## 🎨 DISPLAY COPY IN APP

### Paywall Header
"Begin Your Journey to Peace"

### Paywall Subheader
"Choose the path that feels right for you"

### Plan Cards

**Monthly:**
- Title: "Monthly"
- Price: "$9.99/month" (loaded from RevenueCat)
- Description: "Perfect for trying Premium"
- Trial: "Start your 7-day journey"

**Annual:** ⭐ Most Popular
- Title: "Annual"
- Price: "$59.99/year" (loaded from RevenueCat)
- Badge: "MOST POPULAR"
- Description: "Best value - 2 months free"
- Savings: "Save 50%"
- Trial: "Start your 7-day journey"

**Lifetime:** 💎 Best Value
- Title: "Lifetime"
- Price: "$149.99" (loaded from RevenueCat)
- Badge: "BEST VALUE"
- Description: "Never pay again"
- Savings: "Pay once, keep forever"
- Trial: None (immediate purchase)

### CTA Buttons
- Free trial: "Start 7-Day Trial"
- Lifetime: "Buy Lifetime Access"

### Legal Footer
"Subscriptions renew automatically unless canceled 24 hours before the end of your current period. Cancel anytime in your App Store settings."

---

## 🚨 IMPORTANT NOTES

### Pricing is Reference Only
The hardcoded prices in `constants/subscription.ts` are **FOR REFERENCE ONLY**.
**Production app loads actual pricing from RevenueCat/App Store dynamically.**

This ensures:
- ✅ International currency localization (€, £, ¥, etc.)
- ✅ Apple's pricing tiers are respected
- ✅ Price changes don't require app update
- ✅ A/B testing capabilities through RevenueCat

### Bundle ID Changed
- Old Bundle ID: `com.noema.mobile`
- **New Bundle ID:** `com.anthony.noema` ✅
- **All product IDs must use new bundle prefix**

### Testing
Before production launch:
1. Create **Sandbox Tester** in App Store Connect
2. Test all 3 products in TestFlight build
3. Test 7-day trial flow (use date manipulation)
4. Test subscription restore
5. Test upgrade/downgrade between plans
6. Test cancellation flow

---

## ✅ CHECKLIST

### App Store Connect
- [ ] Create Subscription Group "Noema Premium"
- [ ] Create Product: `com.anthony.noema.monthly` ($9.99, 1 month, 7-day trial)
- [ ] Create Product: `com.anthony.noema.annual` ($59.99, 1 year, 7-day trial)
- [ ] Create Product: `com.anthony.noema.lifetime` ($149.99, non-consumable)
- [ ] Upload review screenshots for all products
- [ ] Submit products for review

### RevenueCat Dashboard
- [ ] Add 3 products with correct Store Product IDs
- [ ] Create "default" offering
- [ ] Add packages: $rc_monthly, $rc_annual, $rc_lifetime
- [ ] Set annual as default package
- [ ] Upload .p8 key file (App Store Connect API)
- [ ] Verify credentials (green checkmark)

### Testing
- [ ] Create sandbox tester account
- [ ] Install TestFlight build
- [ ] Test purchase flow for all 3 products
- [ ] Test 7-day trial (monthly & annual)
- [ ] Test restore purchases
- [ ] Test cancellation

---

## 📞 SUPPORT

If users have issues:
- **Email:** hello@trynoema.com
- **In-App:** Settings → Contact Support
- **RevenueCat:** Handles subscription status automatically

---

**Status:** Ready to configure in App Store Connect & RevenueCat
**Bundle ID:** com.anthony.noema
**Apple Team ID:** 8F563NMZV5
**App Store Connect ID:** 6755148761
