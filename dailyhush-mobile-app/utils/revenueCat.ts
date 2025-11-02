/**
 * DailyHush - RevenueCat SDK Configuration & Utilities
 * Handles subscription management, purchases, and entitlements
 * Created: 2025-11-01
 */

import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat PUBLIC SDK Keys (from .env)
// NOTE: These are PUBLIC keys (appl_xxx or goog_xxx), NOT the secret key (sk_xxx)
// The secret key is for server-side only and should NEVER be in the mobile app
const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '';

// Entitlement identifier (matches RevenueCat dashboard)
export const PREMIUM_ENTITLEMENT_ID = 'premium';

// Package identifiers (matches RevenueCat dashboard)
export const PACKAGE_IDS = {
  MONTHLY: '$rc_monthly',
  ANNUAL: '$rc_annual',
  LIFETIME: '$rc_lifetime', // RevenueCat default lifetime identifier
} as const;

// Track if RevenueCat has been initialized
let isRevenueCatInitialized = false;

/**
 * Initialize RevenueCat SDK
 * Call this once at app startup
 * Safe to call multiple times - will only configure once
 */
export async function initializeRevenueCat(userId?: string): Promise<void> {
  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

    if (!apiKey) {
      console.error('RevenueCat API key not found. Check your .env configuration.');
      return;
    }

    // Only configure once
    if (!isRevenueCatInitialized) {
      // Configure SDK
      Purchases.configure({ apiKey });

      // Enable debug logs in development
      if (__DEV__) {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      }

      isRevenueCatInitialized = true;
      console.log('RevenueCat initialized successfully');
    }

    // Set user ID if authenticated (safe to call multiple times)
    if (userId) {
      await Purchases.logIn(userId);
      console.log('RevenueCat: User logged in:', userId);
    }
  } catch (error) {
    console.error('Error initializing RevenueCat:', error);
    throw error;
  }
}

/**
 * Get current offerings (subscription packages)
 * Returns monthly, annual, and lifetime options with localized pricing
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();

    if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
      console.log('RevenueCat: Loaded offerings:', offerings.current.identifier);
      return offerings.current;
    }

    console.warn('RevenueCat: No offerings available');
    return null;
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return null;
  }
}

/**
 * Purchase a subscription package
 * Handles the purchase flow and returns customer info
 */
export async function purchasePackage(
  packageToPurchase: PurchasesPackage
): Promise<{ customerInfo: CustomerInfo; userCancelled: boolean }> {
  try {
    const { customerInfo, productIdentifier } = await Purchases.purchasePackage(packageToPurchase);

    console.log('RevenueCat: Purchase successful:', productIdentifier);
    return { customerInfo, userCancelled: false };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('RevenueCat: User cancelled purchase');
      return { customerInfo: error.customerInfo, userCancelled: true };
    }

    console.error('RevenueCat: Purchase error:', error);
    throw error;
  }
}

/**
 * Restore previous purchases
 * Useful for users who reinstalled the app or switched devices
 */
export async function restorePurchases(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    console.log('RevenueCat: Purchases restored');
    return customerInfo;
  } catch (error) {
    console.error('Error restoring purchases:', error);
    throw error;
  }
}

/**
 * Check if user has active Premium subscription
 * Returns comprehensive subscription details including billing issues
 */
export async function checkPremiumStatus(): Promise<{
  isPremium: boolean;
  expirationDate: string | null;
  willRenew: boolean;
  billingIssueDetectedAt: string | null;
  gracePeriodExpiresAt: string | null;
  isInGracePeriod: boolean;
  isTrial: boolean;
  planIdentifier: string | null;
  priceString: string | null;
  period: string | null;
}> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const premiumEntitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];

    if (premiumEntitlement) {
      // Check if in trial
      const isTrial =
        premiumEntitlement.periodType === 'TRIAL' || premiumEntitlement.periodType === 'INTRO';

      // Check for billing issues
      const billingIssueDetectedAt = premiumEntitlement.billingIssueDetectedAt || null;
      const gracePeriodExpiresAt = billingIssueDetectedAt
        ? premiumEntitlement.expirationDate
        : null;
      const isInGracePeriod = billingIssueDetectedAt !== null;

      // Get plan details
      const productIdentifier = premiumEntitlement.productIdentifier;
      let planIdentifier = null;
      let period = null;

      if (productIdentifier?.includes('monthly') || productIdentifier?.includes('month')) {
        planIdentifier = PACKAGE_IDS.MONTHLY;
        period = '/month';
      } else if (productIdentifier?.includes('annual') || productIdentifier?.includes('year')) {
        planIdentifier = PACKAGE_IDS.ANNUAL;
        period = '/year';
      } else if (productIdentifier?.includes('lifetime')) {
        planIdentifier = PACKAGE_IDS.LIFETIME;
        period = 'one-time';
      }

      return {
        isPremium: true,
        expirationDate: premiumEntitlement.expirationDate,
        willRenew: premiumEntitlement.willRenew,
        billingIssueDetectedAt,
        gracePeriodExpiresAt,
        isInGracePeriod,
        isTrial,
        planIdentifier,
        priceString: null, // Not available from entitlement, would need to fetch from offerings
        period,
      };
    }

    return {
      isPremium: false,
      expirationDate: null,
      willRenew: false,
      billingIssueDetectedAt: null,
      gracePeriodExpiresAt: null,
      isInGracePeriod: false,
      isTrial: false,
      planIdentifier: null,
      priceString: null,
      period: null,
    };
  } catch (error) {
    console.error('Error checking Premium status:', error);
    return {
      isPremium: false,
      expirationDate: null,
      willRenew: false,
      billingIssueDetectedAt: null,
      gracePeriodExpiresAt: null,
      isInGracePeriod: false,
      isTrial: false,
      planIdentifier: null,
      priceString: null,
      period: null,
    };
  }
}

