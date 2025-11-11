# Nœma Rebranding Summary
**Date:** November 11, 2025
**Previous Name:** DailyHush
**New Name:** Nœma

---

## 🎨 COMPLETE REBRAND EXECUTED

Your app has been successfully rebranded from **DailyHush** to **Nœma** across the entire codebase!

**Commit:** `11925d0` - rebrand: Rename app from DailyHush to Nœma

---

## ✅ WHAT WAS CHANGED

### 1. **App Configuration** (Critical for App Store)

#### app.json
- **Name:** `DailyHush` → `Nœma`
- **Slug:** `dailyhush` → `noema`
- **Scheme:** `dailyhush` → `noema`
- **iOS Bundle ID:** `com.dailyhush.mobile` → `com.noema.mobile` ⚠️ CRITICAL
- **Android Package:** `com.dailyhush.mobile` → `com.noema.mobile` ⚠️ CRITICAL
- **EAS Project ID:** `dailyhush-mobile-app` → `noema-mobile-app`

#### package.json
- **Package Name:** `dailyhush-mobile-app-new` → `noema-mobile-app`

#### eas.json
- **Apple ID Email:** `toni@dailyhush.com` → `toni@noema.app`

---

### 2. **Legal Documents** (Required for App Store Compliance)

#### Privacy Policy
- ✅ `app/legal/privacy.tsx` - Updated all DailyHush references to Nœma
- ✅ `legal/PRIVACY_POLICY.md` - Updated markdown version
- ✅ Email contact: `hello@daily-hush.com` → `hello@noema.app`

#### Terms of Service
- ✅ `app/legal/terms.tsx` - Updated all DailyHush references to Nœma
- ✅ `legal/TERMS_OF_SERVICE.md` - Updated markdown version
- ✅ Company name updated throughout

---

### 3. **User-Facing Text** (All Screens)

#### Onboarding Screens
- ✅ `app/onboarding/index.tsx` - Welcome messages
- ✅ `app/onboarding/quiz/paywall.tsx` - Paywall copy
- ✅ All onboarding flows now say "Nœma"

#### Settings & Profile
- ✅ `app/settings.tsx` - Settings screen header and text
- ✅ `app/settings/subscription.tsx` - Subscription management
- ✅ `app/settings/delete-account.tsx` - Account deletion warnings
- ✅ `app/profile/edit.tsx` - Profile editing

#### Payment & Support
- ✅ `app/payment-failed.tsx` - Payment error messages
- ✅ `app/trial-expired.tsx` - Trial expiry screen
- ✅ `app/faq.tsx` - FAQ references

---

### 4. **Permission Descriptions** (iOS & Android)

#### iOS Info.plist Descriptions
- **Bluetooth:** "Nœma needs Bluetooth to connect with your Shift necklace..."
- **Microphone:** "Nœma needs microphone access for voice journaling..."
- **Notifications:** "Nœma sends daily mindful quotes to help you..."

#### Expo Plugin Permissions
- ✅ `expo-av` microphone permission text
- ✅ `react-native-ble-plx` Bluetooth permission text

---

### 5. **Code Comments & Documentation**

#### Updated Files (24 total):
- ✅ All component JSDoc comments
- ✅ All service file headers
- ✅ All hook documentation
- ✅ Type definition comments
- ✅ Configuration file comments

#### Documentation Files:
- ✅ `APP_STORE_COMPLIANCE.md`
- ✅ `AUDIT_REPORT_SUPABASE_SCHEMA.md`
- ✅ `LEGAL_PLACEMENT_COMPLIANCE_RESEARCH.md`
- ✅ `MVP_LAUNCH_AUDIT.md`
- ✅ `PROFILE_PAGE_VISION.md`
- ✅ `UX_AUDIT_MVP_LAUNCH.md`
- And 18 more documentation files

---

## ⚠️ CRITICAL NEXT STEPS

### 1. **Apple Developer Account**
Your bundle identifier changed from `com.dailyhush.mobile` to `com.noema.mobile`.

