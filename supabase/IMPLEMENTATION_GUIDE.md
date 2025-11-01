# DailyHush Profile Page - Implementation Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [TypeScript Integration](#typescript-integration)
3. [React Hooks & Components](#react-hooks--components)
4. [Supabase Client Setup](#supabase-client-setup)
5. [Common Workflows](#common-workflows)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Testing Strategy](#testing-strategy)

---

## Quick Start

### 1. Apply Migration

```bash
# Using Supabase CLI (local)
supabase db reset

# Or apply specific migration
supabase db push

# Or run in Supabase Dashboard SQL Editor
# Copy contents of 20250101000000_profile_page_schema.sql
```

### 2. Generate TypeScript Types

```bash
# Generate types from your Supabase schema
supabase gen types typescript --local > src/types/supabase.ts

# Or for remote project
supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
```

### 3. Install Dependencies

```bash
npm install @supabase/supabase-js
npm install -D @supabase/auth-helpers-react # Optional for React hooks
```

---

## TypeScript Integration

### Database Types (Auto-generated)

```typescript
// src/types/supabase.ts (generated)
export type Database = {
  public: {
    Tables: {
      user_check_ins: {
        Row: {
          id: string
          user_id: string
          mood_rating: number
          emotional_weather: 'sunny' | 'cloudy' | 'rainy' | 'foggy'
          notes: string | null
          check_in_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_rating: number
          emotional_weather: 'sunny' | 'cloudy' | 'rainy' | 'foggy'
          notes?: string | null
          check_in_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood_rating?: number
          emotional_weather?: 'sunny' | 'cloudy' | 'rainy' | 'foggy'
          notes?: string | null
          check_in_date?: string
          updated_at?: string
        }
      }
      // ... other tables
    }
    Views: {
      user_engagement_summary: {
        Row: {
          user_id: string
          total_check_ins: number
          average_mood_rating: number
          // ... other fields
        }
      }
    }
    Functions: {
      get_check_in_streak: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_mood_trend: {
        Args: { p_user_id: string; p_days?: number }
        Returns: string
      }
    }
  }
}
```

### Custom Types

```typescript
// src/types/profile.ts
import type { Database } from './supabase'

export type UserCheckIn = Database['public']['Tables']['user_check_ins']['Row']
export type UserInsight = Database['public']['Tables']['user_insights']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductRecommendation = Database['public']['Tables']['product_recommendations']['Row']
export type Purchase = Database['public']['Tables']['purchases']['Row']

// Extended types with joins
export type ProductWithRecommendation = Product & {
  recommendation?: ProductRecommendation
}

export type PurchaseWithProduct = Purchase & {
  products: Pick<Product, 'name' | 'image_url' | 'slug'>
}

// Frontend-specific types
export type CheckInFormData = {
  mood_rating: number
  emotional_weather: 'sunny' | 'cloudy' | 'rainy' | 'foggy'
  notes?: string
}

export type MoodTrend = 'improving' | 'declining' | 'stable' | 'insufficient_data'

export type LoopType = 'people_pleasing' | 'perfectionism' | 'control' | 'avoidance'
```

---

## Supabase Client Setup

### Environment Variables

```env
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Client Configuration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'dailyhush-profile',
    },
  },
})

// Helper to get current user ID
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}
```

---

## React Hooks & Components

### useCheckIns Hook

```typescript
// src/hooks/useCheckIns.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserCheckIn } from '@/types/profile'

export function useCheckIns(userId: string, days: number = 30) {
  const [checkIns, setCheckIns] = useState<UserCheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchCheckIns() {
      try {
        setLoading(true)
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const { data, error } = await supabase
          .from('user_check_ins')
          .select('*')
          .eq('user_id', userId)
          .gte('check_in_date', startDate.toISOString().split('T')[0])
          .order('check_in_date', { ascending: false })

        if (error) throw error
        setCheckIns(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchCheckIns()
  }, [userId, days])

  return { checkIns, loading, error }
}
```

### useCheckInStreak Hook

```typescript
// src/hooks/useCheckInStreak.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useCheckInStreak(userId: string) {
  const [streak, setStreak] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStreak() {
      try {
        const { data, error } = await supabase.rpc('get_check_in_streak', {
          p_user_id: userId,
        })

        if (error) throw error
        setStreak(data || 0)
      } catch (err) {
        console.error('Error fetching streak:', err)
        setStreak(0)
      } finally {
        setLoading(false)
      }
    }

    fetchStreak()
  }, [userId])

  return { streak, loading }
}
```

### useInsights Hook

```typescript
// src/hooks/useInsights.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserInsight } from '@/types/profile'

export function useInsights(userId: string, tier: 'free' | 'premium' = 'free') {
  const [insights, setInsights] = useState<UserInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInsights() {
      try {
        const { data, error } = await supabase
          .from('user_insights')
          .select('*')
          .eq('user_id', userId)
          .eq('tier', tier)
          .eq('is_dismissed', false)
          .or('valid_until.is.null,valid_until.gt.' + new Date().toISOString())
          .order('confidence_score', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        setInsights(data || [])
      } catch (err) {
        console.error('Error fetching insights:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [userId, tier])

  const dismissInsight = async (insightId: string) => {
    const { error } = await supabase
      .from('user_insights')
      .update({
        is_dismissed: true,
        dismissed_at: new Date().toISOString(),
      })
      .eq('id', insightId)
      .eq('user_id', userId)

    if (!error) {
      setInsights(prev => prev.filter(i => i.id !== insightId))
    }

    return { error }
  }

  return { insights, loading, dismissInsight }
}
```

### useProductRecommendations Hook

```typescript
// src/hooks/useProductRecommendations.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { ProductWithRecommendation } from '@/types/profile'

export function useProductRecommendations(userId: string, limit: number = 3) {
  const [recommendations, setRecommendations] = useState<ProductWithRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const { data, error } = await supabase
          .from('product_recommendations')
          .select(`
            *,
            products (*)
          `)
          .eq('user_id', userId)
          .eq('dismissed', false)
          .eq('purchased', false)
          .or('valid_until.is.null,valid_until.gt.' + new Date().toISOString())
          .order('confidence_score', { ascending: false })
          .limit(limit)

        if (error) throw error

        // Transform data to flat structure
        const transformed = data?.map(rec => ({
          ...rec.products,
          recommendation: rec,
        })) || []

        setRecommendations(transformed)
      } catch (err) {
        console.error('Error fetching recommendations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [userId, limit])

  const trackClick = async (recommendationId: string) => {
    await supabase
      .from('product_recommendations')
      .update({
        clicked: true,
        clicked_at: new Date().toISOString(),
      })
      .eq('id', recommendationId)
  }

  const dismissRecommendation = async (recommendationId: string) => {
    const { error } = await supabase
      .from('product_recommendations')
      .update({
        dismissed: true,
        dismissed_at: new Date().toISOString(),
      })
      .eq('id', recommendationId)

    if (!error) {
      setRecommendations(prev =>
        prev.filter(r => r.recommendation?.id !== recommendationId)
      )
    }
  }

  return { recommendations, loading, trackClick, dismissRecommendation }
}
```

### CheckInForm Component

```typescript
// src/components/CheckInForm.tsx
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { CheckInFormData } from '@/types/profile'

interface CheckInFormProps {
  userId: string
  onSuccess?: () => void
}

export function CheckInForm({ userId, onSuccess }: CheckInFormProps) {
  const [formData, setFormData] = useState<CheckInFormData>({
    mood_rating: 3,
    emotional_weather: 'sunny',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('user_check_ins')
        .insert({
          user_id: userId,
          mood_rating: formData.mood_rating,
          emotional_weather: formData.emotional_weather,
          notes: formData.notes || null,
          check_in_date: new Date().toISOString().split('T')[0],
        })

      if (insertError) {
        // Handle duplicate check-in error
        if (insertError.code === '23505') {
          setError('You already checked in today!')
        } else {
          throw insertError
        }
        return
      }

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit check-in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mood Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">
          How are you feeling? (1-5)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, mood_rating: rating }))}
              className={`px-4 py-2 rounded ${
                formData.mood_rating === rating
                  ? 'bg-primary text-white'
                  : 'bg-gray-200'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      {/* Emotional Weather */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Emotional Weather
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['sunny', 'cloudy', 'rainy', 'foggy'].map(weather => (
            <button
              key={weather}
              type="button"
              onClick={() =>
                setFormData(prev => ({
                  ...prev,
                  emotional_weather: weather as CheckInFormData['emotional_weather'],
                }))
              }
              className={`p-4 rounded-lg border-2 ${
                formData.emotional_weather === weather
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200'
              }`}
            >
              {weather === 'sunny' && '☀️'}
              {weather === 'cloudy' && '☁️'}
              {weather === 'rainy' && '🌧️'}
              {weather === 'foggy' && '🌫️'}
              <div className="text-sm mt-2 capitalize">{weather}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Notes (optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full p-3 border rounded-lg"
          rows={3}
          placeholder="What's on your mind?"
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white py-3 rounded-lg disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Check-In'}
      </button>
    </form>
  )
}
```

---

## Common Workflows

### 1. Daily Check-In Flow

```typescript
// Step 1: Check if user already checked in today
async function hasTodayCheckIn(userId: string): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('user_check_ins')
    .select('id')
    .eq('user_id', userId)
    .eq('check_in_date', today)
    .maybeSingle()

  return !error && data !== null
}

// Step 2: Create check-in
async function createCheckIn(userId: string, formData: CheckInFormData) {
  const { data, error } = await supabase
    .from('user_check_ins')
    .insert({
      user_id: userId,
      mood_rating: formData.mood_rating,
      emotional_weather: formData.emotional_weather,
      notes: formData.notes || null,
      check_in_date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  return { data, error }
}
```

### 2. Product Checkout Flow

```typescript
// Step 1: Create Stripe checkout session (backend)
// Step 2: On success, create purchase record

async function createPurchase(params: {
  userId: string
  productId: string
  recommendationId?: string
  stripePaymentIntentId: string
  quantity: number
  totalPriceCents: number
}) {
  const { data, error } = await supabase
    .from('purchases')
    .insert({
      user_id: params.userId,
      product_id: params.productId,
      recommendation_id: params.recommendationId || null,
      stripe_payment_intent_id: params.stripePaymentIntentId,
      quantity: params.quantity,
      unit_price_cents: params.totalPriceCents / params.quantity,
      total_price_cents: params.totalPriceCents,
      purchase_status: 'completed',
    })
    .select()
    .single()

  return { data, error }
}

// Note: Trigger will automatically update recommendation.purchased = true
```

### 3. Insight Management Flow

```typescript
// Backend: Generate insights (use service key)
async function generateInsight(params: {
  userId: string
  title: string
  description: string
  category: string
  tier: 'free' | 'premium'
  confidenceScore: number
  loopType?: string
}) {
  const { data, error } = await supabaseAdmin // Service key client
    .from('user_insights')
    .insert({
      user_id: params.userId,
      title: params.title,
      description: params.description,
      category: params.category,
      tier: params.tier,
      confidence_score: params.confidenceScore,
      loop_type: params.loopType || null,
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })
    .select()
    .single()

  return { data, error }
}

// Frontend: Mark insight as read
async function markInsightRead(insightId: string, userId: string) {
  const { error } = await supabase
    .from('user_insights')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', insightId)
    .eq('user_id', userId)

  return { error }
}
```

---

## Error Handling

### Handling Common Errors

```typescript
// src/lib/errors.ts
export class CheckInError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'CheckInError'
  }
}

export function handleSupabaseError(error: any): string {
  // Unique constraint violation (duplicate check-in)
  if (error.code === '23505') {
    return 'You already checked in today!'
  }

  // Foreign key violation
  if (error.code === '23503') {
    return 'Invalid reference. Please try again.'
  }

  // Check constraint violation
  if (error.code === '23514') {
    return 'Invalid data. Please check your input.'
  }

  // RLS policy violation
  if (error.code === 'PGRST301') {
    return 'You do not have permission to access this resource.'
  }

  // Default error
  return error.message || 'An unexpected error occurred'
}
```

### Using Error Handler

```typescript
try {
  const { data, error } = await supabase
    .from('user_check_ins')
    .insert({ /* ... */ })

  if (error) throw error
} catch (err) {
  const errorMessage = handleSupabaseError(err)
  toast.error(errorMessage)
}
```

---

## Performance Optimization

### 1. Use React Query for Caching

```typescript
// src/hooks/useCheckInsQuery.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useCheckInsQuery(userId: string, days: number = 30) {
  return useQuery({
    queryKey: ['check-ins', userId, days],
    queryFn: async () => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('user_check_ins')
        .select('*')
        .eq('user_id', userId)
        .gte('check_in_date', startDate.toISOString().split('T')[0])
        .order('check_in_date', { ascending: false })

      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### 2. Real-time Subscriptions (Selective)

```typescript
// Only subscribe to critical updates
useEffect(() => {
  const channel = supabase
    .channel('user-insights')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_insights',
        filter: `user_id=eq.${userId}`,
      },
      payload => {
        // Add new insight to state
        setInsights(prev => [payload.new as UserInsight, ...prev])
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [userId])
```

### 3. Prefetch Related Data

```typescript
// Prefetch products when showing recommendations
async function prefetchProductData(productIds: string[]) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)

  return data
}
```

---

## Testing Strategy

### Unit Tests (Vitest)

```typescript
// src/hooks/__tests__/useCheckIns.test.ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCheckIns } from '../useCheckIns'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
      })),
    })),
  },
}))

describe('useCheckIns', () => {
  it('should fetch check-ins for user', async () => {
    const { result } = renderHook(() => useCheckIns('user-123', 7))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.checkIns).toBeDefined()
  })
})
```

### Integration Tests (Playwright)

```typescript
// tests/check-in.spec.ts
import { test, expect } from '@playwright/test'

test('user can submit daily check-in', async ({ page }) => {
  await page.goto('/profile')

  // Select mood rating
  await page.click('button:has-text("4")')

  // Select emotional weather
  await page.click('button:has-text("sunny")')

  // Add notes
  await page.fill('textarea[placeholder*="mind"]', 'Feeling great today!')

  // Submit
  await page.click('button:has-text("Submit Check-In")')

  // Verify success
  await expect(page.locator('text=Check-in submitted')).toBeVisible()
})
```

---

## Next Steps

1. ✅ Apply migration to Supabase
2. ✅ Generate TypeScript types
3. ✅ Set up Supabase client
4. ✅ Implement core hooks
5. ✅ Build UI components
6. ✅ Add error handling
7. ✅ Implement caching
8. ✅ Write tests
9. 🔄 Deploy and monitor

For questions or issues, refer to:
- [Schema Documentation](./SCHEMA_DOCUMENTATION.md)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
