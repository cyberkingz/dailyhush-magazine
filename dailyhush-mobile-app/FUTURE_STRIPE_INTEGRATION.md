# DailyHush - Future Stripe Integration Guide

## Complete Implementation Blueprint (Post-MVP)

**Status:** NOT IMPLEMENTED - FOR FUTURE USE
**Timeline:** Implement 3-6 months after MVP launch
**Prerequisites:** 5,000+ users, 40%+ retention, clear premium feature demand

---

## 1. SETUP CHECKLIST

### 1.1 Stripe Account Setup

```bash
# 1. Create Stripe account
Visit: https://dashboard.stripe.com/register

# 2. Get API keys (start with TEST mode)
Dashboard → Developers → API keys
- Publishable key: pk_test_...
- Secret key: sk_test_...

# 3. Create Products and Prices
Dashboard → Products → Add Product

Product 1: "DailyHush Premium Monthly"
- Price: $9.99/month
- Recurring: Monthly
- Copy Price ID: price_xxxxxx

Product 2: "DailyHush Premium Annual"
- Price: $99.99/year
- Recurring: Yearly
- Copy Price ID: price_yyyyyy

# 4. Set up webhook endpoint
Dashboard → Developers → Webhooks → Add endpoint
URL: https://your-project.supabase.co/functions/v1/stripe-webhook
Events to listen to:
  - checkout.session.completed
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
  - invoice.payment_succeeded
  - invoice.payment_failed

Copy Webhook Secret: whsec_...
```

### 1.2 Environment Variables

**Add to Supabase Edge Function secrets:**

```bash
# Set Stripe secrets (use Supabase CLI)
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Or via Supabase Dashboard:
# Project Settings → Edge Functions → Secrets
```

**Add to React Native app:**

```bash
# .env (for React Native)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### 1.3 Install Dependencies

```bash
# Mobile app
npm install @stripe/stripe-react-native

# Backend (Supabase Edge Function)
# Already has Stripe SDK built-in via Deno
```

---

## 2. DATABASE SCHEMA

### 2.1 Create Subscriptions Table

```sql
-- File: supabase/migrations/001_subscriptions.sql

