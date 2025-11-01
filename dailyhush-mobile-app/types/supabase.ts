export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      // ... (abbreviated for space - keeping only profile-related tables)
      user_check_ins: {
        Row: {
          check_in_date: string
          created_at: string
          emotional_weather: Database["public"]["Enums"]["emotional_weather"]
          id: string
          mood_rating: number
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in_date?: string
          created_at?: string
          emotional_weather: Database["public"]["Enums"]["emotional_weather"]
          id?: string
          mood_rating: number
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in_date?: string
          created_at?: string
          emotional_weather?: Database["public"]["Enums"]["emotional_weather"]
          id?: string
          mood_rating?: number
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_insights: {
        Row: {
          based_on_data_points: number | null
          category: Database["public"]["Enums"]["insight_category"]
          confidence_score: number | null
          created_at: string
          description: string
          dismissed_at: string | null
          id: string
          is_dismissed: boolean
          is_read: boolean
          loop_type: string | null
          read_at: string | null
          tier: Database["public"]["Enums"]["insight_tier"]
          title: string
          updated_at: string
          user_id: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          based_on_data_points?: number | null
          category?: Database["public"]["Enums"]["insight_category"]
          confidence_score?: number | null
          created_at?: string
          description: string
          dismissed_at?: string | null
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          loop_type?: string | null
          read_at?: string | null
          tier?: Database["public"]["Enums"]["insight_tier"]
          title: string
          updated_at?: string
          user_id: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          based_on_data_points?: number | null
          category?: Database["public"]["Enums"]["insight_category"]
          confidence_score?: number | null
          created_at?: string
          description?: string
          dismissed_at?: string | null
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          loop_type?: string | null
          read_at?: string | null
          tier?: Database["public"]["Enums"]["insight_tier"]
          title?: string
          updated_at?: string
          user_id?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          average_rating: number | null
          created_at: string
          currency: string
          description: string
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          loop_types: string[] | null
          meta_description: string | null
          meta_title: string | null
          name: string
          price_cents: number
          product_type: Database["public"]["Enums"]["product_type"]
          short_description: string | null
          slug: string
          stock_quantity: number | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          tags: string[] | null
          thumbnail_url: string | null
          total_reviews: number
          total_sales: number
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          created_at?: string
          currency?: string
          description: string
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          loop_types?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price_cents: number
          product_type: Database["public"]["Enums"]["product_type"]
          short_description?: string | null
          slug: string
          stock_quantity?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          total_reviews?: number
          total_sales?: number
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          created_at?: string
          currency?: string
          description?: string
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          loop_types?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price_cents?: number
          product_type?: Database["public"]["Enums"]["product_type"]
          short_description?: string | null
          slug?: string
          stock_quantity?: number | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          total_reviews?: number
          total_sales?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Enums: {
      emotional_weather: "sunny" | "cloudy" | "rainy" | "foggy"
      fulfillment_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
      insight_category: "pattern" | "progress" | "recommendation" | "celebration"
      insight_tier: "free" | "premium"
      product_type: "digital" | "physical" | "subscription"
      purchase_status: "pending" | "processing" | "completed" | "failed" | "refunded"
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