/**
 * Log in a user to RevenueCat
 * Call this after successful authentication
 */
export async function loginRevenueCatUser(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
    console.log('RevenueCat: User logged in:', userId);
  } catch (error) {
    console.error('Error logging in RevenueCat user:', error);
    throw error;
  }
}

/**
 * Log out current user
 * Call this when user signs out of the app
 */
export async function logoutRevenueCatUser(): Promise<void> {
  try {
    await Purchases.logOut();
    console.log('RevenueCat: User logged out');
  } catch (error) {
    console.error('Error logging out RevenueCat user:', error);
    throw error;
  }
}

/**
 * Convert RevenueCat package to our SubscriptionPlan format
 * Handles international pricing automatically via RevenueCat's localized strings
 */
export function packageToSubscriptionPlan(
  pkg: PurchasesPackage,
  badge?: string,
  savings?: string
): {
  id: string;
  title: string;
  price: string;
  priceValue: number;
  period: string;
  badge?: string;
  savings?: string;
  description: string;
  package: PurchasesPackage;
} {
  const product = pkg.product;

  // Determine package type and metadata
  let title = 'Premium';
  let period = '';
  let description = '';
  let displayPrice = product.priceString;

  if (pkg.identifier === PACKAGE_IDS.MONTHLY) {
    title = 'Monthly';
    period = '/month';
    description = 'Perfect for trying Premium';
  } else if (pkg.identifier === PACKAGE_IDS.ANNUAL) {
    title = 'Annual';
    // Calculate monthly equivalent for display
    const monthlyEquivalent = product.price / 12;
    // Extract currency symbol from original price string
    const currencyMatch = product.priceString.match(/^[^0-9.,]+/);
    const currencySymbol = currencyMatch ? currencyMatch[0] : '$';
    displayPrice = `${currencySymbol}${monthlyEquivalent.toFixed(2)}`;
    period = '/month';
    description = `Billed ${product.priceString} annually`;
  } else if (pkg.identifier === PACKAGE_IDS.LIFETIME) {
    title = 'Lifetime';
    period = 'one-time';
    description = 'Never pay again';
  }

  return {
    id: pkg.identifier,
    title,
    price: displayPrice, // For annual: show monthly equivalent instead of yearly price
    priceValue: product.price, // Keep original numeric value for sorting/logic
    period,
    badge,
    savings,
    description,
    package: pkg, // Include original package for purchase
  };
}

/**
 * Get recommended package identifiers based on savings
 * Returns which packages should have "MOST POPULAR" or "BEST VALUE" badges
 */
export function getRecommendedPackages(packages: PurchasesPackage[]): {
  mostPopular: string | null;
  bestValue: string | null;
} {
  // Find annual and lifetime packages
  const annual = packages.find((p) => p.identifier === PACKAGE_IDS.ANNUAL);
  const lifetime = packages.find((p) => p.identifier === PACKAGE_IDS.LIFETIME);

  return {
    mostPopular: annual ? annual.identifier : null,
    bestValue: lifetime ? lifetime.identifier : null,
  };
}

/**
 * Calculate savings percentage for annual plan vs monthly
 */
export function calculateAnnualSavings(
  monthlyPackage: PurchasesPackage,
  annualPackage: PurchasesPackage
): string | null {
  try {
    const monthlyPrice = monthlyPackage.product.price;
    const annualPrice = annualPackage.product.price;
    const monthlyYearlyCost = monthlyPrice * 12;
    const savings = ((monthlyYearlyCost - annualPrice) / monthlyYearlyCost) * 100;

    return `Save ${Math.round(savings)}%`;
  } catch (error) {
    console.error('Error calculating savings:', error);
    return null;
  }
}