**Required Actions:**
1. Go to [Apple Developer](https://developer.apple.com/account/resources/identifiers/list)
2. Create NEW App ID: `com.noema.mobile`
3. Enable capabilities:
   - Push Notifications
   - Background Modes (audio, bluetooth-central)
   - Associated Domains (if using deep links)

4. Generate NEW certificates:
   - Distribution Certificate
   - Push Notification Certificate (APNs)

5. Create NEW Provisioning Profiles:
   - Development Profile
   - Distribution Profile

---

### 2. **App Store Connect**
Your app is now a different bundle ID, so it's technically a **new app** in Apple's eyes.

**Required Actions:**
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create NEW app entry:
   - Bundle ID: `com.noema.mobile`
   - App Name: **Nœma** (check availability!)
   - Primary Language: English
   - SKU: `noema-mobile-001`

3. Upload NEW app metadata:
   - Screenshots (can reuse if branding is minimal)
   - App Preview videos (if any)
   - Description (update with Nœma branding)
   - Keywords
   - Support URL: `https://noema.app/support`
   - Privacy Policy URL: `https://noema.app/privacy`

4. Get NEW `ascAppId` and update `eas.json`:
```json
"ascAppId": "YOUR_NEW_10_DIGIT_ID"
```

---

### 3. **Update External Services**

#### RevenueCat
- **Bundle ID changed!** RevenueCat tracks subscriptions by bundle ID
- Login to [RevenueCat Dashboard](https://app.revenuecat.com)
- Create NEW app configuration:
  - App Name: Nœma
  - iOS Bundle ID: `com.noema.mobile`
  - Android Package: `com.noema.mobile`
- Generate NEW API Keys:
  - `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (replace in `.env`)
  - `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` (replace in `.env`)

⚠️ **IMPORTANT:** Existing test purchases won't transfer. You'll need new test accounts.

---

#### PostHog Analytics
- Login to [PostHog](https://posthog.com)
- Update project name: DailyHush → Nœma
- **No action required** - API key remains the same

---

#### Supabase
- Login to [Supabase Dashboard](https://supabase.com/dashboard)
- Update project name: DailyHush → Nœma (cosmetic only)
- **No action required** - Database connections remain the same

---

### 4. **Domain & Email Setup**

#### Domain: noema.app
**Status:** Referenced in code but may not be registered yet

**Required Actions:**
1. Register domain: `noema.app` (or `noema.com`)
2. Set up email: `hello@noema.app`
3. Create support email: `support@noema.app`
4. Update DNS records:
   - MX records for email
   - A/AAAA records for website
   - TXT records for SPF/DKIM (email authentication)

#### Email Addresses Updated in Code:
- `hello@noema.app` (Privacy Policy contact)
- `support@noema.app` (Support requests)
- `toni@noema.app` (EAS submission Apple ID)

⚠️ **You'll need to use a valid Apple ID email for EAS submission!**

---

## 🧪 TESTING CHECKLIST

Before submitting to App Store, test thoroughly with the new branding:

### Test on Device
- [ ] App name shows as "Nœma" on home screen
- [ ] Deep links work with new scheme (`noema://`)
- [ ] Push notifications work (test with new APNs certificate)
- [ ] App Store Connect recognizes bundle ID

### Test in App
- [ ] All screens show "Nœma" not "DailyHush"
- [ ] Legal pages link to correct domain (`noema.app`)
- [ ] Support emails go to correct address
- [ ] Permission prompts show "Nœma" in descriptions

### Test Subscriptions (Critical!)
- [ ] RevenueCat SDK initializes with new keys
- [ ] Test purchase flow works
- [ ] Subscription status syncs correctly
- [ ] Trial tracking works

---

## 📦 BUILD & SUBMIT

Once you complete the critical next steps above:

### 1. Update Your `.env` File
```env
# RevenueCat NEW Keys (from new Nœma app configuration)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_NEW_KEY_HERE
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_NEW_KEY_HERE
```

### 2. Update `eas.json`
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-real-apple-id@email.com",
        "ascAppId": "YOUR_NEW_10_DIGIT_APP_STORE_CONNECT_ID",
        "appleTeamId": "YOUR_10_CHAR_TEAM_ID"
      }
    }
  }
}
```

### 3. Build for TestFlight
```bash
eas build --profile preview --platform ios
```

### 4. Submit to App Store
```bash
eas submit --platform ios
```

---

## 🎯 WHAT'S WORKING

**Good News:** The rebrand is complete in code! Here's what's ready:

✅ **App Configuration** - All technical identifiers updated
✅ **Legal Compliance** - Privacy Policy & Terms of Service updated
✅ **User Experience** - All visible text updated to Nœma
✅ **Code Quality** - Comments and documentation updated
✅ **Email Domain** - All references point to noema.app

**Status:** Ready for App Store submission **once you complete the external setup steps above**.

---

## 💡 WHY THE REBRAND?

**Nœma** (from Greek νόημα) means:
- **Thought** - Mental content, cognition
- **Meaning** - Understanding, interpretation
- **Perception** - How we experience the world

Perfect for an app focused on:
- Managing anxious thoughts
- Creating meaning from rumination
- Changing perception patterns

---

## 📞 SUPPORT RESOURCES

**Apple Developer Help:**
- App IDs: [developer.apple.com/account](https://developer.apple.com/account/resources/identifiers/list)
- Certificates: [developer.apple.com/account](https://developer.apple.com/account/resources/certificates/list)
- App Store Connect: [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

**EAS Build Help:**
- [docs.expo.dev/build-reference/app-credentials](https://docs.expo.dev/build-reference/app-credentials/)

**RevenueCat Help:**
- [docs.revenuecat.com/docs/configuring-sdk](https://docs.revenuecat.com/docs/configuring-sdk)

---

## ⏱️ TIME ESTIMATE

**To complete external setup:**
- Apple Developer setup: 1-2 hours
- App Store Connect setup: 1-2 hours
- RevenueCat reconfiguration: 30 minutes
- Domain & email setup: 1-2 hours (if buying new domain)
- Testing: 2-3 hours

**Total:** 6-10 hours to fully rebrand and relaunch

---

## 🚀 YOU'RE READY!

The code is rebranded. Now it's just paperwork and account setup.

**Next Action:** Start with Apple Developer Account → Create new App ID → Update `eas.json`

Good luck with the Nœma launch! 🌿✨