-- Add stripe_customer_id to users table
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Subscription tier
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'trial', 'monthly', 'annual')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'incomplete')),

  -- Stripe identifiers
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,

  -- Billing periods
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,

  -- Cancellation tracking
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_user_subscription UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all subscriptions (for webhooks)
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Helper function to check if user is premium
CREATE OR REPLACE FUNCTION is_premium_user(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM subscriptions
    WHERE user_id = user_uuid
      AND tier IN ('monthly', 'annual')
      AND status IN ('active', 'trialing')
      AND (current_period_end IS NULL OR current_period_end > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2.2 Apply Migration

```bash
# Via Supabase CLI
supabase db push

# Or via Supabase Dashboard:
# SQL Editor → New Query → Paste SQL → Run
```

---

## 3. BACKEND API (Supabase Edge Functions)

### 3.1 Create Checkout Session

**File:** `supabase/functions/stripe-create-checkout-session/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface CheckoutRequest {
  priceId: string;
  userId: string;
}

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { priceId, userId }: CheckoutRequest = await req.json();

    if (!priceId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing priceId or userId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user email from Supabase Auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user already has a Stripe customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let customerId = subscription?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create(
        {
          email: user.email,
          metadata: {
            user_id: userId,
          },
        },
        {
          idempotencyKey: `customer-${userId}`,
        }
      );

      customerId = customer.id;

      // Store customer ID in Supabase
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        tier: 'free',
        status: 'active',
      });
    }

    // Determine success/cancel URLs based on mobile deep linking
    const successUrl = 'dailyhush://subscription/success?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = 'dailyhush://subscription/cancel';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(
      {
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: {
            user_id: userId,
          },
          trial_period_days: 7, // 7-day free trial
        },
        allow_promotion_codes: true,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          user_id: userId,
        },
      },
      {
        idempotencyKey: `checkout-${userId}-${Date.now()}`,
      }
    );

    return new Response(
      JSON.stringify({
        checkoutUrl: session.url,
        sessionId: session.id,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Stripe checkout error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create checkout session',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
```

### 3.2 Webhook Handler

**File:** `supabase/functions/stripe-webhook/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`Processing webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded for invoice:', invoice.id);
        // Could send success email here
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;

  if (!userId) {
    console.error('No user_id in checkout session metadata');
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // Fetch full subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const tierMap: Record<string, string> = {
    [Deno.env.get('STRIPE_PRICE_MONTHLY_ID')!]: 'monthly',
    [Deno.env.get('STRIPE_PRICE_ANNUAL_ID')!]: 'annual',
  };

  const priceId = subscription.items.data[0]?.price.id;
  const tier = tierMap[priceId] || 'monthly';

  await supabase.from('subscriptions').upsert({
    user_id: userId,
    tier,
    status: subscription.status as string,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_price_id: priceId,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
  });

  console.log(`Subscription created for user ${userId}: ${tier}`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  const tierMap: Record<string, string> = {
    [Deno.env.get('STRIPE_PRICE_MONTHLY_ID')!]: 'monthly',
    [Deno.env.get('STRIPE_PRICE_ANNUAL_ID')!]: 'annual',
  };

  const priceId = subscription.items.data[0]?.price.id;
  const tier = tierMap[priceId] || 'monthly';

  await supabase
    .from('subscriptions')
    .update({
      tier,
      status: subscription.status as string,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
    })
    .eq('stripe_subscription_id', subscription.id);

  console.log(`Subscription updated for user ${userId}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await supabase
    .from('subscriptions')
    .update({
      tier: 'free',
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  console.log(`Subscription canceled: ${subscription.id}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
    })
    .eq('stripe_subscription_id', subscriptionId);

  console.log(`Payment failed for subscription: ${subscriptionId}`);
  // TODO: Send email notification to user
}
```

### 3.3 Customer Portal Session

**File:** `supabase/functions/stripe-create-portal-session/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get customer ID from Supabase
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (!subscription?.stripe_customer_id) {
      return new Response(JSON.stringify({ error: 'No Stripe customer found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: 'dailyhush://settings',
    });

    return new Response(JSON.stringify({ portalUrl: session.url }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Portal session error:', error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
```

### 3.4 Deploy Edge Functions

```bash
# Deploy all functions at once
supabase functions deploy stripe-create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy stripe-create-portal-session

# Or deploy all at once
supabase functions deploy
```

---

## 4. MOBILE APP INTEGRATION

### 4.1 Update App Layout

**File:** `app/_layout.tsx`

```typescript
import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.dailyhush.app" // Replace with your Apple Merchant ID
      urlScheme="dailyhush" // For deep linking
    >
      {/* Rest of your app */}
      <Stack>
        {/* ... existing screens */}
      </Stack>
    </StripeProvider>
  );
}
```

### 4.2 Rebuild utils/stripe.ts

**File:** `utils/stripe.ts`

```typescript
import { supabase } from './supabase';

export const STRIPE_PRICES = {
  PREMIUM_MONTHLY: 'price_xxxxx', // Replace with actual Price ID from Stripe Dashboard
  PREMIUM_ANNUAL: 'price_yyyyy', // Replace with actual Price ID from Stripe Dashboard
};

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  TRIAL: 'trial',
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
} as const;

export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[keyof typeof SUBSCRIPTION_TIERS];

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_period_end?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  cancel_at_period_end?: boolean;
}

/**
 * Get user's current subscription from Supabase
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data as SubscriptionInfo;
  } catch (err) {
    console.error('Error in getUserSubscription:', err);
    return null;
  }
}

/**
 * Create Stripe Checkout Session
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string
): Promise<string | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/stripe-create-checkout-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId, priceId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    return data.checkoutUrl;
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return null;
  }
}

/**
 * Create Customer Portal Session
 */
export async function createPortalSession(userId: string): Promise<string | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/stripe-create-portal-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create portal session');
    }

    return data.portalUrl;
  } catch (err) {
    console.error('Error creating portal session:', err);
    return null;
  }
}

