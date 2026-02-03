/**
 * Supabase Database Types for HELGUS Marktplatz
 *
 * These types match the database schema and are used for type-safe Supabase queries.
 * Run SQL migrations in Supabase Dashboard > SQL Editor to create the tables.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ProductCondition = 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'
export type DeliveryOption = 'abholung' | 'versand'
export type OfferStatus = 'pending' | 'accepted' | 'declined'
export type NotificationType = 'new_message' | 'offer_received' | 'offer_accepted' | 'offer_declined' | 'price_drop' | 'purchase_initiated' | 'purchase_cancelled' | 'purchase_completed'
export type VerificationStatus = 'pending' | 'verified' | 'rejected'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          bio: string | null
          phone: string | null
          street: string | null
          house_number: string | null
          zip: string | null
          city: string | null
          country: string
          is_verified: boolean
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          street?: string | null
          house_number?: string | null
          zip?: string | null
          city?: string | null
          country?: string
          is_verified?: boolean
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          street?: string | null
          house_number?: string | null
          zip?: string | null
          city?: string | null
          country?: string
          is_verified?: boolean
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      seller_verifications: {
        Row: {
          id: string
          user_id: string
          full_name: string
          street: string
          house_number: string
          zip: string
          city: string
          country: string
          iban: string
          bic: string | null
          accepted_terms: boolean
          status: VerificationStatus
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          street: string
          house_number: string
          zip: string
          city: string
          country?: string
          iban: string
          bic?: string | null
          accepted_terms?: boolean
          status?: VerificationStatus
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          street?: string
          house_number?: string
          zip?: string
          city?: string
          country?: string
          iban?: string
          bic?: string | null
          accepted_terms?: boolean
          status?: VerificationStatus
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          parent_id?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          parent_id?: string | null
          sort_order?: number
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string
          category_id: string
          title: string
          description: string
          price: number
          is_negotiable: boolean
          condition: ProductCondition
          delivery_options: DeliveryOption[]
          shipping_cost: number | null
          street: string | null
          zip: string
          city: string
          country: string
          latitude: number | null
          longitude: number | null
          geocoded_at: string | null
          phone_contact_available: boolean
          view_count: number
          is_active: boolean
          sold_at: string | null
          buyer_id: string | null
          pending_since: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          category_id: string
          title: string
          description: string
          price: number
          is_negotiable?: boolean
          condition: ProductCondition
          delivery_options: DeliveryOption[]
          shipping_cost?: number | null
          street?: string | null
          zip: string
          city: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          geocoded_at?: string | null
          phone_contact_available?: boolean
          view_count?: number
          is_active?: boolean
          sold_at?: string | null
          buyer_id?: string | null
          pending_since?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          category_id?: string
          title?: string
          description?: string
          price?: number
          is_negotiable?: boolean
          condition?: ProductCondition
          delivery_options?: DeliveryOption[]
          shipping_cost?: number | null
          street?: string | null
          zip?: string
          city?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          geocoded_at?: string | null
          phone_contact_available?: boolean
          view_count?: number
          is_active?: boolean
          sold_at?: string | null
          buyer_id?: string | null
          pending_since?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          storage_path: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          storage_path: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          storage_path?: string
          sort_order?: number
          created_at?: string
        }
      }
      favorites: {
        Row: {
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          product_id: string
          buyer_id: string
          seller_id: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          buyer_id: string
          seller_id: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          buyer_id?: string
          seller_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          product_id: string
          buyer_id: string
          amount: number
          message: string | null
          status: OfferStatus
          responded_at: string | null
          shipping_method: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          buyer_id: string
          amount: number
          message?: string | null
          status?: OfferStatus
          responded_at?: string | null
          shipping_method?: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          buyer_id?: string
          amount?: number
          message?: string | null
          status?: OfferStatus
          responded_at?: string | null
          shipping_method?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          product_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          product_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          title?: string
          message?: string
          product_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          product_id: string
          seller_id: string
          buyer_id: string
          price_at_purchase: number
          purchase_type: 'direct' | 'offer_accepted'
          offer_id: string | null
          status: 'pending' | 'completed' | 'cancelled'
          purchased_at: string
          completed_at: string | null
          cancelled_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          seller_id: string
          buyer_id: string
          price_at_purchase: number
          purchase_type: 'direct' | 'offer_accepted'
          offer_id?: string | null
          status?: 'pending' | 'completed' | 'cancelled'
          purchased_at?: string
          completed_at?: string | null
          cancelled_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          seller_id?: string
          buyer_id?: string
          price_at_purchase?: number
          purchase_type?: 'direct' | 'offer_accepted'
          offer_id?: string | null
          status?: 'pending' | 'completed' | 'cancelled'
          purchased_at?: string
          completed_at?: string | null
          cancelled_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      product_condition: ProductCondition
      delivery_option: DeliveryOption
      offer_status: OfferStatus
      notification_type: NotificationType
      verification_status: VerificationStatus
    }
  }
}

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
