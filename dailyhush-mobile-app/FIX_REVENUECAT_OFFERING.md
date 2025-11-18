# RevenueCat Offering Fix

## Symptom
On TestFlight, the paywall shows the alert `Setup Required – subscription options are not configured yet. Please check your RevenueCat dashboard.` and users cannot purchase Monthly/Annual/Lifetime plans.

## Root Cause
The build was signed with the **test** RevenueCat public SDK keys (`EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`). Test keys point to the sandbox project where the default offering is empty for the real product identifiers (`com.anthony.noema.monthly`, etc.). When the app calls `getOfferings()` (see `app/onboarding/quiz/paywall.tsx`), RevenueCat returns `null` and the guard triggers the alert.

## Fix Checklist
1. **Grab production keys**
   - RevenueCat Dashboard → *App Settings → API Keys → Public SDK keys*
   - Copy the iOS and Android **production** keys (not the test ones).

2. **Update the project configuration**
   - Replace the values in `.env` (or supply via EAS secrets)  
     ```
     EXPO_PUBLIC_REVENUECAT_IOS_KEY=<prod-ios-key>
     EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=<prod-android-key>
     ```
   - If using EAS secrets:  
     ```bash
     eas secret:create --scope project --type string \
       --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value <prod-ios-key>
     eas secret:create --scope project --type string \
       --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value <prod-android-key>
     ```

3. **Verify offering configuration**
   - RevenueCat → *Offerings* → ensure the **current** offering contains packages:
     | Package | Product ID |
     |---------|------------|
     | `$rc_monthly` | `com.anthony.noema.monthly` |
     | `$rc_annual`  | `com.anthony.noema.annual`  |
     | `$rc_lifetime` | `com.anthony.noema.lifetime` |
   - All three should be **Active** and mapped to the App Store products.

4. **Rebuild/Resubmit**
   - Re-run `eas build --platform ios --profile production`.
   - Submit the new build via `eas submit --platform ios --latest`.

## Validation
1. Install the TestFlight build.
2. Reach the paywall (`app/onboarding/quiz/paywall.tsx`).
3. Confirm the cards load with localized prices and the 7-day trial banner.
4. Purchasing should proceed without the “Setup Required” alert.