/**
 * Check if user has active premium subscription
 */
export function isPremiumUser(subscription: SubscriptionInfo | null): boolean {
  if (!subscription) return false;

  const isPremiumTier =
    subscription.tier === SUBSCRIPTION_TIERS.MONTHLY ||
    subscription.tier === SUBSCRIPTION_TIERS.ANNUAL ||
    subscription.tier === SUBSCRIPTION_TIERS.TRIAL;

  const isActiveStatus = subscription.status === 'active' || subscription.status === 'trialing';

  return isPremiumTier && isActiveStatus;
}

/**
 * Get subscription benefits
 */
export function getSubscriptionBenefits(tier: SubscriptionTier) {
  const benefits = {
    [SUBSCRIPTION_TIERS.FREE]: [
      '90-second spiral interrupts',
      'Basic F.I.R.E. training',
      'Weekly pattern insights',
      'Limited history (30 days)',
    ],
    [SUBSCRIPTION_TIERS.TRIAL]: [
      'Everything in Free',
      '7-day free trial',
      'Advanced AI insights',
      'Unlimited history',
    ],
    [SUBSCRIPTION_TIERS.MONTHLY]: [
      'Everything in Free',
      'Advanced AI insights',
      'Daily predictions',
      'Custom reframes',
      'Export reports for therapist',
      'Unlimited history',
      '3AM Mode premium features',
      'Priority support',
    ],
    [SUBSCRIPTION_TIERS.ANNUAL]: [
      'Everything in Premium',
      '2 months free (annual billing)',
      'Early access to new features',
    ],
  };

  return benefits[tier] || benefits[SUBSCRIPTION_TIERS.FREE];
}

/**
 * Format subscription price
 */
export function formatPrice(tier: SubscriptionTier): string {
  const prices = {
    [SUBSCRIPTION_TIERS.FREE]: 'Free',
    [SUBSCRIPTION_TIERS.TRIAL]: 'Free for 7 days',
    [SUBSCRIPTION_TIERS.MONTHLY]: '$9.99/month',
    [SUBSCRIPTION_TIERS.ANNUAL]: '$99.99/year (save $20)',
  };

  return prices[tier] || 'Free';
}
```

### 4.3 Rebuild subscription.tsx

**File:** `app/subscription.tsx`

```typescript
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { useNightMode, useUser } from '@/store/useStore';
import {
  getUserSubscription,
  isPremiumUser,
  getSubscriptionBenefits,
  formatPrice,
  SUBSCRIPTION_TIERS,
  STRIPE_PRICES,
  createCheckoutSession,
  createPortalSession,
  type SubscriptionInfo,
  type SubscriptionTier,
} from '@/utils/stripe';

