/**
 * DailyHush - Products API Service
 *
 * Handles all API interactions for products and commerce including:
 * - Product recommendations (personalized by loop type)
 * - Product catalog fetching
 * - Click tracking for analytics
 * - Purchase tracking
 */

import { supabase } from '@/utils/supabase';
import type { Tables } from '@/types/supabase';

/**
 * Product with recommendation metadata
 */
export interface RecommendedProduct extends Tables<'products'> {
  recommendation?: {
    score: number;
    reason: string;
    priority: number;
  };
}

/**
 * Get recommended products for the current user
 * Personalized based on loop type, purchase history, and engagement
 */
export async function getRecommendedProducts(limit: number = 4): Promise<RecommendedProduct[]> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting user:', authError);
      return [];
    }

    // Get user profile to determine loop type
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('loop_type, premium_trial_active')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return [];
    }

    // Get existing recommendations from database
    const { data: recommendations, error: recsError } = await supabase
      .from('product_recommendations')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', user.id)
      .eq('is_clicked', false)
      .order('recommendation_score', { ascending: false })
      .limit(limit);

    if (recsError) {
      console.error('Error fetching recommendations:', recsError);
    }

    // If we have recommendations, return them
    if (recommendations && recommendations.length > 0) {
      return recommendations.map((rec) => ({
        ...(rec.products as Tables<'products'>),
        recommendation: {
          score: rec.recommendation_score,
          reason: rec.recommendation_reason,
          priority: rec.display_priority,
        },
      }));
    }

    // Otherwise, generate recommendations based on loop type
    return await generateRecommendations(user.id, userProfile.loop_type, userProfile.premium_trial_active, limit);
  } catch (error) {
    console.error('Error getting recommended products:', error);
    return [];
  }
}

/**
 * Generate product recommendations based on loop type
 * Fallback when no database recommendations exist
 */
async function generateRecommendations(
  userId: string,
  loopType: string | null,
  isPremium: boolean,
  limit: number
): Promise<RecommendedProduct[]> {
  try {
    // Build query based on loop type and premium status
    let query = supabase.from('products').select('*').eq('is_active', true);

    // Filter by loop type if available
    if (loopType) {
      query = query.contains('loop_types', [loopType]);
    }

    // Exclude premium products if user is not premium
    if (!isPremium) {
      query = query.neq('slug', 'premium-membership');
    }

    // Order by featured first, then by sales
    query = query.order('is_featured', { ascending: false }).order('total_sales', { ascending: false }).limit(limit);

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    // Create recommendations in database for future tracking
    if (products && products.length > 0) {
      await createRecommendations(userId, products);
    }

    return (products || []).map((product, index) => ({
      ...product,
      recommendation: {
        score: 1.0 - index * 0.1, // Descending score
        reason: loopType ? `Recommended for ${loopType}` : 'Popular product',
        priority: index + 1,
      },
    }));
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
}

/**
 * Create recommendation records in database
 */
async function createRecommendations(
  userId: string,
  products: Tables<'products'>[]
): Promise<void> {
  try {
    const recommendations = products.map((product, index) => ({
      user_id: userId,
      product_id: product.id,
      recommendation_score: 1.0 - index * 0.1,
      recommendation_reason: 'Personalized recommendation',
      display_priority: index + 1,
    }));

    const { error } = await supabase.from('product_recommendations').insert(recommendations);

    if (error) {
      console.error('Error creating recommendations:', error);
    }
  } catch (error) {
    console.error('Error creating recommendations:', error);
  }
}

/**
 * Track product click for analytics
 * Updates recommendation record and fires analytics event
 */
export async function trackProductClick(productId: string, source: 'profile' | 'recommendations' | 'search'): Promise<void> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting user:', authError);
      return;
    }

    // Update recommendation record if exists
    const { error: updateError } = await supabase
      .from('product_recommendations')
      .update({
        is_clicked: true,
        clicked_at: new Date().toISOString(),
        click_source: source,
      })
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .is('clicked_at', null); // Only update if not already clicked

    if (updateError) {
      console.error('Error updating recommendation:', updateError);
    }

    // TODO: Fire analytics event (e.g., Mixpanel, Amplitude)
    console.log('Product clicked:', { userId: user.id, productId, source });
  } catch (error) {
    console.error('Error tracking product click:', error);
  }
}

/**
 * Get all active products
 * For browse/catalog view
 */
export async function getAllProducts(): Promise<Tables<'products'>[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('total_sales', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get a single product by ID or slug
 */
export async function getProduct(idOrSlug: string): Promise<Tables<'products'> | null> {
  try {
    // Try by ID first
    let query = supabase.from('products').select('*').eq('id', idOrSlug).single();

    let { data, error } = await query;

    // If not found by ID, try by slug
    if (error && error.code === 'PGRST116') {
      query = supabase.from('products').select('*').eq('slug', idOrSlug).single();
      const result = await query;
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Get products by loop type
 */
export async function getProductsByLoopType(loopType: string): Promise<Tables<'products'>[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .contains('loop_types', [loopType])
      .order('is_featured', { ascending: false })
      .order('total_sales', { ascending: false });

    if (error) {
      console.error('Error fetching products by loop type:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching products by loop type:', error);
    return [];
  }
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 6): Promise<Tables<'products'>[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('total_sales', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

/**
 * Track purchase completion
 * Called after successful Stripe payment
 */
export async function trackPurchase(
  productId: string,
  purchaseData: {
    stripe_payment_intent_id: string;
    amount_cents: number;
    currency: string;
  }
): Promise<boolean> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting user:', authError);
      return false;
    }

    // Create purchase record
    const { error: purchaseError } = await supabase.from('purchases').insert({
      user_id: user.id,
      product_id: productId,
      stripe_payment_intent_id: purchaseData.stripe_payment_intent_id,
      amount_cents: purchaseData.amount_cents,
      currency: purchaseData.currency,
      status: 'completed',
    });

    if (purchaseError) {
      console.error('Error tracking purchase:', purchaseError);
      return false;
    }

    // Update recommendation record if it exists
    await supabase
      .from('product_recommendations')
      .update({
        is_purchased: true,
        purchased_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('product_id', productId);

    return true;
  } catch (error) {
    console.error('Error tracking purchase:', error);
    return false;
  }
}

/**
 * Get user's purchase history
 */
export async function getPurchaseHistory(): Promise<Tables<'purchases'>[]> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting user:', authError);
      return [];
    }

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching purchase history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return [];
  }
}
