/**
 * Supabase Database Types for HELGUS Marktplatz
 *
 * Generated from live Supabase database using: supabase gen types typescript
 * Import and use these types for type-safe database queries.
 */

// Import all generated types from Supabase
export * from './database.generated'

// Re-import Database type for convenience
export type { Database } from './database.generated'

// Type helpers for accessing table types
import type { Database } from './database.generated'

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Export application enums
export type ProductCondition = 'neu' | 'wie-neu' | 'sehr-gut' | 'gut' | 'akzeptabel'
export type DeliveryOption = 'abholung' | 'versand'
export type OfferStatus = 'pending' | 'accepted' | 'declined'
export type NotificationType = Database['public']['Enums']['notification_type']
export type VerificationStatus = 'pending' | 'verified' | 'rejected'