export default function Subscription() {
  const router = useRouter();
  const user = useUser();
  const nightMode = useNightMode();

  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SUBSCRIPTION_TIERS.MONTHLY);

  const backgroundColor = nightMode ? Colors.nightMode.background : Colors.background.primary;
  const textColor = nightMode ? Colors.nightMode.text : Colors.neutral.neutral50;

  useEffect(() => {
    loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;

    setIsLoading(true);
    const subInfo = await getUserSubscription(user.user_id);
    setSubscription(subInfo);
    setIsLoading(false);
  };

  const handleUpgrade = async (tier: SubscriptionTier) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!user) {
      alert('Please log in to upgrade');
      return;
    }

    const priceId =
      tier === SUBSCRIPTION_TIERS.ANNUAL
        ? STRIPE_PRICES.PREMIUM_ANNUAL
        : STRIPE_PRICES.PREMIUM_MONTHLY;

    // Create Stripe Checkout Session
    const checkoutUrl = await createCheckoutSession(user.user_id, priceId);

    if (checkoutUrl) {
      // Open Stripe Checkout in web browser
      await Linking.openURL(checkoutUrl);
    } else {
      alert('Failed to create checkout session. Please try again.');
    }
  };

  const handleManageSubscription = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!user) return;

    // Open Stripe Customer Portal
    const portalUrl = await createPortalSession(user.user_id);

    if (portalUrl) {
      await Linking.openURL(portalUrl);
    } else {
      alert('Failed to open billing portal. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary.emerald600} />
      </View>
    );
  }

  const isPremium = isPremiumUser(subscription);
  const currentTier = subscription?.tier || SUBSCRIPTION_TIERS.FREE;

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={{
          padding: Spacing.lg,
          paddingTop: Spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: Spacing.md }}>
          <Text style={{ fontSize: Typography.fontSize.body, color: Colors.primary.emerald600 }}>
            ‹ Back
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: Typography.fontSize.heading1,
            fontWeight: Typography.fontWeight.bold as any,
            color: textColor,
            marginBottom: Spacing.sm,
          }}
        >
          Subscription
        </Text>

        <Text
          style={{
            fontSize: Typography.fontSize.body,
            color: nightMode ? Colors.nightMode.textMuted : Colors.neutral.neutral300,
            marginBottom: Spacing.xl,
          }}
        >
          {isPremium
            ? 'You have access to all Premium features'
            : 'Unlock advanced insights and export reports'}
        </Text>

        {/* Current Plan */}
        {isPremium && (
          <View
            style={{
              backgroundColor: Colors.success.green100,
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.xl,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
              <Text style={{ fontSize: 24, marginRight: Spacing.sm }}>✨</Text>
              <Text
                style={{
                  fontSize: Typography.fontSize.heading3,
                  fontWeight: Typography.fontWeight.bold as any,
                  color: Colors.neutral.neutral50,
                }}
              >
                Premium Active
              </Text>
            </View>
            <Text
              style={{
                fontSize: Typography.fontSize.body,
                color: Colors.neutral.neutral300,
                marginBottom: Spacing.md,
              }}
            >
              {currentTier === SUBSCRIPTION_TIERS.ANNUAL ? 'Annual Plan' : 'Monthly Plan'}
            </Text>
            {subscription?.current_period_end && (
              <Text style={{ fontSize: Typography.fontSize.caption, color: Colors.text.slate600 }}>
                Renews {new Date(subscription.current_period_end).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}

        {/* Pricing Cards */}
        <View style={{ marginBottom: Spacing.xl }}>
          {/* Monthly Plan */}
          <TouchableOpacity
            onPress={() => setSelectedTier(SUBSCRIPTION_TIERS.MONTHLY)}
            disabled={currentTier === SUBSCRIPTION_TIERS.MONTHLY}
            activeOpacity={0.8}
            style={{
              backgroundColor:
                selectedTier === SUBSCRIPTION_TIERS.MONTHLY
                  ? Colors.primary.emerald50
                  : nightMode
                  ? Colors.nightMode.surface
                  : '#FFFFFF',
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
              borderWidth: 3,
              borderColor:
                selectedTier === SUBSCRIPTION_TIERS.MONTHLY
                  ? Colors.primary.emerald600
                  : 'transparent',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: Typography.fontSize.heading3,
                    fontWeight: Typography.fontWeight.bold as any,
                    color: textColor,
                    marginBottom: Spacing.xs,
                  }}
                >
                  Premium Monthly
                </Text>
                <Text
                  style={{
                    fontSize: Typography.fontSize.heading2,
                    fontWeight: Typography.fontWeight.bold as any,
                    color: Colors.primary.emerald600,
                  }}
                >
                  {formatPrice(SUBSCRIPTION_TIERS.MONTHLY)}
                </Text>
              </View>
              {currentTier === SUBSCRIPTION_TIERS.MONTHLY && (
                <View
                  style={{
                    backgroundColor: Colors.primary.emerald600,
                    borderRadius: BorderRadius.sm,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                  }}
                >
                  <Text
                    style={{
                      fontSize: Typography.fontSize.caption,
                      fontWeight: Typography.fontWeight.bold as any,
                      color: '#FFFFFF',
                    }}
                  >
                    Current
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Annual Plan */}
          <TouchableOpacity
            onPress={() => setSelectedTier(SUBSCRIPTION_TIERS.ANNUAL)}
            disabled={currentTier === SUBSCRIPTION_TIERS.ANNUAL}
            activeOpacity={0.8}
            style={{
              backgroundColor:
                selectedTier === SUBSCRIPTION_TIERS.ANNUAL
                  ? Colors.primary.emerald50
                  : nightMode
                  ? Colors.nightMode.surface
                  : '#FFFFFF',
              borderRadius: BorderRadius.md,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
              borderWidth: 3,
              borderColor:
                selectedTier === SUBSCRIPTION_TIERS.ANNUAL
                  ? Colors.primary.emerald600
                  : 'transparent',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
                  <Text
                    style={{
                      fontSize: Typography.fontSize.heading3,
                      fontWeight: Typography.fontWeight.bold as any,
                      color: textColor,
                      marginRight: Spacing.sm,
                    }}
                  >
                    Premium Annual
                  </Text>
                  <View
                    style={{
                      backgroundColor: Colors.secondary.amber500,
                      borderRadius: BorderRadius.xs,
                      paddingHorizontal: Spacing.xs,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Typography.fontSize.caption,
                        fontWeight: Typography.fontWeight.bold as any,
                        color: '#FFFFFF',
                      }}
                    >
                      SAVE $20
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: Typography.fontSize.heading2,
                    fontWeight: Typography.fontWeight.bold as any,
                    color: Colors.primary.emerald600,
                  }}
                >
                  {formatPrice(SUBSCRIPTION_TIERS.ANNUAL)}
                </Text>
              </View>
              {currentTier === SUBSCRIPTION_TIERS.ANNUAL && (
                <View
                  style={{
                    backgroundColor: Colors.primary.emerald600,
                    borderRadius: BorderRadius.sm,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                  }}
                >
                  <Text
                    style={{
                      fontSize: Typography.fontSize.caption,
                      fontWeight: Typography.fontWeight.bold as any,
                      color: '#FFFFFF',
                    }}
                  >
                    Current
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Benefits List */}
        <View
          style={{
            backgroundColor: nightMode ? Colors.nightMode.surface : '#FFFFFF',
            borderRadius: BorderRadius.md,
            padding: Spacing.lg,
            marginBottom: Spacing.xl,
          }}
        >
          <Text
            style={{
              fontSize: Typography.fontSize.heading3,
              fontWeight: Typography.fontWeight.bold as any,
              color: textColor,
              marginBottom: Spacing.md,
            }}
          >
            Premium Benefits
          </Text>

          {getSubscriptionBenefits(SUBSCRIPTION_TIERS.MONTHLY).map((benefit, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom:
                  index < getSubscriptionBenefits(SUBSCRIPTION_TIERS.MONTHLY).length - 1
                    ? Spacing.sm
                    : 0,
              }}
            >
              <Text
                style={{
                  fontSize: Typography.fontSize.body,
                  color: Colors.primary.emerald600,
                  marginRight: Spacing.sm,
                }}
              >
                ✓
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: Typography.fontSize.body,
                  color: nightMode ? Colors.nightMode.textMuted : Colors.neutral.neutral300,
                  lineHeight: Typography.lineHeight.body * Typography.fontSize.body,
                }}
              >
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        {!isPremium ? (
          <TouchableOpacity
            onPress={() => handleUpgrade(selectedTier)}
            style={{
              backgroundColor: Colors.primary.emerald600,
              borderRadius: BorderRadius.lg,
              padding: Spacing.lg,
              alignItems: 'center',
              minHeight: 64,
              justifyContent: 'center',
              marginBottom: Spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSize.button,
                fontWeight: Typography.fontWeight.bold as any,
                color: '#FFFFFF',
              }}
            >
              Start 7-Day Free Trial
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleManageSubscription}
            style={{
              backgroundColor: nightMode ? Colors.nightMode.surface : '#FFFFFF',
              borderRadius: BorderRadius.lg,
              padding: Spacing.lg,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: Colors.primary.emerald600,
              marginBottom: Spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: Typography.fontSize.button,
                fontWeight: Typography.fontWeight.bold as any,
                color: Colors.primary.emerald600,
              }}
            >
              Manage Subscription
            </Text>
          </TouchableOpacity>
        )}

        {/* Fine Print */}
        <Text
          style={{
            fontSize: Typography.fontSize.caption,
            color: nightMode ? Colors.nightMode.textMuted : Colors.text.slate500,
            textAlign: 'center',
            lineHeight: Typography.lineHeight.caption * Typography.fontSize.caption,
          }}
        >
          7-day free trial, then ${selectedTier === SUBSCRIPTION_TIERS.ANNUAL ? '99.99/year' : '9.99/month'}.
          Cancel anytime. Secure payments via Stripe.
        </Text>
      </ScrollView>
    </View>
  );
}
```

---

## 5. TESTING

### 5.1 Test Cards (Stripe Test Mode)

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 9995
3D Secure: 4000 0027 6000 3184
Insufficient Funds: 4000 0000 0000 9995
```

### 5.2 Test Checklist

- [ ] Create checkout session successfully
- [ ] Complete payment with test card 4242 4242 4242 4242
- [ ] Verify webhook received (check Supabase Edge Function logs)
- [ ] Check subscription appears in Supabase `subscriptions` table
- [ ] Verify user sees "Premium Active" badge
- [ ] Test canceling subscription via Customer Portal
- [ ] Verify subscription status updates to "canceled"
- [ ] Test declined payment (card 4000 0000 0000 9995)
- [ ] Test 3D Secure flow (card 4000 0027 6000 3184)
- [ ] Verify free trial (subscription should show `status: 'trialing'`)

---

## 6. GO-LIVE CHECKLIST

### 6.1 Switch to Live Mode

```bash
# 1. Get LIVE API keys from Stripe Dashboard
# Dashboard → Developers → API keys → LIVE mode

# 2. Update Supabase secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_live_xxxxx

# 3. Update mobile app .env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# 4. Create LIVE webhook endpoint
Dashboard → Webhooks → Add endpoint
URL: https://your-project.supabase.co/functions/v1/stripe-webhook
Set to LIVE mode

# 5. Create LIVE products and prices
Dashboard → Products → Add Product (LIVE mode)
Update STRIPE_PRICES in utils/stripe.ts with LIVE price IDs
```

### 6.2 Pre-Launch Checklist

- [ ] Stripe account verified (business details submitted)
- [ ] Bank account connected for payouts
- [ ] Customer portal configured (Dashboard → Settings → Customer Portal)
- [ ] Refund policy set (30-day refund window)
- [ ] Tax settings configured (if applicable)
- [ ] Webhook endpoint verified (sends test events)
- [ ] Mobile app tested in production build (not Expo Go)
- [ ] Apple In-App Purchase compliance checked (if applicable)
- [ ] Privacy policy updated with Stripe language
- [ ] Terms of service include subscription terms

---

**Last Updated:** October 24, 2025
**Status:** READY FOR IMPLEMENTATION (Post-MVP)
**Estimated Implementation Time:** 3-5 days
